package com.teamcook.tastytieschat.chat.constant;

public enum Language {
    EN("english"),
    KO("korean"),
    ZH("chinese"),
    JA("japanese"),
    ES("spanish"),
    FR("french"),
    DE("german"),
    RU("russian"),
    IT("italian"),
    PT("portuguese"),
    AR("arabic"),
    HI("hindi"),
    VI("vietnamese"),
    TH("thai"),
    TR("turkish");

    private final String name;

    Language(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

    public boolean equals(String language) {
        return this.name.equals(language);
    }

    public static boolean contains(String language) {
        language = language.toLowerCase();
        for (Language l: Language.values()) {
            if (l.getName().equals(language)) {
                return true;
            }
        }

        return false;
    }
}
