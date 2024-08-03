import React, { useState } from "react";
import "@styles/ClassRegist/ClassImageFile.css";

const ClassImageFiles = ({ setFiles }) => {
  const [classImages, setClassImages] = useState([]);

  const validExtensions = ["jpg", "jpeg", "png", "gif"];
  const maxFileSize = 10 * 1024 * 1024; // 5MB

  const handleAddImages = (e) => {
    const imagesLists = Array.from(e.target.files);
    let imageUrlLists = [...classImages];
    let validFiles = [];

    imagesLists.forEach((file) => {
      const fileExtension = file.name.split(".").pop().toLowerCase();
      if (!validExtensions.includes(fileExtension)) {
        alert(`파일 타입을 확인해주세요 ${file.name}`);
        return;
      }
      if (file.size > maxFileSize) {
        alert(`파일 사이즈를 확인해주세요 ${file.name}`);
        return;
      }
      validFiles.push(file);
      const currentImageUrl = URL.createObjectURL(file);
      imageUrlLists.push(currentImageUrl);
    });

    if (imageUrlLists.length > 5) {
      imageUrlLists = imageUrlLists.slice(0, 5);
      validFiles = validFiles.slice(0, 5);
    }
    setClassImages(imageUrlLists);
    setFiles(validFiles);
  };

  const handleDeleteImage = (id) => {
    const imageUrl = classImages[id];
    setClassImages(classImages.filter((_, index) => index !== id));
    URL.revokeObjectURL(imageUrl);
  };

  return (
    <div className="regist-component-box">
      <div className="title-box">
        <label htmlFor="">완성사진</label>
      </div>
      <div className="input-box">
        <div className="addImage">
          <label htmlFor="classImageInput" className="addButton">
            <input
              type="file"
              id="classImageInput"
              multiple
              className="addButton"
              onChange={handleAddImages}
            />
          </label>
          <div className="test">
            {classImages.map((image, id) => (
              <div className="imageContainer" key={id}>
                <img src={image} alt={`${image}-${id}`} className="image" />
                <div
                  className="deleteButton"
                  onClick={() => handleDeleteImage(id)}
                >
                  삭제
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassImageFiles;
