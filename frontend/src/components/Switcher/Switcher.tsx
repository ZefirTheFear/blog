import React from "react";

import "./Switcher.scss";

interface ISwitcherProps {
  isActive: boolean;
  onClick: () => void;
}

const Switcher: React.FC<ISwitcherProps> = ({ isActive, onClick }) => {
  return (
    <div className="switcher" onClick={onClick}>
      <div className={"switcher__inner" + (isActive ? " switcher__inner_active" : "")} />
    </div>
  );
};

export default Switcher;
