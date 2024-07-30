package com.teamcook.tastyties.common.controller;

import com.teamcook.tastyties.common.dto.CommonResponseDTO;
import com.teamcook.tastyties.common.dto.CountryResponseDTO;
import com.teamcook.tastyties.common.dto.LanguageResponseDTO;
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
    public ResponseEntity<CommonResponseDTO> getCountryCodeList() {
        List<Country> countryList = countryRepository.findAll();
        List<CountryResponseDTO> countryResponseDTOList = new ArrayList<>();

        for (Country country : countryList) {
            countryResponseDTOList.add(new CountryResponseDTO(
                    country.getAlpha2(), country.getEnglishName(),
                    country.getKoreanName()));
//            System.out.println("countryCode = " + countryCode + ", Country name= " + locale.getDisplayCountry());
        }
        Map<String, List<CountryResponseDTO>> map = new HashMap<>();
        map.put("countries", countryResponseDTOList);
        return new ResponseEntity<>(new CommonResponseDTO(200, "국가 목록 조회 성공", map),
                HttpStatus.OK);
    }

    @GetMapping("/languages")
    public ResponseEntity<CommonResponseDTO> getLanguageCodeList() {
        List<Language> languageList = languageRepository.findAll();
        List<LanguageResponseDTO> languageResponseDTOList = new ArrayList<>();
        for (Language language : languageList) {
            languageResponseDTOList.add(new LanguageResponseDTO(
                    language.getAlpha2(), language.getEnglish(),
                    language.getKorean()));
        }
        Map<String, List<LanguageResponseDTO>> map = new HashMap<>();
        map.put("languages", languageResponseDTOList);
        return new ResponseEntity<>(new CommonResponseDTO(200, "언어 목록 조회 성공", map),
                HttpStatus.OK);
    }
}
