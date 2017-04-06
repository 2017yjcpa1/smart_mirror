package com.github.yjcpa1.smart_mirror;

import com.google.gson.annotations.SerializedName;

/**
 *
 * @author aw9223
 */
public class Point3D {
    
    @SerializedName("x")
    private double mX;
    
    @SerializedName("y")
    private double mY;
    
    @SerializedName("z")
    private double mZ;
    
    public Point3D(double x, double y, double z) {
        mX = x;
        mY = y;
        mZ = z;
    }
    
    public Point3D(double[] pos) {
        this(pos[0], pos[1], pos[2]);
    }
}
