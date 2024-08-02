package com.teamcook.tastytieschat.chat.service;

import com.teamcook.tastytieschat.chat.service.uil.ClovaUtil;
import com.teamcook.tastytieschat.chat.service.uil.SpeechFlowUtil;
import org.springframework.beans.factory.annotation.Value;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.*;
import java.util.Base64;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@Service
public class VoiceChatServiceImpl implements VoiceChatService {

    @Value("${ffmpeg.path}")
    private String ffmpegPath;

    private ConcurrentHashMap<String, ConcurrentHashMap<Integer, String[]>> voiceDataMap = new ConcurrentHashMap<>();

    private ClovaUtil clovaUtill;
    private SpeechFlowUtil speechFlowUtil;

    public VoiceChatServiceImpl(ClovaUtil clovaUtill, SpeechFlowUtil speechFlowUtil) {
        this.clovaUtill = clovaUtill;
        this.speechFlowUtil = speechFlowUtil;
    }

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

    @Override
    public String translateVoiceToText(String fullData) throws IOException, InterruptedException {
        String filePath = getMp3filePath(fullData);
        return clovaUtill.translateVoiceToText(filePath);
    }

    /**
     * @param fullData : 인코딩된 문자열
     * @return : mp3 파일이 저장된 경로 full path
     */
    private String getMp3filePath(String fullData) throws IOException, InterruptedException {
        // Base64 디코딩
        byte[] decodedBytes = Base64.getDecoder().decode(fullData);
        UUID uuid = UUID.randomUUID();
        String wavFilePath = "./static/" + uuid + ".wav";
        String mp3FilePath = "./static/" + uuid + ".mp3";

        // 디코딩된 바이트를 WAV 파일로 저장
        try (OutputStream os = new FileOutputStream(wavFilePath)) {
            os.write(decodedBytes);
        }

        // ffmpeg를 사용하여 WAV 파일을 MP3로 변환
        ProcessBuilder pb = new ProcessBuilder(ffmpegPath, "-i", wavFilePath, mp3FilePath);
        Process process = pb.start();
        int exitCode = process.waitFor();

        if (exitCode != 0) {
            throw new IOException("Error converting WAV to MP3");
        }

        return mp3FilePath;
    }

}
