package com.teamcook.tastytieschat.chat.service;

import org.springframework.scheduling.annotation.Async;

import java.io.IOException;
import java.util.concurrent.CompletableFuture;

public interface VoiceChatService {
    void storeChunk(String roomId, int userId, int chunkIndex, int totalChunks, String chunkData);

    boolean isComplete(String roomId, int userId);

    String assembleChunks(String roomId, int userId);

    @Async
    CompletableFuture<String> translateVoiceToTextByFileSystem(String filePath) throws IOException, InterruptedException;

    @Async
    CompletableFuture<String> translateVoiceToTextByMemory(String fullData) throws IOException, InterruptedException;
}
