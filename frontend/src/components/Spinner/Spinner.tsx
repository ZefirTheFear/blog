import React, { useEffect } from "react";
import { createPortal } from "react-dom";

import { ReactComponent as SVGSpinner } from "../../assets/spinner/spinner.svg";

import "./Spinner.scss";

const Spinner: React.FC = () => {
  useEffect(() => {
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, []);

  return createPortal(
    <div className="spinner">
      <SVGSpinner />
    </div>,
    document.body
  );
};

export default Spinner;
