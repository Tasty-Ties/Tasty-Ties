package com.teamcook.tastytieschat;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class TastytieschatApplication {

    public static void main(String[] args) {
        Dotenv dotenv = Dotenv.configure().load();

        dotenv.entries().forEach(entry ->
                System.setProperty(entry.getKey(), entry.getValue())
        );
        SpringApplication.run(TastytieschatApplication.class, args);
    }

}
