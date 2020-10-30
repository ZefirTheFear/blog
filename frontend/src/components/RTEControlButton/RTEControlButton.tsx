import React, { useCallback } from "react";

import { CustomInlineType } from "../RTEInlineStyleControls/RTEInlineStyleControls";

import "./RTEControlButton.scss";

interface IRTEControlButtonProps {
  isActive: boolean;
  label: string;
  style: string;
  icon: JSX.Element;
  onToggle: (s: string) => void;
  toggleLinkInput?: () => void;
  unLink?: () => void;
}

const RTEControlButton: React.FC<IRTEControlButtonProps> = ({
  isActive,
  label,
  style,
  icon,
  onToggle,
  toggleLinkInput,
  unLink
}) => {
  const onToggleStyle = useCallback(
    (e: React.MouseEvent<HTMLSpanElement>): void => {
      e.preventDefault();
      if (style === CustomInlineType.link) {
        if (toggleLinkInput) {
          toggleLinkInput();
          return;
        }
      }
      if (style === CustomInlineType.unlink) {
        if (unLink) {
          unLink();
          return;
        }
      }
      onToggle(style);
    },
    [style, onToggle, toggleLinkInput, unLink]
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
