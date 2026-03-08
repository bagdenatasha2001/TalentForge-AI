package com.talentforge;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class TalentForgeApplication {
    public static void main(String[] args) {
        SpringApplication.run(TalentForgeApplication.class, args);
    }
}
