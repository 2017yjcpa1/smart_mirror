package com.github.yjcpa1.smart_mirror;

/**
 *
 * @author aw9223
 */
public class Main {
    
    public static void main(String args[]) {
        Kinect knt = Kinect.getInstance();
        knt.start();
    }
}
