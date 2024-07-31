package com.teamcook.tastytieschat.chat.service;

public interface VoiceChatService {
    void storeChunk(String roomId, int userId, int chunkIndex, int totalChunks, String chunkData);

    boolean isComplete(String roomId, int userId);

    String assembleChunks(String roomId, int userId);
}
