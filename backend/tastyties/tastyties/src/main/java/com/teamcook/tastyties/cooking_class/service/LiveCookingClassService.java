package com.teamcook.tastyties.cooking_class.service;

import com.teamcook.tastyties.cooking_class.repository.*;
import com.teamcook.tastyties.exception.CookingClassNotFoundException;
import io.openvidu.java.client.*;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.nio.file.AccessDeniedException;
import java.util.Map;

@Service
@Slf4j
public class LiveCookingClassService {


    @Value("${OPENVIDU_URL}")
    private String OPENVIDU_URL;

    @Value("${OPENVIDU_SECRET}")
    private String OPENVIDU_SECRET;

    private OpenVidu openvidu;

    private final String CREATE_KEY_NAME = "cunstomSessionId";

    private final CookingClassRepository ccRepository;

    @PostConstruct
    public void init() {
        this.openvidu = new OpenVidu(OPENVIDU_URL, OPENVIDU_SECRET);
    }

    @Autowired
    public LiveCookingClassService(CookingClassRepository ccRepository) {
        this.ccRepository = ccRepository;
    }

    public String getLiveSessionId(Integer userId, String uuid)
            throws OpenViduJavaClientException, OpenViduHttpException, AccessDeniedException {
        if (ccRepository.findWithUuid(uuid) == null) {
            throw new CookingClassNotFoundException("해당 쿠킹 클래스가 존재하지 않습니다.");
        }
        if (!ccRepository.isCookingClassHost(userId, uuid)) {
            throw new AccessDeniedException("호스트가 아님");
        }
        Map<String, Object> params = Map.of(CREATE_KEY_NAME, uuid);
        SessionProperties properties = SessionProperties.fromJson(params).build();
        Session session = openvidu.createSession(properties);
        return session.getSessionId();
    }

    public void updateCookingClassSessionId(Integer userId, String sessionId) {

    }
}
