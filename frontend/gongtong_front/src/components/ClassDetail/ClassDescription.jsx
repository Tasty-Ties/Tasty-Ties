import { useOutletContext } from "react-router-dom";

const ClassDescription = () => {
  const { description } = useOutletContext();
  return (
    <div className="mt-10  break-words w-full">
      <div>{description}</div>
    </div>
  );
};

export default ClassDescription;
