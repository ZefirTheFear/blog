import React, { useMemo } from "react";
import { EditorState, DraftInlineStyleType } from "draft-js";

import {
  ImBold,
  ImUnderline,
  ImItalic,
  ImStrikethrough,
  ImSuperscript,
  ImSubscript,
  ImLink
} from "react-icons/im";
import { BiCodeAlt, BiHighlight, BiLinkAlt, BiUnlink } from "react-icons/bi";
import { FiExternalLink } from "react-icons/fi";

import RTEControlButton from "../RTEControlButton/RTEControlButton";

import "./RTEInlineStyleControls.scss";

interface IRTEInlineStyleControlsProps {
  editorState: EditorState;
  onToggle: (s: string) => void;
  setLink: () => void;
  unLink: () => void;
  removeLink: () => void;
  changeLinkUrl: () => void;
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
  style: DraftInlineStyleType | CustomInlineType;
  icon: JSX.Element;
}

const RTEInlineStyleControls: React.FC<IRTEInlineStyleControlsProps> = ({
  editorState,
  onToggle,
  setLink,
  unLink,
  removeLink,
  changeLinkUrl
}) => {
  const INLINE_STYLES = useMemo<IInlineType[]>(
    () => [
      { label: "Bold", style: "BOLD", icon: <ImBold /> },
      { label: "Italic", style: "ITALIC", icon: <ImItalic /> },
      { label: "Underline", style: "UNDERLINE", icon: <ImUnderline /> },
      { label: "Strikethrough", style: "STRIKETHROUGH", icon: <ImStrikethrough /> },
      { label: "Monospace", style: "CODE", icon: <BiCodeAlt /> },
      { label: "Superscript", style: CustomInlineType.superscript, icon: <ImSuperscript /> },
      { label: "Subscript", style: CustomInlineType.subscript, icon: <ImSubscript /> },
      { label: "HighLight", style: CustomInlineType.highlight, icon: <BiHighlight /> },
      { label: "Link", style: CustomInlineType.link, icon: <ImLink /> },
      { label: "Unlink", style: CustomInlineType.unlink, icon: <BiLinkAlt /> },
      { label: "Remove Link", style: CustomInlineType.removeLink, icon: <BiUnlink /> },
      { label: "Change Link Url", style: CustomInlineType.changeLink, icon: <FiExternalLink /> }
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
          setLink={setLink}
          unLink={unLink}
          removeLink={removeLink}
          changeLinkUrl={changeLinkUrl}
        />
      ))}
    </div>
  );
};

export default RTEInlineStyleControls;
