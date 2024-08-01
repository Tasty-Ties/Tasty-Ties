package com.teamcook.tastytieschat.chat.service;

import com.teamcook.tastytieschat.chat.entity.ChatMessage;

import java.util.Set;

public interface TranslationService {

    void translationChatMessage(ChatMessage chatMessage, Set<String> translatedLanguages) throws Exception;

}
