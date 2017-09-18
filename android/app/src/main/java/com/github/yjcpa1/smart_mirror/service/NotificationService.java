package com.github.yjcpa1.smart_mirror.service;

import android.app.Notification;
import android.graphics.Bitmap;
import android.os.AsyncTask;
import android.os.Bundle;
import android.os.Handler;
import android.service.notification.NotificationListenerService;
import android.service.notification.StatusBarNotification;

import com.github.yjcpa1.smart_mirror.model.MessageModel;
import com.github.yjcpa1.smart_mirror.util.SimpleHttpClient;
import com.github.yjcpa1.smart_mirror.util.ImageUtil;
import com.google.gson.Gson;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by aw9223 on 2017-07-24.
 */

public class NotificationService extends NotificationListenerService {

    private Handler mHandler = new Handler();

    private List<String> mPackages = new ArrayList<String>() {{
        add("com.kakao.talk"); // 카카오톡

        add("jp.naver.line.android"); // 라인

        add("com.skype.raider"); // 스카이프프

        add("com.android.mms"); // 문자메세지

        add("org.telegram.messenger"); // 텔레그램

        add("com.instagram.android"); // 인스타그램

        add("com.twitter.android"); // 트위터

        add("com.google.android.gm"); // 지메일

        add("com.snapchat.android"); // 스냅챗

        add("com.facebook.mlite"); // 페이스북 메신저 라이트
        add("com.facebook.orca"); // 페이스북 메신저
        add("com.facebook.lite"); // 페이스북 라이트
        add("com.facebook.katana"); // 페이스북
    }};

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
        o.packageName = pkg;

        if (icon != null) {
            o.icon = ImageUtil.toDataURL(icon);
        }

        if ( ! o.validate()) {
            return;
        }

        new AsyncTask<String, Void, String>() {

            @Override
            protected String doInBackground(String[] params) {
                try {
                    SimpleHttpClient.post("http://aw9223.synology.me/api/index.php/notify/push/", "message", new Gson().toJson(o));
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
