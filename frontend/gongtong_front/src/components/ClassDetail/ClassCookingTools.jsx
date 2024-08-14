import { useOutletContext } from "react-router-dom";

const ClassCookingTools = () => {
  const { cookingTools } = useOutletContext();
  return (
    <div className="mt-10">
      {cookingTools && cookingTools.length > 0 ? (
        cookingTools.map((cookingTool, index) => (
          <div key={index}>
            <div className="mb-3">{cookingTool}</div>
          </div>
        ))
      ) : (
        <p>재료 없음</p>
      )}
    </div>
  );
};

export default ClassCookingTools;
