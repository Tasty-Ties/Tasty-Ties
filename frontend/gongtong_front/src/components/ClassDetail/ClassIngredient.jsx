import { useOutletContext } from "react-router-dom";

const ClassIngredients = () => {
  const { ingredients, cookingTime } = useOutletContext();
  return (
    <div className="mt-16">
      <div className="grid grid-cols-7 my-3">
        <div className="text-end"></div>
        <div className="">재료명</div>
        <div className="">개수</div>
        <div className="">단위</div>
        <div className="">필수</div>
      </div>
      {ingredients && ingredients.length > 0 ? (
        ingredients.map((ingredient, index) => (
          <div key={index} className="grid grid-cols-7 my-2">
            <div className="text-end">{index + 1}.</div>
            <div>{ingredient.ingredientName}</div>
            <div>{ingredient.quantity}</div>
            <div>{ingredient.quantityUnit}</div>
            <div>{ingredient.required ? "⭕" : "❌"}</div>
          </div>
        ))
      ) : (
        <p>필요한 재료가 없습니다!</p>
      )}
    </div>
  );
};

export default ClassIngredients;
