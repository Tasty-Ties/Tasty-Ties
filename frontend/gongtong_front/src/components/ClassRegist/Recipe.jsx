import { useEffect, useState } from "react";

const Recipe = ({ onChange }) => {
  const [recipes, setRecipes] = useState([{ step: 0, description: "" }]);

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

  useEffect(() => {}, [recipes]);

  return (
    <div className="regist-component-box">
      <div className="title-box">
        <label htmlFor="">레시피</label>
        <div>*단계별로 작성</div>
      </div>
      <div className="input-box">
        {recipes.map((field, index) => (
          <div key={index}>
            {index + 1}
            <input
              type="text"
              name="description"
              value={field.description}
              onChange={(e) => handleInputChange(index, e)}
            />
            <button type="button" onClick={() => handleRemoveFields(index)}>
              X
            </button>
          </div>
        ))}
        <button type="button" onClick={handleAddFields}>
          추가
        </button>
      </div>
    </div>
  );
};
export default Recipe;
