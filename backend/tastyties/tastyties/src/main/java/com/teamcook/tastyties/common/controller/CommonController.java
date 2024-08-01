package com.teamcook.tastyties.common.controller;

import com.teamcook.tastyties.common.dto.CommonResponseDto;
import com.teamcook.tastyties.common.dto.CountryResponseDto;
import com.teamcook.tastyties.common.dto.LanguageResponseDto;
import com.teamcook.tastyties.common.entity.Country;
import com.teamcook.tastyties.common.entity.Language;
import com.teamcook.tastyties.common.repository.CountryRepository;
import com.teamcook.tastyties.common.repository.LanguageRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.*;

@RestController
@Slf4j
public class CommonController {

    private final LanguageRepository languageRepository;
    private final CountryRepository countryRepository;

    @Autowired
    public CommonController(LanguageRepository languageRepository, CountryRepository countryRepository) {
        this.languageRepository = languageRepository;
        this.countryRepository = countryRepository;
    }

    @GetMapping("/countries")
    public ResponseEntity<CommonResponseDto> getCountryCodeList() {
        List<Country> countryList = countryRepository.findAll();
        List<CountryResponseDto> countryResponseDtoList = new ArrayList<>();

        for (Country country : countryList) {
            countryResponseDtoList.add(new CountryResponseDto(
                    country.getAlpha2(), country.getEnglishName(),
                    country.getKoreanName(), country.getCountryImageUrl()));
//            System.out.println("countryCode = " + countryCode + ", Country name= " + locale.getDisplayCountry());
        }
        Map<String, List<CountryResponseDto>> map = new HashMap<>();
        map.put("countries", countryResponseDtoList);
        return new ResponseEntity<>(new CommonResponseDto(200, "국가 목록 조회 성공", map),
                HttpStatus.OK);
    }

    @GetMapping("/languages")
    public ResponseEntity<CommonResponseDto> getLanguageCodeList() {
        List<Language> languageList = languageRepository.findAll();
        List<LanguageResponseDto> languageResponseDtoList = new ArrayList<>();
        for (Language language : languageList) {
            languageResponseDtoList.add(new LanguageResponseDto(
                    language.getAlpha2(), language.getEnglish(),
                    language.getKorean()));
        }
        Map<String, List<LanguageResponseDto>> map = new HashMap<>();
        map.put("languages", languageResponseDtoList);
        return new ResponseEntity<>(new CommonResponseDto(200, "언어 목록 조회 성공", map),
                HttpStatus.OK);
    }
}
