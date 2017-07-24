package com.github.yjcpa1.smart_mirror.service;

import android.app.Notification;
import android.content.Intent;
import android.graphics.Bitmap;
import android.os.AsyncTask;
import android.os.Bundle;
import android.os.Handler;
import android.service.notification.NotificationListenerService;
import android.service.notification.StatusBarNotification;
import android.util.Base64;
import android.util.Log;

import com.github.yjcpa1.smart_mirror.model.MessageModel;
import com.github.yjcpa1.smart_mirror.util.HTTPClient;
import com.google.gson.Gson;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by aw9223 on 2017-07-24.
 */

public class NotificationService extends NotificationListenerService {

    private Handler mHandler = new Handler();

    private List<String> mPackages = new ArrayList<String>() {{
        add("com.kakao.talk");

        add("com.android.mms");

        add("com.facebook.orca");
        add("com.facebook.katana");
    }};


    public static String convert(Bitmap bmp) {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        bmp.compress(Bitmap.CompressFormat.PNG, 100, baos);

        return "data:image/png;base64," + Base64.encodeToString(baos.toByteArray(), Base64.DEFAULT);
    }

    @Override
    public void onNotificationPosted(StatusBarNotification sbn) {
        final String pkg = sbn.getPackageName();
        final Bundle extras = sbn.getNotification().extras;

        if ( ! mPackages.contains(pkg)) {
            return;
        }

        Bitmap icon = (Bitmap) extras.get(Notification.EXTRA_LARGE_ICON);

        final MessageModel o = new MessageModel();
        o.title = extras.getString("android.title");
        o.contents = extras.getString("android.text");
        if (icon != null) {
            o.icon = convert(icon);
        }

        if ( ! o.validate()) {
            return;
        }

        new AsyncTask<String, Void, String>() {

            @Override
            protected String doInBackground(String[] params) {
                try {
                    HTTPClient.post("http://aw9223.synology.me/notify/push/", "message", new Gson().toJson(o));
                }
                catch(IOException e) {
                    e.printStackTrace();
                }
                return null;
            }

        }.execute();
    }


    @Override
    public void onNotificationRemoved(StatusBarNotification sbn) {
    }
}
