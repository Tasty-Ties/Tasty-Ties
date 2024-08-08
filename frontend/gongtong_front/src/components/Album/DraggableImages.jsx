import { useEffect } from "react";
import { useDrag, useDrop } from "react-dnd";

const DraggableType = {
  IMAGE: "foodImage",
};

const DraggableImages = ({ image, index, moveImage }) => {
  const [, ref] = useDrag({
    type: DraggableType.IMAGE,
    item: { index },
  });

  const [, drop] = useDrop({
    accept: DraggableType.IMAGE,
    hover: (draggedImage) => {
      if (draggedImage.index !== index) {
        moveImage(draggedImage.index, index);
        draggedImage.index = index;
        console.log(draggedImage.index);
      }
    },
  });

  return (
    <div ref={(node) => ref(drop(node))}>
      {index === 0 ? (
        <div className="flex justify-center">
          <img
            src={image.src}
            alt={image.content}
            className="w-full h-40 flex justify-center rounded-md"
          />
        </div>
      ) : (
        <div className="flex justify-center items-center">
          <img src={image.src} alt={image.content} className="rounded-md" />
        </div>
      )}
    </div>
  );
};

export default DraggableImages;
