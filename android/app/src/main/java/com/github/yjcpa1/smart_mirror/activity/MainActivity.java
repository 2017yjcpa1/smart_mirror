package com.github.yjcpa1.smart_mirror.activity;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;

import com.github.yjcpa1.smart_mirror.R;

public class MainActivity extends Activity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);


        Intent intent = new Intent("android.settings.ACTION_NOTIFICATION_LISTENER_SETTINGS");//안드로이드 설정쪽으로 넘어가는 부분
        startActivity(intent);
    }
}
