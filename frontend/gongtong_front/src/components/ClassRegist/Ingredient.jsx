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

  useEffect(() => {}, [ingredients]);

  return (
    <div className="regist-component-box">
      <div className="title-box">
        <label htmlFor="">식재료</label>
        <div>*필수여부 체크</div>
      </div>
      <div className="input-box">
        {ingredients.map((field, index) => (
          <div key={index}>
            <input
              type="text"
              name="ingredientName"
              value={field.ingredientName}
              onChange={(e) => handleInputChange(index, e)}
            />
            <input
              type="number"
              name="quantity"
              value={field.quantity}
              onChange={(e) => handleInputChange(index, e)}
            />
            <input
              type="text"
              name="quantityUnit"
              value={field.quantityUnit}
              onChange={(e) => handleInputChange(index, e)}
            />
            <input
              type="checkbox"
              name="isRequired"
              id="isRequired"
              checked={field.isRequired}
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

export default Ingredient;
