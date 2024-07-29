package com.teamcook.tastyties.cooking_class.service;

import com.teamcook.tastyties.cooking_class.dto.CookingClassListDto;
import com.teamcook.tastyties.cooking_class.dto.CookingClassRegisterDto;
import com.teamcook.tastyties.cooking_class.dto.CookingClassSearchCondition;
import com.teamcook.tastyties.cooking_class.entity.*;
import com.teamcook.tastyties.cooking_class.repository.*;
import com.teamcook.tastyties.shared.entity.CookingClassAndCookingClassTag;
import com.teamcook.tastyties.shared.entity.UserAndCookingClass;
import com.teamcook.tastyties.shared.repository.CookingClassAndCookingClassTagRepository;
import com.teamcook.tastyties.shared.repository.UserAndCookingClassRepository;
import com.teamcook.tastyties.user.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CookingClassService {
    private final CookingClassRepository ccRepository;
    private final IngredientRepository ingredientRepository;
    private final RecipeRepository recipeRepository;
    private final CookingToolRepository cookingToolRepository;
    private final CookingClassAndCookingClassTagRepository ccAndcctRepository;
    private final UserAndCookingClassRepository uAndcRepository;
    private final CookingClassTagRepository cookingClassTagRepository;
    private final CookingClassRepository cookingClassRepository;

    @Autowired
    public CookingClassService(CookingClassRepository ccRepository, IngredientRepository ingredientRepository, RecipeRepository recipeRepository, CookingToolRepository cookingToolRepository, CookingClassAndCookingClassTagRepository ccAndcctRepository, UserAndCookingClassRepository uAndcRepository, CookingClassTagRepository cookingClassTagRepository, CookingClassRepository cookingClassRepository) {
        this.ccRepository = ccRepository;
        this.ingredientRepository = ingredientRepository;
        this.recipeRepository = recipeRepository;
        this.cookingToolRepository = cookingToolRepository;
        this.ccAndcctRepository = ccAndcctRepository;
        this.uAndcRepository = uAndcRepository;
        this.cookingClassTagRepository = cookingClassTagRepository;
        this.cookingClassRepository = cookingClassRepository;
    }

    @Transactional
    public CookingClassRegisterDto registerClass(User user, CookingClassRegisterDto registerDto) {
        CookingClass cc = new CookingClass();
        cc.setHost(user);

        cc.setLanguageCode(user.getLanguageCode());
        cc.setCountryCode(user.getCountryCode());

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

        ccRepository.save(cc);

        // Ingredient 처리
        List<Ingredient> ingredients = registerDto.getIngredients().stream()
                .map(dtoIngredient -> {
                    Ingredient ingredient = new Ingredient();
                    ingredient.setIngredientName(dtoIngredient.getIngredientName());
                    ingredient.setQuantity(dtoIngredient.getQuantity());
                    ingredient.setQuantityUnit(dtoIngredient.getQuantityUnit());
                    ingredient.setCookingClass(cc);
                    return ingredient;
                }).collect(Collectors.toList());
        ingredientRepository.saveAll(ingredients);

        // Recipe 처리
        List<Recipe> recipes = registerDto.getRecipe().stream()
                .map(dtoRecipe -> {
                    Recipe recipe = new Recipe();
                    recipe.setStep(dtoRecipe.getStep());
                    recipe.setDescription(dtoRecipe.getDescription());
                    recipe.setCookingClass(cc);
                    return recipe;
                }).collect(Collectors.toList());
        recipeRepository.saveAll(recipes);

        // CookingTool 처리
        List<CookingTool> cookingTools = registerDto.getCookingTools().stream()
                .map(toolName -> {
                    CookingTool tool = new CookingTool();
                    tool.setCookingToolName(toolName);
                    tool.setCookingClass(cc);
                    return tool;
                }).collect(Collectors.toList());
        cookingToolRepository.saveAll(cookingTools);

        // Tag 처리
        List<CookingClassAndCookingClassTag> cookingClassTags = registerDto.getCookingClassTags().stream()
                .map(tagName -> {
                    CookingClassTag tag = findOrCreateTag(tagName);
                    CookingClassAndCookingClassTag ccAndcct = new CookingClassAndCookingClassTag();
                    ccAndcct.setCookingClass(cc);
                    ccAndcct.setCookingClassTag(tag);
                    return ccAndcct;
                }).collect(Collectors.toList());
        ccAndcctRepository.saveAll(cookingClassTags);

        // User, CookingClass 관계
        UserAndCookingClass uAndc = new UserAndCookingClass();
        uAndc.setUser(user);
        uAndc.setCookingClass(cc);
        uAndcRepository.save(uAndc);
        return registerDto;
    }

    private CookingClassTag findOrCreateTag(String tagName) {
        return cookingClassTagRepository.findByCookingClassTagName(tagName)
                .orElseGet(() -> cookingClassTagRepository.save(new CookingClassTag(tagName)));
    }

    public Page<CookingClassListDto> searchCookingClassList(CookingClassSearchCondition condition, Pageable pageable) {
        return cookingClassRepository.searchClass(condition, pageable);
    }
}
