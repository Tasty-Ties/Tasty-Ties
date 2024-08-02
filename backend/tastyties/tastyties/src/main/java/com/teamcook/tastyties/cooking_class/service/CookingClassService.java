package com.teamcook.tastyties.cooking_class.service;

import com.teamcook.tastyties.cooking_class.dto.*;
import com.teamcook.tastyties.cooking_class.entity.*;
import com.teamcook.tastyties.cooking_class.exception.CookingClassNotFoundException;
import com.teamcook.tastyties.cooking_class.repository.*;
import com.teamcook.tastyties.exception.CookingClassIsDeletedException;
import com.teamcook.tastyties.exception.ReservationNotFoundException;
import com.teamcook.tastyties.security.userdetails.CustomUserDetails;
import com.teamcook.tastyties.shared.dto.ReviewRequestDto;
import com.teamcook.tastyties.shared.dto.ReviewResponseDto;
import com.teamcook.tastyties.shared.entity.CookingClassAndCookingClassTag;
import com.teamcook.tastyties.shared.entity.UserAndCookingClass;
import com.teamcook.tastyties.shared.repository.CookingClassAndCookingClassTagRepository;
import com.teamcook.tastyties.shared.repository.UserAndCookingClassRepository;
import com.teamcook.tastyties.user.dto.UserProfileForClassDetailDto;
import com.teamcook.tastyties.user.entity.User;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@Slf4j
public class CookingClassService {
    private final CookingClassRepository cookingClassRepository;
    private final IngredientRepository ingredientRepository;
    private final RecipeRepository recipeRepository;
    private final CookingToolRepository cookingToolRepository;
    private final CookingClassAndCookingClassTagRepository ccAndcctRepository;
    private final UserAndCookingClassRepository userAndCookingClassRepository;
    private final CookingClassTagRepository cookingClassTagRepository;
    private final CookingClassImageRepository cookingClassImageRepository;

    @Autowired
    public CookingClassService(CookingClassRepository cookingClassRepository, IngredientRepository ingredientRepository,
                               RecipeRepository recipeRepository, CookingToolRepository cookingToolRepository,
                               CookingClassAndCookingClassTagRepository ccAndcctRepository,
                               UserAndCookingClassRepository userAndCookingClassRepository,
                               CookingClassTagRepository cookingClassTagRepository,
                               CookingClassImageRepository cookingClassImageRepository) {
        this.cookingClassRepository = cookingClassRepository;
        this.ingredientRepository = ingredientRepository;
        this.recipeRepository = recipeRepository;
        this.cookingToolRepository = cookingToolRepository;
        this.ccAndcctRepository = ccAndcctRepository;
        this.userAndCookingClassRepository = userAndCookingClassRepository;
        this.cookingClassTagRepository = cookingClassTagRepository;
        this.cookingClassImageRepository = cookingClassImageRepository;
    }
    // 클래스 생성
    @Transactional
    public CookingClass registerClass(User user, CookingClassDto registerDto) {
        CookingClass cc = createCookingClass(user, registerDto);
        cookingClassRepository.save(cc);

        Set<Ingredient> ingredients = createIngredients(registerDto.getIngredients(), cc);
        ingredientRepository.saveAll(ingredients);

        Set<Recipe> recipes = createRecipe(registerDto.getRecipe(), cc);
        recipeRepository.saveAll(recipes);

        Set<CookingTool> cookingTools = createCookingTools(registerDto.getCookingTools(), cc);
        cookingToolRepository.saveAll(cookingTools);

        List<CookingClassAndCookingClassTag> cookingClassTags = createCookingClassTags(registerDto.getCookingClassTags(), cc);
        ccAndcctRepository.saveAll(cookingClassTags);

        List<CookingClassImage> cookingClassImages = createCookingClassImages(registerDto.getImageUrls(), cc);
        cookingClassImageRepository.saveAll(cookingClassImages);
        return cc;
    }

    private CookingClass createCookingClass(User user, CookingClassDto registerDto) {
        CookingClass cc = new CookingClass();
        cc.setHost(user);
        cc.setLanguageCode(registerDto.getLanguageCode());
        cc.setLanguageName(registerDto.getLanguageName());
        cc.setCountryCode(registerDto.getCountryCode());
        cc.setCountryName(registerDto.getCountryName());
        cc.setTitle(registerDto.getTitle());
        cc.setDescription(registerDto.getDescription());
        cc.setDishName(registerDto.getDishName());
        cc.setDishCookingTime(registerDto.getDishCookingTime());
        cc.setLevel(registerDto.getLevel());
        cc.setQuota(registerDto.getQuota());
        cc.setLimitedAge(registerDto.isLimitedAge());
        cc.setCookingClassStartTime(registerDto.getCookingClassStartTime());
        cc.setCookingClassEndTime(registerDto.getCookingClassEndTime());
        cc.setReplayEndTime(registerDto.getReplayEndTime());
        cc.setMainImage(registerDto.getMainImageUrl());
        return cc;
    }

