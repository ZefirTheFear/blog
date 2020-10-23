import React from "react";

import InvalidFeedback from "../InvalidFeedback/InvalidFeedback";

import "./ContentMaker.scss";

interface IContentMakerProps {
  errors?: string[];
}

const ContentMaker: React.FC<IContentMakerProps> = ({ errors }) => {
  return (
    <div className="content-maker">
      <div className="content-maker__content">
        <div>ContentMaker</div>
      </div>
      {errors && errors.map((msg) => <InvalidFeedback key={msg} msg={msg} />)}
    </div>
  );
};

export default ContentMaker;
