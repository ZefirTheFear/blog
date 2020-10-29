import React, { useCallback } from "react";

import { CustomInlineType } from "../RTEInlineStyleControls/RTEInlineStyleControls";

import "./RTEControlButton.scss";

interface IRTEControlButtonProps {
  isActive: boolean;
  label: string;
  style: string;
  icon: JSX.Element;
  onToggle: (s: string) => void;
  setLink?: () => void;
  unLink?: () => void;
  removeLink?: () => void;
  changeLinkUrl?: () => void;
}

const RTEControlButton: React.FC<IRTEControlButtonProps> = ({
  isActive,
  label,
  style,
  icon,
  onToggle,
  setLink,
  unLink,
  removeLink,
  changeLinkUrl
}) => {
  const onToggleStyle = useCallback(
    (e: React.MouseEvent<HTMLSpanElement>): void => {
      e.preventDefault();
      if (style === CustomInlineType.link) {
        if (setLink) {
          setLink();
          return;
        }
      }
      if (style === CustomInlineType.unlink) {
        if (unLink) {
          unLink();
          return;
        }
      }
      if (style === CustomInlineType.removeLink) {
        if (removeLink) {
          removeLink();
          return;
        }
      }
      if (style === CustomInlineType.changeLink) {
        if (changeLinkUrl) {
          changeLinkUrl();
          return;
        }
      }
      onToggle(style);
    },
    [style, onToggle, setLink, unLink, removeLink, changeLinkUrl]
  );

  return (
    <span
      className={"rte-control-btn" + (isActive ? " rte-control-btn_active" : "")}
      onMouseDown={onToggleStyle}
      title={label}
    >
      {icon}
    </span>
  );
};

export default RTEControlButton;