    private Set<Ingredient> createIngredients(Set<IngredientDto> ingredientDtos, CookingClass cc) {
        return ingredientDtos.stream()
                .map(dto -> {
                    return new Ingredient(
                            cc,
                            dto.getIngredientName(),
                            dto.getQuantity(),
                            dto.getQuantityUnit(),
                            dto.isRequired());
                }).collect(Collectors.toSet());
    }

    private Set<Recipe> createRecipe(Set<RecipeDto> recipeDtos, CookingClass cc) {
        return recipeDtos.stream()
                .map(dto -> {
                    return new Recipe(
                            cc, dto.getStep(), dto.getDescription()
                    );
                }).collect(Collectors.toSet());
    }

    private Set<CookingTool> createCookingTools(Set<String> toolNames, CookingClass cc) {
        return toolNames.stream()
                .map(toolName -> {
                    return new CookingTool(
                            cc, toolName
                    );
                }).collect(Collectors.toSet());
    }

    private List<CookingClassAndCookingClassTag> createCookingClassTags(Set<String> tagNames, CookingClass cc) {
        return tagNames.stream()
                .map(tagName -> {
                    CookingClassTag tag = findOrCreateTag(tagName);
                    CookingClassAndCookingClassTag ccAndcct = new CookingClassAndCookingClassTag();
                    ccAndcct.setCookingClass(cc);
                    ccAndcct.setCookingClassTag(tag);
                    return ccAndcct;
                }).collect(Collectors.toList());
    }

    private List<CookingClassImage> createCookingClassImages(List<String> imageUrls, CookingClass cc) {
        return imageUrls.stream()
                .map(imageUrl -> {
                    return new CookingClassImage(
                            cc, imageUrl
                    );
                }).collect(Collectors.toList());
    }

    private CookingClassTag findOrCreateTag(String tagName) {
        return cookingClassTagRepository.findByCookingClassTagName(tagName)
                .orElseGet(() -> cookingClassTagRepository.save(new CookingClassTag(tagName)));
    }

    // 클래스 채팅방 정보 저장
    public void saveCookingClassWithChatRoomId(CookingClass cookingClass) {
        cookingClassRepository.save(cookingClass);
    }

    public Page<CookingClassListDto> searchCookingClassList(CookingClassSearchCondition condition, Pageable pageable) {
        return cookingClassRepository.searchClass(condition, pageable);
    }

    // 클래스 상세 조회
    @Transactional
    public CookingClassDto getCookingClassDetail(CustomUserDetails userDetails, String uuid) {
        CookingClass cc = cookingClassRepository.findWithUuid(uuid);
        if (cc == null) {
            throw new CookingClassNotFoundException("해당 클래스를 찾을 수 없습니다.");
        }
        boolean isEnrolledClass = false;
        boolean isHost = false;
        long enrolledCount = userAndCookingClassRepository.countQuota(cc);
        Set<UserProfileForClassDetailDto> userEnrolledInClass = null;

        if (userDetails != null) {
            User user = userDetails.user();
            isEnrolledClass = userAndCookingClassRepository.isUserEnrolledInClass(user, cc);
            userEnrolledInClass = userAndCookingClassRepository.findUserEnrolledInClass(cc);
            isHost = (user.getUsername().equals(cc.getHost().getUsername()));
        }

        Set<IngredientDto> ingredientDtos = mapToIngredientDtos(cc.getIngredients());
        Set<RecipeDto> recipeDtos = mapToRecipeDtos(cc.getRecipes());
        Set<String> cookingTools = mapToCookingToolNames(cc.getCookingTools());
        Set<String> tags = mapToTagNames(cc.getCookingClassAndCookingClassTags());

        // 이미지 관련 추가 필요
        // List<String> imageUrls = 어쩌구

        return new CookingClassDto(
                cc.getUuid(), cc.getHost().getNickname(),
                cc.getTitle(), cc.getDishName(), cc.isLimitedAge(),
                cc.getCountryCode(), cc.getCountryName(), tags, cc.getDescription(),
                cc.getLanguageCode(), cc.getLanguageName(), cc.getLevel(), cc.getCookingClassStartTime(),
                cc.getCookingClassEndTime(), cc.getDishCookingTime(), ingredientDtos,
                recipeDtos, cookingTools, cc.getQuota(),
                cc.getReplayEndTime(), isEnrolledClass, isHost,
                enrolledCount, userEnrolledInClass,
                null, cc.getMainImage(),
                cc.getChatRoomId()
        );
    }

