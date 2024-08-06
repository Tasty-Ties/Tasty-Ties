import { useOutletContext } from "react-router-dom";

const ClassIngredients = () => {
  const { ingredients } = useOutletContext();
  return (
    <div>
      {ingredients && ingredients.length > 0 ? (
        ingredients.map((ingredient, index) => (
          <div key={index}>
            <div>{ingredient.ingredientName}</div>
            <div>
              수량: {ingredient.quantity} {ingredient.quantityUnit || ""}
            </div>
            <div>필요 여부: {ingredient.required ? "필요" : "불필요"}</div>
          </div>
        ))
      ) : (
        <p>재료 없음</p>
      )}
    </div>
  );
};

export default ClassIngredients;
