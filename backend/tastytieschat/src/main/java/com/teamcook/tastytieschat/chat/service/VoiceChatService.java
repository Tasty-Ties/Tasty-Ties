package com.teamcook.tastytieschat.chat.service;

import org.springframework.scheduling.annotation.Async;

import java.io.IOException;
import java.util.concurrent.CompletableFuture;

public interface VoiceChatService {
    void storeChunk(String roomId, String username, int chunkIndex, int totalChunks, String chunkData);

    boolean isComplete(String roomId, String username);

    String assembleChunks(String roomId, String username);

    @Async
    CompletableFuture<String> translateVoiceToTextByFileSystem(String filePath) throws IOException, InterruptedException;

    @Async
    CompletableFuture<String> translateVoiceToTextByMemory(String fullData) throws IOException, InterruptedException;
}
