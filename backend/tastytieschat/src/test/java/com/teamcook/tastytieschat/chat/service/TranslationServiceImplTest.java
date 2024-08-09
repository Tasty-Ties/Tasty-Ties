package com.teamcook.tastytieschat.chat.service;

import com.teamcook.tastytieschat.chat.constant.MessageType;
import com.teamcook.tastytieschat.chat.dto.ChatMessageRequestDto;
import com.teamcook.tastytieschat.chat.dto.UserDto;
import com.teamcook.tastytieschat.chat.entity.ChatMessage;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.Map;
import java.util.Set;

@SpringBootTest
class TranslationServiceImplTest {

    @Autowired
    TranslationService translationService;

    @Autowired
    ChatRoomService chatRoomService;

    private String roomId;
    private ChatMessageRequestDto chatMessageRequestDTO;
    private final String shortSentence = "안녕 나는 오늘 인도 카레를 만들거야";
    private final String longSentence = "안녕하세요 여러분, 오늘의 쿠킹 클래스에 오신 것을 환영합니다. 오늘은 맛있는 인도 카레를 만들어보겠습니다. 먼저, 강황, 큐민, 고수 같은 향신료를 포함한 모든 재료를 준비해 주세요. 다음으로, 팬에 기름을 두르고 양파를 황금빛 갈색이 될 때까지 볶아주세요. 그런 다음, 향신료를 추가하고 몇분 동안 요리한 후 잘게 썬 토마토를 넣어주세요.";

    @BeforeEach
    void setUp() {
        chatMessageRequestDTO = new ChatMessageRequestDto("ssafy", longSentence);
        roomId = "66a9c5dd498fe728acb763f8";
    }

    @Test
    @DisplayName("문장을 GPT로 변환")
    void sendShortFileToSpeechFlowTest() throws Exception {
        long startTime = System.currentTimeMillis();

        Map<String, Object> map = chatRoomService.getChatRoomInfoForChatMessage(roomId, chatMessageRequestDTO.getUsername());
        UserDto userDto = (UserDto) map.get("user");

        ChatMessage chatMessage = ChatMessage.builder().type(MessageType.USER).chatRoomId(roomId).username(chatMessageRequestDTO.getUsername()).originLanguage(userDto.getLanguage()).originMessage(chatMessageRequestDTO.getMessage()).build();

        Set<String> translatedLanguages = (Set<String>) map.get("translatedLanguages");
        translationService.translationChatMessage(chatMessage, translatedLanguages);

        long endTime = System.currentTimeMillis();
        long duration = endTime - startTime;
        System.out.println("번역에 걸린 시간: " + duration + " ms");

        System.out.println(chatMessage);
        Assertions.assertNotNull(chatMessage);
    }

}