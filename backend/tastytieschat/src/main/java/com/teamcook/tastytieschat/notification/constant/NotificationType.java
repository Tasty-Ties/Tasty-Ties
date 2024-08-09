package com.teamcook.tastytieschat.notification.constant;

public enum NotificationType {
    NEW_CHAT_MESSAGE("새로운 메시지") {
        @Override
        public String generateBodyWittChatRoomTitle(String chatRoomTitle) {
            return "'" + chatRoomTitle + "'에 새로운 메시지가 도착했습니다.";
        }
    };

    private final String title;

    NotificationType(String title) {
        this.title = title;
    }

    public String getTitle() {
        return title;
    }

    public String generateBodyWittChatRoomTitle(String chatRoomTitle) {
        throw new UnsupportedOperationException("This method is not supported for this notification type.");
    };
}
