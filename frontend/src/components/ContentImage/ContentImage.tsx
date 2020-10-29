import React from "react";

import "./ContentImage.scss";

interface IContentImageProps {
  isDragging: boolean;
  url: string;
}

const ContentImage: React.FC<IContentImageProps> = ({ isDragging, url }) => {
  return (
    <div className={"content-image" + (isDragging ? " content-image_is-dragging" : "")}>
      <img className="content-image__img" src={url} alt="img" draggable="false" />
    </div>
  );
};

export default ContentImage;
