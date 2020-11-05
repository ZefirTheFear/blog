import React, { useRef, useCallback, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useSelector } from "react-redux";

import { ICoordinates } from "../ContentRichTextEditor/ContentRichTextEditor";

import { RootState } from "../../redux/store";

import "./RTELinkModal.scss";

interface IRTELinkModalProps {
  coordinates: ICoordinates;
  checkModalOnBlur: (e: MouseEvent) => void;
}

const RTELinkModal: React.FC<IRTELinkModalProps> = ({
  coordinates,
  checkModalOnBlur,
  children
}) => {
  const isDarkTheme = useSelector((state: RootState) => state.darkTheme.isDarkTheme);

  const tooltipTriangle = useRef<HTMLDivElement>(null!);
  const modalInner = useRef<HTMLDivElement>(null!);

  const [isMounted, setIsMounted] = useState(false);

  const setPosition = useCallback(() => {
    tooltipTriangle.current.style.top = coordinates.top + "px";
    tooltipTriangle.current.style.left = coordinates.left + "px";
    tooltipTriangle.current.style.display = "block";

    const clientWidth = document.documentElement.clientWidth;
    const inputBlockoffsetWidth = parseInt(getComputedStyle(modalInner.current).width, 10);
    if (clientWidth / inputBlockoffsetWidth < 1.5) {
      modalInner.current.style.left = (clientWidth - inputBlockoffsetWidth) / 2 + "px";
    } else if (coordinates.left < clientWidth / 2) {
      modalInner.current.style.left = coordinates.left - 32 + "px";
    } else {
      modalInner.current.style.left = coordinates.left - inputBlockoffsetWidth + 32 + "px";
    }
    modalInner.current.style.top = coordinates.top + "px";
    modalInner.current.style.display = "block";
  }, [coordinates]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    window.addEventListener("mousedown", checkModalOnBlur);
    return () => {
      window.removeEventListener("mousedown", checkModalOnBlur);
    };
  }, [checkModalOnBlur]);

  useEffect(() => {
    if (!isMounted) {
      setPosition();
    }
  }, [isMounted, setPosition]);

  return createPortal(
    <div className={"rte-link-modal" + (isDarkTheme ? " rte-link-modal_dark-mode" : "")}>
      <div className="rte-link-modal__triangle" ref={tooltipTriangle} />
      <div className="rte-link-modal__inner" ref={modalInner}>
        {children}
      </div>
    </div>,
    document.body
  );
};

export default RTELinkModal;
