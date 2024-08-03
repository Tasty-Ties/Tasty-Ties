package com.teamcook.tastytieschat.chat.service;

import com.teamcook.tastytieschat.chat.service.uil.ClovaUtil;
import com.teamcook.tastytieschat.chat.service.uil.SpeechFlowUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.io.*;
import java.util.Base64;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;

@Slf4j
@Service
public class VoiceChatServiceImpl implements VoiceChatService {

    @Value("${ffmpeg.path}")
    private String ffmpegPath;
    private final String REDIS_KEY_PREFIX = "voiceData:";

    @Autowired
    private RedisTemplate<String, byte[]> redisTemplate;
    private ConcurrentHashMap<String, ConcurrentHashMap<Integer, String[]>> voiceDataMap = new ConcurrentHashMap<>();

    private ClovaUtil clovaUtil;
    private SpeechFlowUtil speechFlowUtil;


    public VoiceChatServiceImpl(ClovaUtil clovaUtill, SpeechFlowUtil speechFlowUtil) {
        this.clovaUtil = clovaUtill;
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
        String fullData = assembledData.toString();
        logFullDataToFile(roomId, userId, fullData);

        return fullData;
    }


    @Async
    @Override
    public CompletableFuture<String> translateVoiceToTextByMemory(String fullData) throws IOException, InterruptedException {
        byte[] wavBytes = getWavBytesAtRedis(fullData);
        return clovaUtil.translateVoiceToTextByByte(wavBytes)
                .thenApply(response -> response);
    }

    public byte[] getWavBytesAtRedis(String fullData) {
        String redisKey = REDIS_KEY_PREFIX + fullData.hashCode();

        // Redis 캐시에서 데이터 검색
        byte[] cachedBytes = redisTemplate.opsForValue().get(redisKey);
        if (cachedBytes != null) {
            return cachedBytes;
        }

        // Base64 디코딩
        byte[] decodedBytes = Base64.getDecoder().decode(fullData);

        // Redis에 캐시 저장 (예: 5분 동안 유지)
        redisTemplate.opsForValue().set(redisKey, decodedBytes, 5, TimeUnit.MINUTES);

        return decodedBytes;
    }

    byte[] getWavBytes(String fullData) {
        return Base64.getDecoder().decode(fullData);
    }

    // speechFlow 사용할 때는 mp3 file로 변환해서 저장해야 함.
    @Async
    @Override
    public CompletableFuture<String> translateVoiceToTextByFileSystem(String fullData) throws IOException, InterruptedException {
        String mp3FilePath = saveAndGetFilePath(fullData);
        return clovaUtil.translateVoiceToTextByFile(mp3FilePath)
                .thenApply(response -> response);
    }

    /**
     * @param fullData : 인코딩된 문자열
     * @return : mp3 파일이 저장된 경로 full path
     */
    String saveAndGetFilePath(String fullData) throws IOException, InterruptedException {
        byte[] decodedBytes = Base64.getDecoder().decode(fullData);
        UUID uuid = UUID.randomUUID();
        String wavFilePath = "./dump/" + uuid + ".wav";
        String mp3FilePath = "./dump/" + uuid + ".mp3";

        try (OutputStream os = new FileOutputStream(wavFilePath)) {
            os.write(decodedBytes);
        }

//        ProcessBuilder pb = new ProcessBuilder(ffmpegPath, "-i", wavFilePath, mp3FilePath);
//        Process process = pb.start();
//        int exitCode = process.waitFor();
//
//        if (exitCode != 0) {
//            throw new IOException("Error converting WAV to MP3");
//        }
//        return mp3FilePath;
        return wavFilePath;
    }

    //청크 파일 로그로 남기기 (테스트용)
    private void logFullDataToFile(String roomId, int userId, String fullData) {
        String logFileName = String.format("./log/long_sentence.txt", roomId, userId);
        try (BufferedWriter writer = new BufferedWriter(new FileWriter(logFileName))) {
            writer.write(fullData);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

}
