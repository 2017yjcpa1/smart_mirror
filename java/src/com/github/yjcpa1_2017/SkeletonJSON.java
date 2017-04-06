package com.github.yjcpa1_2017;

import com.google.gson.Gson;
import com.google.gson.annotations.SerializedName;

import edu.ufl.digitalworlds.j4k.Skeleton;

/**
 *
 * @author aw9223
 */
public class SkeletonJSON {

    @SerializedName("head")
    private Point3D mHead;
    @SerializedName("neck")
    private Point3D mNeck;
    
    @SerializedName("spineShoulder")
    private Point3D mSpineShoulder;
    @SerializedName("spineBase")
    private Point3D mSpineBase;
    @SerializedName("spineMid")
    private Point3D mSpineMid;
    
    @SerializedName("shoulderRight")
    private Point3D mShoulderRight;
    @SerializedName("elbowRight")
    private Point3D mElbowRight;
    @SerializedName("wristRight")
    private Point3D mWristRight;
    @SerializedName("handRight")
    private Point3D mHandRight;
    
    @SerializedName("hipRight")
    private Point3D mHipRight;
    @SerializedName("kneeRight")
    private Point3D mKneeRight;
    @SerializedName("ankleRight")
    private Point3D mAnkleRight;
    @SerializedName("footRight")
    private Point3D mFootRight;
    
    @SerializedName("shoulderLeft")
    private Point3D mShoulderLeft;
    @SerializedName("elbowLeft")
    private Point3D mElbowLeft;
    @SerializedName("wristLeft")
    private Point3D mWristLeft;
    @SerializedName("handLeft")
    private Point3D mHandLeft;
    
    @SerializedName("hipLeft")
    private Point3D mHipLeft;
    @SerializedName("kneeLeft")
    private Point3D mKneeLeft;
    @SerializedName("ankleLeft")
    private Point3D mAnkleLeft;
    @SerializedName("footLeft")
    private Point3D mFootLeft;

    public SkeletonJSON(Skeleton skt) {
        mHead = new Point3D(skt.get3DJoint(Skeleton.HEAD));
        mNeck = new Point3D(skt.get3DJoint(Skeleton.NECK));
        
        mSpineMid = new Point3D(skt.get3DJoint(Skeleton.SPINE_MID));
        mSpineShoulder = new Point3D(skt.get3DJoint(Skeleton.SPINE_SHOULDER));
        mSpineBase = new Point3D(skt.get3DJoint(Skeleton.SPINE_BASE));

        mShoulderRight = new Point3D(skt.get3DJoint(Skeleton.SHOULDER_RIGHT));
        mElbowRight = new Point3D(skt.get3DJoint(Skeleton.ELBOW_RIGHT));
        mWristRight = new Point3D(skt.get3DJoint(Skeleton.WRIST_RIGHT));
        mHandRight = new Point3D(skt.get3DJoint(Skeleton.HAND_RIGHT));

        mHipRight = new Point3D(skt.get3DJoint(Skeleton.HIP_RIGHT));
        mKneeRight = new Point3D(skt.get3DJoint(Skeleton.KNEE_RIGHT));
        mAnkleRight = new Point3D(skt.get3DJoint(Skeleton.ANKLE_RIGHT));
        mFootRight = new Point3D(skt.get3DJoint(Skeleton.FOOT_RIGHT));
        
        mShoulderLeft = new Point3D(skt.get3DJoint(Skeleton.SHOULDER_LEFT));
        mElbowLeft = new Point3D(skt.get3DJoint(Skeleton.ELBOW_LEFT));
        mWristLeft = new Point3D(skt.get3DJoint(Skeleton.WRIST_LEFT));
        mHandLeft = new Point3D(skt.get3DJoint(Skeleton.HAND_LEFT));
        
        mHipLeft = new Point3D(skt.get3DJoint(Skeleton.HIP_LEFT));
        mKneeLeft = new Point3D(skt.get3DJoint(Skeleton.KNEE_LEFT));
        mAnkleLeft = new Point3D(skt.get3DJoint(Skeleton.ANKLE_LEFT));
        mFootLeft = new Point3D(skt.get3DJoint(Skeleton.FOOT_LEFT));
    }
    
    @Override
    public String toString() {
        return new Gson().toJson(this);
    }
}
