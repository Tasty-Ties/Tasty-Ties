package com.teamcook.tastyties.config;

import com.teamcook.tastyties.common.entity.Country;
import com.teamcook.tastyties.common.entity.Language;
import com.teamcook.tastyties.common.repository.CountryRepository;
import com.teamcook.tastyties.common.repository.LanguageRepository;
import com.teamcook.tastyties.user.entity.User;
import com.teamcook.tastyties.user.repository.UserRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Component
public class DataInitializer {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final CountryRepository countryRepository;
    private final LanguageRepository languageRepository;

    public DataInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder, CountryRepository countryRepository, LanguageRepository languageRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.countryRepository = countryRepository;
        this.languageRepository = languageRepository;
    }

    @Value("${admin.password}")
    private String adminPassword;

    @PostConstruct
    public void init() {
        if (userRepository.findByUsername("admin").isEmpty()) {
            Country country = countryRepository.findById(1).orElse(null);
            Language language = languageRepository.findById(1).orElse(null);
            User admin = new User(country, language, "admin", passwordEncoder.encode(adminPassword), "admin",
                    LocalDate.now(), "admin@admin.com", "ADMIN");
            userRepository.save(admin);
        }
    }
}
