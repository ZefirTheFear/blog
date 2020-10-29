import React, { useMemo } from "react";
import { EditorState, DraftBlockType } from "draft-js";

import { FaHeading, FaListOl, FaListUl, FaParagraph, FaQuoteLeft } from "react-icons/fa";
import { BiCodeBlock } from "react-icons/bi";

import RTEControlButton from "../RTEControlButton/RTEControlButton";

import "./RTEBlockStyleControls.scss";

interface IRTEBlockStyleControlsProps {
  editorState: EditorState;
  onToggle: (s: DraftBlockType) => void;
}

type CoreDraftBlockType =
  | "unstyled"
  | "paragraph"
  | "header-one"
  | "header-two"
  | "header-three"
  | "header-four"
  | "header-five"
  | "header-six"
  | "unordered-list-item"
  | "ordered-list-item"
  | "blockquote"
  | "code-block"
  | "atomic";

type CustomBlockType = "section";

interface IBlockType {
  label: string;
  style: CoreDraftBlockType | CustomBlockType;
  icon: JSX.Element;
}

const RTEBlockStyleControls: React.FC<IRTEBlockStyleControlsProps> = ({
  editorState,
  onToggle
}) => {
  const BLOCK_TYPES = useMemo<IBlockType[]>(
    () => [
      { label: "Heading", style: "header-four", icon: <FaHeading /> },
      { label: "Blockquote", style: "blockquote", icon: <FaQuoteLeft /> },
      { label: "Unordered list", style: "unordered-list-item", icon: <FaListUl /> },
      { label: "Ordered list", style: "ordered-list-item", icon: <FaListOl /> },
      { label: "Code Block", style: "code-block", icon: <BiCodeBlock /> },
      { label: "Section", style: "section", icon: <FaParagraph /> }
    ],
    []
  );

  const selection = useMemo(() => editorState.getSelection(), [editorState]);
  const blockType = useMemo(
    () => editorState.getCurrentContent().getBlockForKey(selection.getStartKey()).getType(),
    [editorState, selection]
  );

  return (
    <div className="rte-block-style-controls">
      {BLOCK_TYPES.map((type) => (
        <RTEControlButton
          key={type.label}
          isActive={type.style === blockType}
          label={type.label}
          style={type.style}
          icon={type.icon}
          onToggle={onToggle}
        />
      ))}
    </div>
  );
};

export default RTEBlockStyleControls;
