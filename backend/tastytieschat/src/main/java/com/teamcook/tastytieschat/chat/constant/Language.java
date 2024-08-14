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
        return this.name.equals(capitalizeFirstLetter(language));
    }

    public static boolean contains(String language) {
        language = capitalizeFirstLetter(language);
        for (Language l: Language.values()) {
            if (l.getName().equals(language)) {
                return true;
            }
        }

        return false;
    }

    public static String capitalizeFirstLetter(String input) {
        if (input == null || input.isEmpty()) {
            return input;
        }
        return input.substring(0, 1).toUpperCase() + input.substring(1).toLowerCase();
    }
}
