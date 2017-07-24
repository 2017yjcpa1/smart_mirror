package com.github.yjcpa1.smart_mirror.util;

import android.graphics.Bitmap;
import android.util.Base64;

import java.io.ByteArrayOutputStream;

/**
 * Created by aw9223 on 2017-07-24.
 */

public class ImageUtil {

    public static String toDataURL(Bitmap bmp) {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();

        bmp.compress(Bitmap.CompressFormat.PNG, 100, baos);

        return "data:image/png;base64," + Base64.encodeToString(baos.toByteArray(), Base64.DEFAULT);
    }
}
