package com.github.yjcpa1_2017;

import edu.ufl.digitalworlds.j4k.J4KSDK;
import edu.ufl.digitalworlds.j4k.Skeleton;

import java.net.InetSocketAddress;
import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;

import org.java_websocket.WebSocket;
import org.java_websocket.handshake.ClientHandshake;
import org.java_websocket.server.WebSocketServer;

/**
 *
 * @author aw9223
 */
public class Kinect {
    
    private static Kinect INSTANCE;
    
    public static Kinect getInstance() {
        if (INSTANCE == null) {
            synchronized (Kinect.class) {
                if (INSTANCE == null) {
                    INSTANCE = new Kinect();
                }
            }
        }
        return INSTANCE;
    }
    
    private final KinectDevice mDevice;
    private final KinectWebSocketServer mWebSocketServer;
    
    private boolean mIsRunning = false;
    
    private final BlockingQueue<SkeletonJSON> mSkeleton = new BlockingQueue<>();

    private Kinect() {
        mWebSocketServer = new KinectWebSocketServer();
        mDevice = new KinectDevice();
    }
    
    public void start() {
        if (mIsRunning) {
            throw new RuntimeException("이미 실행중입니다.");
        }
        
        if ( ! mDevice.start(KinectDevice.SKELETON)) {
            throw new RuntimeException("키넥트를 연결할 수 없습니다.");
        }
        
        mWebSocketServer.start();
        mIsRunning = true;
    }
    
    private class KinectDevice extends J4KSDK {
        
        public KinectDevice() {
            super();
        }

        @Override
        public void onColorFrameEvent(byte[] arg0) {
        }

        @Override
        public void onDepthFrameEvent(short[] arg0, byte[] arg1, float[] arg2, float[] arg3) {
        }

        @Override
        public void onSkeletonFrameEvent(boolean[] arg0, float[] arg1, float[] arg2, byte[] arg3) {
            ArrayList<Skeleton> l = new ArrayList<>(getSkeletonCountLimit());

            for (int n = 0; n < arg0.length; ++n) {
                Skeleton skt = Skeleton.getSkeleton(n, arg0, arg1, arg2, arg3, this);
                if (skt.isTracked()) {
                    l.add(skt);
                }
            }

            if (l.isEmpty()) {
                return;
            }
            
            mSkeleton.push(new SkeletonJSON(l.get(0)));
        }
    }
    
    private class KinectWebSocketServer extends WebSocketServer {

        private static final int DEFAULT_PORT = 9003;
        
        private List<WebSocket> mSessions = new LinkedList();
        
        public KinectWebSocketServer() {
            super(new InetSocketAddress(DEFAULT_PORT));
        }

        @Override
        public void onOpen(WebSocket arg0, ClientHandshake arg1) {
            mSessions.add(arg0);
        }

        @Override
        public void onClose(WebSocket arg0, int arg1, String arg2, boolean arg3) {
            mSessions.remove(arg0);
        }

        @Override public void onMessage(WebSocket arg0, String arg1) { }
        @Override public void onError(WebSocket arg0, Exception arg1) { }
        
        private void broadcast(SkeletonJSON evt) {
            for (WebSocket sess : mSessions) {
                sess.send(evt.toString());
            }
        }

        @Override
        public void start() {
            new Thread(new Runnable() {

                @Override
                public void run() {
                    while(true) {
                        try {
                            broadcast(mSkeleton.poll());
                        }
                        catch(Exception e) {
                            e.printStackTrace();
                        }
                    }
                }
            }).start();

            super.start();
        }
    }
}
