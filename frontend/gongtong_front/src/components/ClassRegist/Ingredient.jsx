import React, { useEffect, useState } from "react";

const Ingredient = ({ onChange }) => {
  const [ingredients, setIngredients] = useState([
    {
      ingredientName: "",
      quantity: 1,
      quantityUnit: "",
      isRequired: false,
    },
  ]);
  const handleAddFields = () => {
    const values = [
      ...ingredients,
      {
        ingredientName: "",
        quantity: 1,
        quantityUnit: "",
        isRequired: false,
      },
    ];
    setIngredients(values);
    onChange(values);
  };

  const handleRemoveFields = (index) => {
    if (ingredients.length === 1) {
      return;
    }
    const values = [...ingredients];
    values.splice(index, 1);
    setIngredients(values);
    onChange(values);
  };

  const handleInputChange = (index, e) => {
    const values = [...ingredients];
    if (e.target.name !== "isRequired") {
      values[index][e.target.name] = e.target.value;
    } else {
      values[index][e.target.name] = e.target.checked;
    }
    setIngredients(values);
    onChange(values);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.keyCode === 13) {
      e.preventDefault(); // 엔터 키 기본 동작 방지
    }
  };

  useEffect(() => {}, [ingredients]);

  return (
    <div className="regist-component-box">
      <div className="">
        {ingredients.map((field, index) => (
          <div key={index} className="flex my-3">
            <input
              type="text"
              name="ingredientName"
              value={field.ingredientName}
              onChange={(e) => handleInputChange(index, e)}
              onKeyDown={handleKeyDown}
              className="w-1/4 border p-2 rounded mr-2"
              placeholder="재료명"
            />
            <input
              type="number"
              name="quantity"
              value={field.quantity}
              min="1"
              onChange={(e) => handleInputChange(index, e)}
              onKeyDown={handleKeyDown}
              className="w-1/4 border p-2 rounded mr-2"
              placeholder="개수"
            />
            <input
              type="text"
              name="quantityUnit"
              value={field.quantityUnit}
              onChange={(e) => handleInputChange(index, e)}
              onKeyDown={handleKeyDown}
              className="w-1/4 border p-2 rounded mr-2"
              placeholder="단위"
            />
            <div className="flex items-center mr-8">
              <input
                type="checkbox"
                name="isRequired"
                id="isRequired"
                checked={field.isRequired}
                onChange={(e) => handleInputChange(index, e)}
                className="border rounded "
              />
              <label htmlFor="isRequired">필수</label>
            </div>
            <button type="button" onClick={() => handleRemoveFields(index)}>
              ✖
            </button>
          </div>
        ))}
        <div className="text-right">
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
};

export default Ingredient;
