package com.github.aw9223.motionjs;

import java.util.LinkedList;

/**
 *
 * @author aw9223(차명도)
 */
public class BlockingQueue<T> {

    private final LinkedList<T> mQueue = new LinkedList();

    public T poll() {
        synchronized (mQueue) {
            try {
                while (mQueue.isEmpty()) {
                    mQueue.wait();
                }

                return mQueue.poll();
            } 
            catch (InterruptedException e) {
                throw new RuntimeException(e);
            }
        }
    }

    public void push(T o) {
        synchronized (mQueue) {
            mQueue.offer(o);
            mQueue.notifyAll();
        }
    }
}
