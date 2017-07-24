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

public class HTTPClient {

    public static String urlencode(String s) {
        try {
            return URLEncoder.encode(s, "UTF-8");
        }
        catch (UnsupportedEncodingException e) {
            throw new UnsupportedOperationException(e);
        }
    }

    public static String urlencode(Map<?,?> m) {
        StringBuilder sb = new StringBuilder();

        for (Map.Entry<?,?> e : m.entrySet()) {

            if (sb.length() > 0) {
                sb.append("&");
            }

            sb.append(String.format("%s=%s",
                urlencode(e.getKey().toString()),
                urlencode(e.getValue().toString())
            ));
        }

        return sb.toString();
    }

    public static String post(String url, String key, String value) throws IOException {
        Map<String, String> m = new HashMap<>();
        m.put(key, value);

        return exec(url, urlencode(m).getBytes(), "POST");
    }

    public static String post(String url, Map<?, ?> m) throws IOException {
        return exec(url, urlencode(m).getBytes(), "POST");
    }

    public static String exec(String url, byte[] bytes, String type) throws IOException {
        HttpURLConnection conn = null;

        try {
            conn = (HttpURLConnection) new URL(url).openConnection();
        }
        catch (MalformedURLException e) {
            e.printStackTrace();
            return null;
        }

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
