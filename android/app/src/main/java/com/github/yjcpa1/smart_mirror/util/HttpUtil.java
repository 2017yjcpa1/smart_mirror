package com.github.yjcpa1.smart_mirror.util;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.Map;

/**
 * Created by aw9223 on 2017-07-24.
 */

public class HttpUtil {


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
                urlencode(e.getValue().toString())));
        }

        return sb.toString();
    }
}
