package com.github.yjcpa1.smart_mirror.util;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.UnsupportedEncodingException;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLEncoder;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by aw9223 on 2017-07-24.
 */

public class SimpleHttpClient {

    public static String post(String url, String key, String value) throws IOException {
        return exec(url, String.format("%s=%s", key, HttpUtil.urlencode(value)).getBytes(), "post");
    }

    public static String post(String url, Map<?, ?> m) throws IOException {
        return exec(url, HttpUtil.urlencode(m).getBytes(), "post");
    }

    public static String exec(String url, byte[] bytes, String type) throws IOException {
        HttpURLConnection conn = (HttpURLConnection) new URL(url).openConnection();

        conn.setRequestMethod(type.toUpperCase());

        conn.setDoInput(true);
        conn.setDoOutput(true);

        conn.setRequestProperty("Content-Type", "application/x-www-form-urlencoded");

        OutputStream os = conn.getOutputStream();
        os.write(bytes);
        os.flush();
        os.close();

        String str = null;

        StringBuffer sb = new StringBuffer();
        BufferedReader br = new BufferedReader(new InputStreamReader(conn.getInputStream()));

        while ((str = br.readLine()) != null) {
            sb.append(str);
        }

        br.close();

        return sb.toString();
    }
}
