package com.teamcook.tastyties.config;

import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@Slf4j
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        String resourceLocation = "file:" + "///C:/Users/SSAFY/ssafy/files/image" + "/";
        registry.addResourceHandler("/api/v1/files/**")
                .addResourceLocations(resourceLocation);
        log.debug("Resource location: {}", resourceLocation);
    }

    @PostConstruct
    public void postConstruct() {
        log.debug("WebConfig postConstruct called");
    }
}

