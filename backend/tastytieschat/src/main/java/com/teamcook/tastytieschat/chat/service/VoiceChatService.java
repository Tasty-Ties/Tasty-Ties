package com.teamcook.tastytieschat.chat.service;

import java.io.FileNotFoundException;
import java.io.IOException;

public interface VoiceChatService {
    void storeChunk(String roomId, int userId, int chunkIndex, int totalChunks, String chunkData);

    boolean isComplete(String roomId, int userId);

    String assembleChunks(String roomId, int userId);

    String getConvertedString(String fullData) throws IOException;
}
