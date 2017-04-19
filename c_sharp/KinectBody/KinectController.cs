using System;
using System.Collections.Generic;

using Microsoft.Kinect;
using Newtonsoft.Json;
using System.Linq;

namespace KinectBody {

    public class KinectEventArgs : EventArgs {
        public string Skeleton { get; private set; }

        public KinectEventArgs(SkeletonJSON s) {
            Skeleton = JsonConvert.SerializeObject(s);
        }
    }

    public class KinectController {

        private KinectSensor mKinectSensor = null;
        private BodyFrameReader mBodyFrameReader = null;
        private Body[] mBodies = null;

        public event EventHandler<KinectEventArgs> OnKinectReceivedBody;

        public KinectController() {
            mKinectSensor = KinectSensor.GetDefault();

            if (mKinectSensor == null) {
                throw new Exception("Kinect 연결을 확인 해주세요.");
            }

            mKinectSensor.Open();

            mBodies = new Body[mKinectSensor.BodyFrameSource.BodyCount];

            mBodyFrameReader = mKinectSensor.BodyFrameSource.OpenReader();
            mBodyFrameReader.FrameArrived += OnFrameArrived;
        }

        public void Close() {
            if (mBodyFrameReader != null) {
                mBodyFrameReader.Dispose();
                mBodyFrameReader = null;
            }

            if (mKinectSensor != null) {
                mKinectSensor.Close();
                mKinectSensor = null;
            }
        }

        private void OnFrameArrived(object o, BodyFrameArrivedEventArgs e) {
            BodyFrameReference brf = e.FrameReference;
            BodyFrame bf = brf.AcquireFrame();

            if (bf != null) {
                using (bf) {
                    bf.GetAndRefreshBodyData(mBodies);
                    
                    Body b = null;
                    float f = float.MaxValue;

                    foreach (Body v in mBodies) {
                        if (v.IsTracked) {
                            float z = v.Joints[JointType.SpineMid].Position.Z;
                            if (z > 0.5 && z < f) {
                                f = z;
                                b = v;
                            }
                        }
                    }

                    if (b != null) {
                        OnKinectReceivedBody(this, new KinectEventArgs(new SkeletonJSON(b)));
                    }
                }
            }
        }
    }
}
