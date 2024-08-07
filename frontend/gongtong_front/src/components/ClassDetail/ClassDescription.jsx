import { useOutletContext } from "react-router-dom";

const ClassDescription = () => {
  const { description } = useOutletContext();
  return (
    <div>
      <div>{description}</div>
    </div>
  );
};

export default ClassDescription;
