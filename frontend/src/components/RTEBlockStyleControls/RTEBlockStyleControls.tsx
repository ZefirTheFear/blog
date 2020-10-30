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

export enum CoreBlockType {
  unstyled = "unstyled",
  paragraph = "paragraph",
  headerOne = "header-one",
  headerTwo = "header-two",
  headerThree = "header-three",
  headerFour = "header-four",
  headerFive = "header-five",
  headerSix = "header-six",
  unorderedLI = "unordered-list-item",
  orderedLI = "ordered-list-item",
  blockquote = "blockquote",
  codeBlock = "code-block",
  atomic = "atomic"
}

export enum CustomBlockType {
  section = "section"
}

interface IBlockType {
  label: string;
  style: CoreBlockType | CustomBlockType;
  icon: JSX.Element;
}

const RTEBlockStyleControls: React.FC<IRTEBlockStyleControlsProps> = ({
  editorState,
  onToggle
}) => {
  const BLOCK_TYPES = useMemo<IBlockType[]>(
    () => [
      { label: "Heading", style: CoreBlockType.headerFour, icon: <FaHeading /> },
      { label: "Blockquote", style: CoreBlockType.blockquote, icon: <FaQuoteLeft /> },
      { label: "Unordered list", style: CoreBlockType.unorderedLI, icon: <FaListUl /> },
      { label: "Ordered list", style: CoreBlockType.orderedLI, icon: <FaListOl /> },
      { label: "Code Block", style: CoreBlockType.codeBlock, icon: <BiCodeBlock /> },
      { label: "Section", style: CustomBlockType.section, icon: <FaParagraph /> }
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
