import React, { useState } from "react";
import "@styles/ClassRegist/ClassImageFile.css";

const ClassImageFiles = () => {
  const [classImages, setClassImages] = useState([]);

  const handleAddImages = (e) => {
    const imagesLists = event.target.files;
    let imageUrlLists = [...classImages];

    for (let i = 0; i < imagesLists.length; i++) {
      const currentImageUrl = URL.createObjectURL(imagesLists[i]);
      imageUrlLists.push(currentImageUrl);
    }
    if (imageUrlLists.length > 5) {
      imageUrlLists = imageUrlLists.slice(0, 5);
    }
    setClassImages(imageUrlLists);
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