    private Set<String> mapToTagNames(List<CookingClassAndCookingClassTag> ccAndTags) {
        return ccAndTags.stream()
                .map(ccAndTag -> ccAndTag.getCookingClassTag().getCookingClassTagName())
                .collect(Collectors.toSet());
    }

    private Set<IngredientDto> mapToIngredientDtos(Set<Ingredient> ingredients) {
        return ingredients.stream()
                .map(ingredient -> new IngredientDto(
                        ingredient.getIngredientName(),
                        ingredient.getQuantity(),
                        ingredient.getQuantityUnit(),
                        ingredient.isRequired()
                )).collect(Collectors.toSet());
    }

    private Set<RecipeDto> mapToRecipeDtos(Set<Recipe> recipes) {
        return recipes.stream()
                .map(recipe -> new RecipeDto(
                        recipe.getStep(),
                        recipe.getDescription()
                )).collect(Collectors.toSet());
    }

    private Set<String> mapToCookingToolNames(Set<CookingTool> cookingTools) {
        return cookingTools.stream()
                .map(CookingTool::getCookingToolName)
                .collect(Collectors.toSet());
    }

    // 쿠킹 클래스 상세 리뷰 조회
    public Page<ReviewResponseDto> getReviewResponseDto(String uuid, Pageable pageable) {
        return userAndCookingClassRepository.findReviewsForCookingClass(uuid, pageable);
    }

    // 클래스 삭제
    @Transactional
    public DeletedCookingClassDto deleteClass(int userId, String uuid) {
        CookingClass cookingClass = cookingClassRepository.findClassForDelete(uuid);
        if (cookingClass == null) {
            throw new CookingClassNotFoundException("클래스를 찾을 수 없습니다.");
        }

        if (cookingClass.isDelete()) {
            throw new CookingClassIsDeletedException("이미 삭제된 클래스입니다.");
        }
        if (cookingClass.getHost().getUserId() != userId) {
            throw new IllegalArgumentException("본인의 클래스만 삭제할 수 있습니다.");
        }

        long row = userAndCookingClassRepository.deleteCookingClass(cookingClass);
        cookingClass.delete();

        return DeletedCookingClassDto.builder()
                .chatRoomId(cookingClass.getChatRoomId())
                .deletedReservationCount(row)
                .build();
    }


    // 클래스 예약
    @Transactional
    public String reserveClass(User user, String uuid) {
        CookingClass cc = cookingClassRepository.findWithUuid(uuid);
        if (cc == null) {
            throw new CookingClassNotFoundException("존재하지 않는 클래스입니다.");
        }

        if (cc.isDelete()) {
            throw new CookingClassIsDeletedException("삭제된 클래스입니다.");
        }
        if (cc.getHost().getUserId() == user.getUserId()) {
            throw new IllegalArgumentException("본인의 클래스에는 예약할 수 없습니다.");
        }
        createUserAndCookingClassRelationship(user, cc);

        return cc.getChatRoomId();
    }

    // user와 cookingclass 관계 생성
    private void createUserAndCookingClassRelationship(User user, CookingClass cc) {
        if (userAndCookingClassRepository.isUserEnrolledInClass(user, cc)) {
            throw new IllegalArgumentException("이미 예약되어있습니다.");
        }
        UserAndCookingClass uAndc = new UserAndCookingClass();
        uAndc.setUser(user);
        uAndc.setCookingClass(cc);
        userAndCookingClassRepository.save(uAndc);
    }

    // 예약 삭제
    @Transactional
    public String deleteReservation(User user, String uuid) {
        CookingClass cc = cookingClassRepository.findWithUuid(uuid);

        if (cc.isDelete()) {
            throw new CookingClassIsDeletedException("삭제된 클래스입니다.");
        }
        String chatRoomId = cc.getChatRoomId();
        deleteUserAndCookingClassRelationship(user, cc);

        return chatRoomId;
    }

    private void deleteUserAndCookingClassRelationship(User user, CookingClass cc) {
        userAndCookingClassRepository.deleteReservation(user, cc);
    }

    @Transactional
    public void saveReview(CustomUserDetails userDetails, ReviewRequestDto reviewRequestDto) {
        UserAndCookingClass reservation = userAndCookingClassRepository.findReservationByUsernameAndClassUuid(
                userDetails.getUserId(), reviewRequestDto.getUuid());

        if (reservation == null) {
            throw new ReservationNotFoundException("예약 정보를 찾을 수 없습니다.");
        }
        reservation.writeReview(reviewRequestDto);
    }

}
