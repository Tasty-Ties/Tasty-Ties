import { useOutletContext } from "react-router-dom";

const ClassIngredients = () => {
  const { ingredients, cookingTime } = useOutletContext();
  return (
    <div className="mt-10">
      {ingredients && ingredients.length > 0 ? (
        ingredients.map((ingredient, index) => (
          <div key={index} className="flex mb-2">
            <div className="mr-3">{index + 1}.</div>
            <div className="mr-4">{ingredient.ingredientName}</div>
            <div className="mr-2">{ingredient.quantity}</div>
            <div className="mr-2">{ingredient.quantityUnit}</div>
            <div>{ingredient.required ? "(필수재료)" : ""}</div>
          </div>
        ))
      ) : (
        <p>필요한 재료가 없습니다!</p>
      )}
    </div>
  );
};

export default ClassIngredients;
