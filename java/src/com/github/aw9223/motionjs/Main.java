package com.github.aw9223.motionjs;

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
