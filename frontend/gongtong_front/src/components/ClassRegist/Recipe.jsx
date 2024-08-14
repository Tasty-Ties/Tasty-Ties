import { useEffect, useState, forwardRef } from "react";

const Recipe = forwardRef(function Recipe({ onChange }, ref) {
  const [recipes, setRecipes] = useState([{ step: 1, description: "" }]);

  const handleAddFields = () => {
    const values = [...recipes, { step: recipes.length + 1, description: "" }];
    setRecipes(values);
    if (onChange) {
      onChange(values);
    }
  };

  const handleRemoveFields = (index) => {
    if (recipes.length === 1) {
      return;
    }
    const values = [...recipes];
    values.splice(index, 1);
    values.forEach((recipe, idx) => (recipe.step = idx + 1));
    setRecipes(values);
    if (onChange) {
      onChange(values);
    }
  };

  const handleInputChange = (index, e) => {
    const values = [...recipes];
    values[index].description = e.target.value;
    setRecipes(values);
    if (onChange) {
      onChange(values);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // 엔터 키 기본 동작 방지
    }
  };

  useEffect(() => {}, [recipes]);

  return (
    <div className="regist-component-box">
      <div className="input-box grid grid-cols-12 items-center">
        {recipes.map((field, index) => (
          <div key={index} className="flex items-center my-2 col-span-9">
            <span className="mr-2 text-xl">{index + 1}.</span>
            <input
              type="text"
              name="description"
              value={field.description}
              onChange={(e) => handleInputChange(index, e)}
              onKeyDown={handleKeyDown}
              className="w-full border p-2 rounded"
              placeholder="레시피를 작성해주세요"
            />
            <div className="ml-6">
              <button type="button" onClick={() => handleRemoveFields(index)}>
                ✖
              </button>
            </div>
          </div>
        ))}
        <div className="col-end-12 grid self-center">
          <button type="button" onClick={handleAddFields}>
            <svg
              width="37"
              height="36"
              viewBox="0 0 37 36"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <ellipse
                cx="18.5"
                cy="17.6429"
                rx="18.5"
                ry="17.6429"
                fill="#005246"
              />
              <path
                d="M17.209 19.0138H9.45898V16.5501H17.209V9.15918H19.7923V16.5501H27.5423V19.0138H19.7923V26.4047H17.209V19.0138Z"
                fill="white"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
});

Recipe.displayName = "Recipe";

export default Recipe;
