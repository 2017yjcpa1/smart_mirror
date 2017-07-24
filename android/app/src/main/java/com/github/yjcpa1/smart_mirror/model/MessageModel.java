package com.github.yjcpa1.smart_mirror.model;

import android.graphics.Bitmap;

/**
 * Created by aw9223 on 2017-07-24.
 */

public class MessageModel {

    public String title;
    public String contents;
    public String icon;
    public String packageName;

    public boolean validate() {
        if (packageName == null || packageName.isEmpty()) {
            return false;
        }

        if (title == null || title.isEmpty()) {
            return false;
        }

        if (contents == null || contents.isEmpty()) {
            return false;
        }

        return true;
    }
}
