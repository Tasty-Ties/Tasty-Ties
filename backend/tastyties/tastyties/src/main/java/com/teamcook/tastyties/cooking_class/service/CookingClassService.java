package com.teamcook.tastyties.cooking_class.service;

import com.teamcook.tastyties.cooking_class.dto.*;
import com.teamcook.tastyties.cooking_class.entity.*;
import com.teamcook.tastyties.exception.CookingClassIsDeletedException;
import com.teamcook.tastyties.exception.CookingClassNotFoundException;
import com.teamcook.tastyties.exception.ReservationNotFoundException;
import com.teamcook.tastyties.cooking_class.repository.*;
import com.teamcook.tastyties.security.userdetails.CustomUserDetails;
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
    private final CookingClassRepository ccRepository;
    private final IngredientRepository ingredientRepository;
    private final RecipeRepository recipeRepository;
    private final CookingToolRepository cookingToolRepository;
    private final CookingClassAndCookingClassTagRepository ccAndcctRepository;
    private final UserAndCookingClassRepository uAndcRepository;
    private final CookingClassTagRepository cookingClassTagRepository;
    private final CookingClassRepository cookingClassRepository;
    private final UserAndCookingClassRepository userAndCookingClassRepository;

    @Autowired
    public CookingClassService(CookingClassRepository ccRepository, IngredientRepository ingredientRepository, RecipeRepository recipeRepository, CookingToolRepository cookingToolRepository, CookingClassAndCookingClassTagRepository ccAndcctRepository, UserAndCookingClassRepository uAndcRepository, CookingClassTagRepository cookingClassTagRepository, CookingClassRepository cookingClassRepository, UserAndCookingClassRepository userAndCookingClassRepository) {
        this.ccRepository = ccRepository;
        this.ingredientRepository = ingredientRepository;
        this.recipeRepository = recipeRepository;
        this.cookingToolRepository = cookingToolRepository;
        this.ccAndcctRepository = ccAndcctRepository;
        this.uAndcRepository = uAndcRepository;
        this.cookingClassTagRepository = cookingClassTagRepository;
        this.cookingClassRepository = cookingClassRepository;
        this.userAndCookingClassRepository = userAndCookingClassRepository;
    }

    // 클래스 생성
    @Transactional
    public CookingClass registerClass(User user, CookingClassDto registerDto) {
        CookingClass cc = createCookingClass(user, registerDto);
        ccRepository.save(cc);

        Set<Ingredient> ingredients = createIngredients(registerDto.getIngredients(), cc);
        ingredientRepository.saveAll(ingredients);

        Set<Recipe> recipes = createRecipe(registerDto.getRecipe(), cc);
        recipeRepository.saveAll(recipes);

        Set<CookingTool> cookingTools = createCookingTools(registerDto.getCookingTools(), cc);
        cookingToolRepository.saveAll(cookingTools);

        List<CookingClassAndCookingClassTag> cookingClassTags = createCookingClassTags(registerDto.getCookingClassTags(), cc);
        ccAndcctRepository.saveAll(cookingClassTags);
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
        return cc;
    }

    private Set<Ingredient> createIngredients(Set<IngredientDto> ingredientDtos, CookingClass cc) {
        return ingredientDtos.stream()
                .map(dto -> {
                    Ingredient ingredient = new Ingredient();
                    ingredient.setIngredientName(dto.getIngredientName());
                    ingredient.setQuantity(dto.getQuantity());
                    ingredient.setQuantityUnit(dto.getQuantityUnit());
                    ingredient.setCookingClass(cc);
                    return ingredient;
                }).collect(Collectors.toSet());
    }

    private Set<Recipe> createRecipe(Set<RecipeDto> recipeDtos, CookingClass cc) {
        return recipeDtos.stream()
                .map(dto -> {
                    Recipe recipe = new Recipe();
                    recipe.setStep(dto.getStep());
                    recipe.setDescription(dto.getDescription());
                    recipe.setCookingClass(cc);
                    return recipe;
                }).collect(Collectors.toSet());
    }

    private Set<CookingTool> createCookingTools(Set<String> toolNames, CookingClass cc) {
        return toolNames.stream()
                .map(toolName -> {
                    CookingTool tool = new CookingTool();
                    tool.setCookingToolName(toolName);
                    tool.setCookingClass(cc);
                    return tool;
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

        boolean isEnrolledClass = false;
        boolean isHost = false;
        long enrolledCount = uAndcRepository.countQuota(cc);
        Set<UserProfileForClassDetailDto> userEnrolledInClass = null;

        if (userDetails != null) {
            User user = userDetails.user();
            isEnrolledClass = uAndcRepository.isUserEnrolledInClass(user, cc);
            userEnrolledInClass = uAndcRepository.findUserEnrolledInClass(cc);
            isHost = (user.getUsername().equals(cc.getHost().getUsername()));
        }

        Set<IngredientDto> ingredientDtos = mapToIngredientDtos(cc.getIngredients());
        Set<RecipeDto> recipeDtos = mapToRecipeDtos(cc.getRecipes());
        Set<String> cookingTools = mapToCookingToolNames(cc.getCookingTools());
        Set<String> tags = mapToTagNames(cc.getCookingClassAndCookingClassTags());

        return new CookingClassDto(
                cc.getUuid(), cc.getHost().getNickname(),
                cc.getTitle(), cc.getDishName(), cc.isLimitedAge(),
                cc.getCountryCode(), cc.getCountryName(), tags, cc.getDescription(),
                cc.getLanguageCode(), cc.getLanguageName(), cc.getLevel(), cc.getCookingClassStartTime(),
                cc.getCookingClassEndTime(), cc.getDishCookingTime(), ingredientDtos,
                recipeDtos, cookingTools, cc.getQuota(),
                cc.getReplayEndTime(), isEnrolledClass, isHost,
                enrolledCount, userEnrolledInClass, cc.getChatRoomId()
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
        uAndcRepository.save(uAndc);
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

        reservation.setCookingClassReview(reviewRequestDto.getComment());
    }

}
