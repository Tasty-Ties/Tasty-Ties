import { useOutletContext } from "react-router-dom";

const ClassCookingTools = () => {
  const { cookingTools } = useOutletContext();
  return (
    <div>
      {cookingTools && cookingTools.length > 0 ? (
        cookingTools.map((cookingTool, index) => (
          <div key={index}>
            <div>{cookingTool}</div>
          </div>
        ))
      ) : (
        <p>재료 없음</p>
      )}
    </div>
  );
};

export default ClassCookingTools;
