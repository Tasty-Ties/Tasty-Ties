package com.teamcook.tastytieschat.chat.constant;

public enum Language {
    EN("English"),
    KO("Korean"),
    ZH("Chinese"),
    JA("Japanese"),
    ES("Spanish"),
    FR("French"),
    DE("German"),
    RU("Russian"),
    IT("Italian"),
    PT("Portuguese"),
    AR("Arabic"),
    HI("Hindi"),
    VI("Vietnamese"),
    TH("Thai"),
    TR("Turkish");

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
}
