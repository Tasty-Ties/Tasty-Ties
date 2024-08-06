import React from "react";

const IdImage = ({ setFiles }) => {
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFiles(file);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
    </div>
  );
};

export default IdImage;
