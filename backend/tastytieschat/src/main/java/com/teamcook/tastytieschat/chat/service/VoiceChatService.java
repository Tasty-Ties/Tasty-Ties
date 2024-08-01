package com.teamcook.tastytieschat.chat.service;

import java.io.IOException;

public interface VoiceChatService {
    void storeChunk(String roomId, int userId, int chunkIndex, int totalChunks, String chunkData);

    boolean isComplete(String roomId, int userId);

    String assembleChunks(String roomId, int userId);

    String getMp3filePath(String fullData) throws IOException, InterruptedException;

    String sendFileToSpeechFlow(String filePath) throws IOException;

    String queryTranscriptionResult(String taskId) throws IOException, InterruptedException;
}
