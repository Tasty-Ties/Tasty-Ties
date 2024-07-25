package com.b206.tastyties.common.controller;

import com.b206.tastyties.common.dto.CommonResponseDTO;
import com.b206.tastyties.common.dto.CountryCodeResponseDTO;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

@Controller
public class CommonController {

    @GetMapping("/countries")
    public ResponseEntity<CommonResponseDTO> getCountryCodeList() {
        String[] countryCodes = Locale.getISOCountries();
        List<CountryCodeResponseDTO> countryCodeResponseDTOList = new ArrayList<>();
        for (String countryCode : countryCodes) {
            Locale locale = new Locale("", countryCode);
            countryCodeResponseDTOList.add(new CountryCodeResponseDTO(countryCode, locale.getDisplayCountry()));
//            System.out.println("countryCode = " + countryCode + ", Country name= " + locale.getDisplayCountry());
        }

        return new ResponseEntity<>(new CommonResponseDTO(200, "국가 목록 조회 성공", countryCodeResponseDTOList),
                HttpStatus.OK);
    }

    @GetMapping("/languages")
    public ResponseEntity<CommonResponseDTO> getLanguageCodeList() {
        String[] languageCodes = Locale.getISOLanguages();
        List<CountryCodeResponseDTO> languageCodeResponseDTOList = new ArrayList<>();
        for (String languageCode : languageCodes) {
            Locale locale = new Locale("", languageCode);
            languageCodeResponseDTOList.add(new CountryCodeResponseDTO(languageCode, locale.getDisplayCountry()));
//            System.out.println("languageCode = " + languageCode + ", Country name= " + locale.getDisplayCountry());
        }
        return new ResponseEntity<>(new CommonResponseDTO(200, "언어 목록 조회 성공", languageCodeResponseDTOList),
                HttpStatus.OK);
    }
}
