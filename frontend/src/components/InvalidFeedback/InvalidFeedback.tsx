import React from "react";

import "./InvalidFeedback.scss";

interface IInvalidFeedbackProps {
  msg: string;
}

const InvalidFeedback: React.FC<IInvalidFeedbackProps> = ({ msg }) => {
  return (
    <div key={msg} className="invalid-feedback">
      {msg}
    </div>
  );
};

export default InvalidFeedback;
