import React, { useMemo } from "react";
import { EditorState } from "draft-js";
// import { DraftInlineStyleType } from "draft-js";

import {
  ImBold,
  ImUnderline,
  ImItalic,
  ImStrikethrough,
  ImSuperscript,
  ImSubscript
} from "react-icons/im";
import { BiCodeAlt, BiHighlight, BiLink, BiUnlink } from "react-icons/bi";

import RTEControlButton from "../RTEControlButton/RTEControlButton";

import "./RTEInlineStyleControls.scss";

interface IRTEInlineStyleControlsProps {
  editorState: EditorState;
  onToggle: (s: string) => void;
  toggleLinkInput: () => void;
  unLink: () => void;
  removeLink: () => void;
  changeLinkUrl: (url: string) => void;
}

export enum CoreInlineType {
  bold = "BOLD",
  code = "CODE",
  italic = "ITALIC",
  strikethrough = "STRIKETHROUGH",
  underline = "UNDERLINE"
}

export enum CustomInlineType {
  superscript = "SUPERSCRIPT",
  subscript = "SUBSCRIPT",
  highlight = "HIGHLIGHT",
  link = "LINK",
  unlink = "UNLINK",
  removeLink = "REMOVE_LINK",
  changeLink = "CHANGE_LINK"
}

interface IInlineType {
  label: string;
  style: CoreInlineType | CustomInlineType;
  icon: JSX.Element;
}

const RTEInlineStyleControls: React.FC<IRTEInlineStyleControlsProps> = ({
  editorState,
  onToggle,
  toggleLinkInput,
  unLink
}) => {
  const INLINE_STYLES = useMemo<IInlineType[]>(
    () => [
      { label: "Bold", style: CoreInlineType.bold, icon: <ImBold /> },
      { label: "Italic", style: CoreInlineType.italic, icon: <ImItalic /> },
      { label: "Underline", style: CoreInlineType.underline, icon: <ImUnderline /> },
      { label: "Strikethrough", style: CoreInlineType.strikethrough, icon: <ImStrikethrough /> },
      { label: "Inline Code", style: CoreInlineType.code, icon: <BiCodeAlt /> },
      { label: "Superscript", style: CustomInlineType.superscript, icon: <ImSuperscript /> },
      { label: "Subscript", style: CustomInlineType.subscript, icon: <ImSubscript /> },
      { label: "HighLight", style: CustomInlineType.highlight, icon: <BiHighlight /> },
      { label: "Link", style: CustomInlineType.link, icon: <BiLink /> },
      { label: "Unlink", style: CustomInlineType.unlink, icon: <BiUnlink /> }
    ],
    []
  );

  const currentStyle = useMemo(() => editorState.getCurrentInlineStyle(), [editorState]);

  const isLink = useMemo(() => {
    const contentState = editorState.getCurrentContent();
    const startKey = editorState.getSelection().getStartKey();
    const startOffset = editorState.getSelection().getStartOffset();
    const currentBlock = contentState.getBlockForKey(startKey);
    const entityKey = currentBlock.getEntityAt(startOffset);
    return (
      entityKey !== null && contentState.getEntity(entityKey).getType() === CustomInlineType.link
    );
  }, [editorState]);

  return (
    <div className="rte-inline-style-controls">
      {INLINE_STYLES.map((type) => (
        <RTEControlButton
          key={type.label}
          isActive={
            currentStyle.has(type.style) || (type.style === CustomInlineType.link && isLink)
          }
          label={type.label}
          style={type.style}
          icon={type.icon}
          onToggle={onToggle}
          toggleLinkInput={toggleLinkInput}
          unLink={unLink}
        />
      ))}
    </div>
  );
};

export default RTEInlineStyleControls;
