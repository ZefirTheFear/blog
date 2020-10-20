import React from "react";

import "./Confirm.scss";

interface IConfirmProps {
  msg: string;
  onClick: () => void;
}

const Confirm: React.FC<IConfirmProps> = ({ msg, onClick }) => {
  return (
    <div className="confirm">
      <p className="confirm__msg">{msg}</p>
      <button type="button" className="confirm__btn" onClick={onClick}>
        ok
      </button>
    </div>
  );
};

export default Confirm;
