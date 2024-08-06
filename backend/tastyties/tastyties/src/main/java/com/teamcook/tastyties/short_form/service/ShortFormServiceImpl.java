package com.teamcook.tastyties.short_form.service;

import com.teamcook.tastyties.exception.FileUploadException;
import com.teamcook.tastyties.s3test.S3Service;
import com.teamcook.tastyties.s3test.Video;
import com.teamcook.tastyties.shared.entity.ShortFormAndShortFormTag;
import com.teamcook.tastyties.shared.repository.ShortFormAndShortFormTagRepository;
import com.teamcook.tastyties.short_form.dto.ShortFormRegisterDto;
import com.teamcook.tastyties.short_form.dto.ShortFormRegisterResponseDto;
import com.teamcook.tastyties.short_form.entity.ShortForm;
import com.teamcook.tastyties.short_form.entity.ShortFormLike;
import com.teamcook.tastyties.short_form.entity.ShortFormTag;
import com.teamcook.tastyties.short_form.repository.ShortFormLikeRepository;
import com.teamcook.tastyties.short_form.repository.ShortFormRepository;
import com.teamcook.tastyties.short_form.repository.ShortFormTagRepository;
import com.teamcook.tastyties.user.entity.User;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class ShortFormServiceImpl implements ShortFormService {

    private final ShortFormRepository shortFormRepository;
    private final S3Service s3Service;
    private final ShortFormTagRepository shortFormTagRepository;
    private final ShortFormAndShortFormTagRepository shortFormAndShortFormTagRepository;
    private final ShortFormLikeRepository shortFormLikeRepository;

    public ShortFormServiceImpl(ShortFormRepository shortFormRepository,
                                @Qualifier("Local") S3Service s3Service,
                                ShortFormTagRepository shortFormTagRepository,
                                ShortFormAndShortFormTagRepository shortFormAndShortFormTagRepository, ShortFormLikeRepository shortFormLikeRepository) {
        this.shortFormRepository = shortFormRepository;
        this.s3Service = s3Service;
        this.shortFormTagRepository = shortFormTagRepository;
        this.shortFormAndShortFormTagRepository = shortFormAndShortFormTagRepository;
        this.shortFormLikeRepository = shortFormLikeRepository;
    }

    @Override
    public ShortFormRegisterResponseDto registerShortForm(User user, ShortFormRegisterDto shortFormDto,
                                                          MultipartFile video) {
        Video uploadVideo;
        try {
            uploadVideo = s3Service.uploadVideo(video);
        } catch (IOException e) {
            throw new FileUploadException("비디오 업로드 중 오류가 발생했습니다.");
        }

        ShortForm shortForm = new ShortForm(user, shortFormDto.getTitle(),
                uploadVideo.getStoredVideoPath(), shortFormDto.getCategory());
        shortFormRepository.save(shortForm);
        List<ShortFormAndShortFormTag> shortFormTags = createShortFormTags(shortFormDto.getShortFormTags(), shortForm);
        shortFormAndShortFormTagRepository.saveAll(shortFormTags);

        ShortFormLike shortFormLike = new ShortFormLike();
        shortFormLike.setShortForm(shortForm);
        shortFormLikeRepository.save(shortFormLike);
        return new ShortFormRegisterResponseDto(shortForm);
    }

    private List<ShortFormAndShortFormTag> createShortFormTags(Set<String> tagNames, ShortForm shortForm) {
        return tagNames.stream()
                .map(tagName -> {
                    ShortFormTag tag = findOrCreateTag(tagName);
                    return new ShortFormAndShortFormTag(shortForm, tag);
                }).collect(Collectors.toList());
    }

    private ShortFormTag findOrCreateTag(String tagName) {
        return shortFormTagRepository.findByShortFormTagName(tagName)
                .orElseGet(() -> shortFormTagRepository.save(new ShortFormTag(tagName)));
    }
}
