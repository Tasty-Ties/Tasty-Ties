package com.teamcook.tastyties.notification.constant;

public enum NotificationType {
    DELETION_COOKING_CLASS("쿠킹 클래스 삭제") {
        @Override
        public String generateBodyWithCookingClassName(String cookingClassName) {
            return "'" + cookingClassName + "'라는 쿠킹 클래스가 삭제되었습니다.";
        }
    },
    RESERVATION_COOKING_CLASS("쿠킹 클래스 예약") {
        @Override
        public String generateBodyWithUserAndCookingClassName(String userName, String cookingClassName) {
            return userName + "님이 '" + cookingClassName + "'라는 쿠킹 클래스를 예약했습니다.";
        }
    },
    LEAVE_COOKING_CLASS("쿠킹 클래스 예약 취소") {
        @Override
        public String generateBodyWithUserAndCookingClassName(String userName, String cookingClassName) {
            return userName + "님이 '" + cookingClassName + "'라는 쿠킹 클래스 예약을 취소했습니다.";
        }
    };

    private final String title;

    NotificationType(String title) {
        this.title = title;
    }

    public String getTitle() {
        return title;
    }

    public String generateBodyWithCookingClassName(String cookingClassName) {
        throw new UnsupportedOperationException("This method is not supported for this notification type.");
    };

    public String generateBodyWithUserAndCookingClassName(String userName, String cookingClassName) {
        throw new UnsupportedOperationException("This method is not supported for this notification type.");
    };
}
