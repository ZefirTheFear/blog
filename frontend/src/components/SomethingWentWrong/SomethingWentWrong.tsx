import React, { useEffect } from "react";
// import { useCallback } from "react";
// import { useHistory } from "react-router-dom";
import { createPortal } from "react-dom";

import "./SomethingWentWrong.scss";

interface ISWWProps {
  Img: React.FC;
  msg: string;
  closeSWWModal: () => void;
}

const SomethingWentWrong: React.FC<ISWWProps> = ({ Img, msg, closeSWWModal }) => {
  // let history = useHistory();

  // const goToHomePage = useCallback(() => {
  //   history.push("/");
  // }, [history]);

  useEffect(() => {
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, []);

  return createPortal(
    <div className="something-went-wrong">
      <div className="something-went-wrong__img">
        <Img />
      </div>
      <div className="something-went-wrong__msg">{msg}</div>
      <div className="something-went-wrong__btn-group">
        <button onClick={closeSWWModal}>Ok</button>
        {/* <button onClick={goToHomePage}>To home page</button> */}
      </div>
    </div>,
    document.body
  );
};

export default SomethingWentWrong;
