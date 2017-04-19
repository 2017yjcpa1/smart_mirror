
using System;
using System.Collections.Generic;

using Microsoft.Kinect;
using Newtonsoft.Json;
using System.Linq;

namespace KinectBody {

    public class JointJSON {
        public float x;
        public float y;
        public float z;

        public Boolean isTracked;
        public Boolean isTrusted;

        public JointJSON(Joint j) {
            this.x = j.Position.X;
            this.y = j.Position.Y;
            this.z = j.Position.Z;

            this.isTracked = j.TrackingState == TrackingState.Tracked;
            this.isTrusted = j.TrackingState == TrackingState.Inferred;
        }
    }

    public class HandJSON : JointJSON {

        public Boolean isOpened;
        public Boolean isLasso;

        public HandJSON(Joint j, HandState hs) : base(j) {
            isOpened = (hs == HandState.Open);
            isLasso = (hs == HandState.Lasso);
        }
    }

    public class SkeletonJSON {

        public JointJSON head;
        public JointJSON neck;

        public JointJSON spineShoulder;
        public JointJSON spineBase;
        public JointJSON spineMid;

        public JointJSON shoulderRight;
        public JointJSON elbowRight;
        public JointJSON wristRight;
        public JointJSON handRight;

        public JointJSON shoulderLeft;
        public JointJSON elbowLeft;
        public JointJSON wristLeft;
        public JointJSON handLeft;

        public JointJSON hipRight;
        public JointJSON kneeRight;
        public JointJSON ankleRight;
        public JointJSON footRight;

        public JointJSON hipLeft;
        public JointJSON kneeLeft;
        public JointJSON ankleLeft;
        public JointJSON footLeft;

        public SkeletonJSON(Body b) {
            this.head = new JointJSON(b.Joints[JointType.Head]);
            this.neck = new JointJSON(b.Joints[JointType.Neck]);

            this.spineShoulder = new JointJSON(b.Joints[JointType.SpineShoulder]);
            this.spineMid = new JointJSON(b.Joints[JointType.SpineMid]);
            this.spineBase = new JointJSON(b.Joints[JointType.SpineBase]);

            this.shoulderRight = new JointJSON(b.Joints[JointType.ShoulderRight]);
            this.elbowRight = new JointJSON(b.Joints[JointType.ElbowRight]);
            this.wristRight = new JointJSON(b.Joints[JointType.WristRight]);
            this.handRight = new HandJSON(b.Joints[JointType.HandRight], b.HandRightState);

            this.shoulderLeft = new JointJSON(b.Joints[JointType.ShoulderLeft]);
            this.elbowLeft = new JointJSON(b.Joints[JointType.ElbowLeft]);
            this.wristLeft = new JointJSON(b.Joints[JointType.WristLeft]);
            this.handLeft = new HandJSON(b.Joints[JointType.HandLeft], b.HandLeftState);

            this.hipRight = new JointJSON(b.Joints[JointType.HipRight]);
            this.kneeRight = new JointJSON(b.Joints[JointType.KneeRight]);
            this.ankleRight = new JointJSON(b.Joints[JointType.AnkleRight]);
            this.footRight = new JointJSON(b.Joints[JointType.FootRight]);

            this.hipLeft = new JointJSON(b.Joints[JointType.HipLeft]);
            this.kneeLeft = new JointJSON(b.Joints[JointType.KneeLeft]);
            this.ankleLeft = new JointJSON(b.Joints[JointType.AnkleLeft]);
            this.footLeft = new JointJSON(b.Joints[JointType.FootLeft]);
        }

        public override string ToString() {
            return JsonConvert.SerializeObject(this);
        }
    }
}
