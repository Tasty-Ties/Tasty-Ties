import { useOutletContext } from "react-router-dom";

const ClassRecipes = () => {
  const { recipes } = useOutletContext();
  console.log(recipes);

  const sortedRecipes =
    recipes && recipes.length > 0
      ? [...recipes].sort((a, b) => Number(a.step) - Number(b.step))
      : [];
  return (
    <div>
      {sortedRecipes.length > 0 ? (
        sortedRecipes.map((recipe, index) => (
          <div key={index}>
            <div>{recipe.step}</div>
            <div>{recipe.description}</div>
          </div>
        ))
      ) : (
        <p>재료 없음</p>
      )}
    </div>
  );
};

export default ClassRecipes;
