import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { useSelector } from "react-redux";

import { MdClose } from "react-icons/md";

import { RootState } from "../../redux/store";

import "./Modal.scss";

interface IModalProps {
  closeModal: () => void;
}

const Modal: React.FC<IModalProps> = ({ closeModal, children }) => {
  const isDarkTheme = useSelector((state: RootState) => state.darkTheme.isDarkTheme);

  useEffect(() => {
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, []);

  return createPortal(
    <div className={"modal" + (isDarkTheme ? " modal_dark-mode" : "")}>
      <div className="modal__inner">
        <div className="modal__close">
          <MdClose onClick={closeModal} />
        </div>
        {children}
      </div>
    </div>,
    document.body
  );
};

export default Modal;
