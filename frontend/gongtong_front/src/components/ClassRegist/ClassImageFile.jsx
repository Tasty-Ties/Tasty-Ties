import React, { useState } from "react";

const ClassImageFiles = ({ setFiles }) => {
  const [classImages, setClassImages] = useState([]);

  const validExtensions = ["jpg", "jpeg", "png"];
  const maxFileSize = 10 * 1024 * 1024; // 10MB

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
      const currentImageUrl = URL.createObjectURL(file); // 생성
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
    URL.revokeObjectURL(imageUrl); // 소멸
  };

  return (
    <div className="regist-component-box">
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
          <div className="flex gap-4 whitespace-nowrap">
            {classImages.map((image, id) => (
              <div className="relative inline-block" key={id}>
                <img
                  src={image}
                  alt={`${image}-${id}`}
                  className="w-28 mt-4 h-28 bg-cover"
                />
                <div
                  className="absolute top-2 -right-2 bg-first rounded-3xl text-white px-2 py-0.5"
                  onClick={() => handleDeleteImage(id)}
                >
                  X
                </div>
              </div>
            ))}
          </div>
          <div className="text-sm text-gray-400 mt-1">
            * 이미지 파일은 jpg, jpeg, png만 업로드 가능합니다.
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassImageFiles;
