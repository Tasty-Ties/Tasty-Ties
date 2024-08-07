package com.teamcook.tastyties.notification.constant;

public enum NotificationType {
    DELETION_COOKING_CLASS("쿠킹 클래스 삭제") {
        @Override
        public String generateBodyWithCookingClassName(String cookingClassName) {
            return "'" + cookingClassName + "'라는 쿠킹 클래스가 삭제되었습니다.";
        }
    };

    private final String title;

    NotificationType(String title) {
        this.title = title;
    }

    public String getTitle() {
        return title;
    }

    public abstract String generateBodyWithCookingClassName(String cookingClassName);
}
