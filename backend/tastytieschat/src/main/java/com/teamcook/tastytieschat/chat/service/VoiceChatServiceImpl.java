package com.teamcook.tastytieschat.chat.service;

import org.springframework.stereotype.Service;

import java.util.concurrent.ConcurrentHashMap;

@Service
public class VoiceChatServiceImpl implements VoiceChatService {

    private ConcurrentHashMap<String, ConcurrentHashMap<Integer, String[]>> voiceDataMap = new ConcurrentHashMap<>();

    //청크 저장
    @Override
    public synchronized void storeChunk(String roomId, int userId, int chunkIndex, int totalChunks, String chunkData) {
        voiceDataMap.putIfAbsent(roomId, new ConcurrentHashMap<>()); //ConcurrentHashMap -> 쓰기를 할 때 특정 버킷에 Lock 걸기
        ConcurrentHashMap<Integer, String[]> userChunksMap = voiceDataMap.get(roomId);

        userChunksMap.putIfAbsent(userId, new String[totalChunks]);
        userChunksMap.get(userId)[chunkIndex] = chunkData;
    }

    //모든 청크가 도착했는지 확인
    @Override
    public synchronized boolean isComplete(String roomId, int userId) {
        ConcurrentHashMap<Integer, String[]> userChunksMap = voiceDataMap.get(roomId);
        String[] chunks = userChunksMap.get(userId);
        for (String chunk : chunks) {
            if (chunk == null) {
                return false;
            }
        }
        return true;
    }

    //청크를 하나의 문자열로 재조립
    @Override
    public synchronized String assembleChunks(String roomId, int userId) {
        ConcurrentHashMap<Integer, String[]> userChunksMap = voiceDataMap.get(roomId);
        String[] chunks = userChunksMap.remove(userId);
        StringBuilder assembledData = new StringBuilder();
        for (String chunk : chunks) {
            assembledData.append(chunk);
        }
        return assembledData.toString();
    }
}
