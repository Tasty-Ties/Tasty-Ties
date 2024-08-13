import React, { useState } from "react";

function ClassImageFiles({ setFiles }) {
  const [classImages, setClassImages] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);

  const validExtensions = ["jpg", "jpeg", "png"];
  const maxFileSize = 5 * 1024 * 1024; // 5MB

  const handleAddImages = (e) => {
    const newFiles = Array.from(e.target.files);
    let newImageUrlLists = [...classImages];
    let newValidFiles = [...imageFiles];

    newFiles.forEach((file) => {
      const fileExtension = file.name.split(".").pop().toLowerCase();
      if (!validExtensions.includes(fileExtension)) {
        alert(`파일 타입을 확인해주세요 ${file.name}`);
        return;
      }
      if (file.size > maxFileSize) {
        alert(`파일 크기는 5MB를 초과할 수 없습니다: ${file.name}`);
        return;
      }
      newValidFiles.push(file);
      const currentImageUrl = URL.createObjectURL(file);
      newImageUrlLists.push(currentImageUrl);
    });

    if (newImageUrlLists.length > 5) {
      newImageUrlLists = newImageUrlLists.slice(0, 5);
      newValidFiles = newValidFiles.slice(0, 5);
      alert("최대 5개의 이미지만 업로드할 수 있습니다.");
    }
    setClassImages(newImageUrlLists);
    setImageFiles(newValidFiles);
    setFiles(newValidFiles);
  };

  const handleDeleteImage = (id) => {
    const newImageUrlLists = classImages.filter((_, index) => index !== id);
    const newValidFiles = imageFiles.filter((_, index) => index !== id);
    setClassImages(newImageUrlLists);
    setImageFiles(newValidFiles);
    setFiles(newValidFiles);
    URL.revokeObjectURL(classImages[id]);
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
}

export default ClassImageFiles;
