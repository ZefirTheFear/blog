import React, { useEffect } from "react";
import { createPortal } from "react-dom";

import { MdClose } from "react-icons/md";

import "./Modal.scss";

interface IModalProps {
  closeModal: () => void;
}

const Modal: React.FC<IModalProps> = ({ closeModal, children }) => {
  useEffect(() => {
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, []);

  return createPortal(
    <>
      <div className="modal">
        <div className="modal__inner">
          <div className="modal__close">
            <MdClose onClick={closeModal} />
          </div>
          {children}
        </div>
      </div>
    </>,
    document.body
  );
};

export default Modal;
