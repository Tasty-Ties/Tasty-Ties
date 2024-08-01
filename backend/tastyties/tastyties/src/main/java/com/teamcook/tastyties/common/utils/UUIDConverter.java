package com.teamcook.tastyties.common.utils;

import java.util.UUID;

public class UUIDConverter {

    public static String convertUUIDToHex(String uuid) {
        return "0x" + uuid.replace("-", "").toUpperCase();
    }
}
