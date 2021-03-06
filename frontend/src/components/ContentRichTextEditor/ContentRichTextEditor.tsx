import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import {
  Editor,
  EditorState,
  RichUtils,
  CompositeDecorator,
  ContentBlock,
  DraftBlockType,
  DraftEditorCommand,
  DefaultDraftBlockRenderMap,
  DraftBlockRenderConfig,
  DraftHandleValue,
  DraftStyleMap,
  Modifier,
  convertFromRaw,
  convertToRaw
} from "draft-js";
import * as Immutable from "immutable";
import "draft-js/dist/Draft.css";

import RTELink from "../RTELink/RTELink";
import RTELinkInput from "../RTELinkInput/RTELinkInput";
import RTELinkOptions from "../RTELinkOptions/RTELinkOptions";
import RTEBlockStyleControls, {
  CoreBlockType,
  CustomBlockType
} from "../RTEBlockStyleControls/RTEBlockStyleControls";
import RTEInlineStyleControls, {
  CoreInlineType,
  CustomInlineType
} from "../RTEInlineStyleControls/RTEInlineStyleControls";
// import RTEDevOnly from "../RTEDevOnly/RTEDevOnly";

import { RootState } from "../../redux/store";

import removeEntity from "../../utils/ts/rte/removeEntity";
import changeUrl from "../../utils/ts/rte/changeLinkUrl";
import findLinkEntities from "../../utils/ts/rte/findLinkEntities";

import globalStyles from "../../utils/css/variables.scss";
import "./ContentRichTextEditor.scss";

interface IContentRichTextEditorProps {
  content: string;
  index: number;
  onChangeTextBlockData: (content: string, index: number) => void;
  isDragging: boolean;
}

export interface ICoordinates {
  top: number;
  left: number;
}

const ContentRichTextEditor: React.FC<IContentRichTextEditorProps> = ({
  content,
  index,
  onChangeTextBlockData,
  isDragging
}) => {
  const editor = useRef<Editor>(null!);
  const editorWrapper = useRef<HTMLDivElement>(null!);
  const editingOptions = useRef<HTMLDivElement>(null!);

  const isDarkTheme = useSelector((state: RootState) => state.darkTheme.isDarkTheme);

  const decorator = new CompositeDecorator([
    {
      strategy: findLinkEntities,
      component: RTELink
    }
  ]);

  // const [editorState, setEditorState] = useState(() => EditorState.createEmpty(decorator));
  const [editorState, setEditorState] = useState(() => {
    if (content === "") {
      return EditorState.createEmpty(decorator);
    } else {
      const contentState = convertFromRaw(JSON.parse(content));
      return EditorState.createWithContent(contentState, decorator);
    }
  });

  const [isOpenEditingOptions, setIsOpenEditingOptions] = useState(false);

  const [isShowLinkInput, setIsShowLinkInput] = useState(false);
  const [caretCoordinates, setCaretCoordinates] = useState<ICoordinates>({ top: 0, left: 0 });

  const [isSelectionOnLink, setIsSelectionOnLink] = useState(false);
  const [selectedLinkUrl, setSelectedLinkUrl] = useState("");
  const [selectedLinkCoordinates, setSelectedLinkCoordinates] = useState<ICoordinates>({
    top: 0,
    left: 0
  });

  const toggleEditingOptions = useCallback(() => {
    const elem = editingOptions.current;
    if (isOpenEditingOptions) {
      elem.style.height = "0";
    } else {
      elem.style.height = elem.scrollHeight + "px";
    }
    setIsOpenEditingOptions((prevState) => !prevState);
  }, [isOpenEditingOptions]);

  const toggleBlockType = useCallback(
    (blockType: DraftBlockType): void => {
      setEditorState(RichUtils.toggleBlockType(editorState, blockType));
    },
    [editorState]
  );

  const toggleInlineStyle = useCallback(
    (inlineStyle: string): void => {
      setEditorState(RichUtils.toggleInlineStyle(editorState, inlineStyle));
    },
    [editorState]
  );

  const handleKeyCommand = useCallback(
    (command: DraftEditorCommand): DraftHandleValue => {
      const newState = RichUtils.handleKeyCommand(editorState, command);

      if (newState) {
        setEditorState(newState);
        return "handled";
      }

      return "not-handled";
    },
    [editorState]
  );

  const blockRenderMap = useMemo(
    () =>
      Immutable.Map<DraftBlockType, DraftBlockRenderConfig>({
        [CoreBlockType.unstyled]: {
          element: "div"
        },
        [CustomBlockType.section]: {
          element: "section"
        }
      }),
    []
  );

  const extendedBlockRenderMap = useMemo(() => DefaultDraftBlockRenderMap.merge(blockRenderMap), [
    blockRenderMap
  ]);

  const blockStyleFn = useCallback((block: ContentBlock): string => {
    switch (block.getType()) {
      case CoreBlockType.headerFour:
        return "content-rte__h4";
      case CoreBlockType.blockquote:
        return "content-rte__blockquote";
      case CoreBlockType.codeBlock:
        return "content-rte__code-block";
      case CoreBlockType.unorderedLI:
        return "content-rte__unordered-li";
      case CoreBlockType.orderedLI:
        return "content-rte__ordered-li";
      case CustomBlockType.section:
        return "content-rte__section";
      default:
        return "";
    }
  }, []);

  const customStyleMap = useMemo<DraftStyleMap>(() => {
    return {
      [CoreInlineType.code]: {
        display: "inline-block",
        padding: "3px",
        fontFamily: "monospace",
        fontSize: "16px",
        backgroundColor: globalStyles.commonGreyColor,
        borderRadius: globalStyles.mainBorderRadius
      },
      [CustomInlineType.superscript]: {
        fontSize: "0.7rem",
        verticalAlign: "top",
        display: "inline-flex"
      },
      [CustomInlineType.subscript]: {
        fontSize: "0.7rem",
        verticalAlign: "bottom",
        display: "inline-flex"
      },
      [CustomInlineType.highlight]: {
        backgroundColor: globalStyles.mainAppColor
      }
    };
  }, []);

  const setLink = useCallback(
    (isFromSelection: boolean, url: string, text: string): void => {
      const currentContentState = editorState.getCurrentContent();
      const currentSelection = editorState.getSelection();

      let newEditorState = EditorState.createEmpty();

      if (isFromSelection) {
        const contentStateWithEntity = currentContentState.createEntity(
          CustomInlineType.link,
          "MUTABLE",
          { url: url }
        );
        const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
        newEditorState = RichUtils.toggleLink(editorState, currentSelection, entityKey);
        const endOffset = currentSelection.getEndOffset();
        const newSelection = currentSelection.merge({
          anchorOffset: endOffset,
          focusOffset: endOffset
        });
        newEditorState = EditorState.forceSelection(newEditorState, newSelection);
      } else if (text) {
        // const anchorKey = currentSelection.getAnchorKey();
        // const currentContentBlock = currentContentState.getBlockForKey(anchorKey);
        // const start = currentSelection.getStartOffset();
        // const end = currentSelection.getEndOffset();
        // const selectedText = currentContentBlock.getText().slice(start, end);
        // console.log(selectedText);

        const contentStateWithEntity = currentContentState.createEntity(
          CustomInlineType.link,
          "MUTABLE",
          { url: url }
        );
        const newEntityKey = contentStateWithEntity.getLastCreatedEntityKey();
        const newContentState = Modifier.insertText(
          currentContentState,
          currentSelection,
          text,
          undefined,
          newEntityKey
        );
        newEditorState = EditorState.set(editorState, { currentContent: newContentState });

        const newSelection = currentSelection.merge({
          anchorOffset: currentSelection.getEndOffset() + text.length,
          focusOffset: currentSelection.getEndOffset() + text.length
        });
        newEditorState = EditorState.forceSelection(newEditorState, newSelection);
      }

      setEditorState(newEditorState);
      setIsShowLinkInput(false);
    },
    [editorState]
  );

  const unLink = useCallback((): void => {
    const selection = editorState.getSelection();
    if (!selection.isCollapsed()) {
      setEditorState(RichUtils.toggleLink(editorState, selection, null));
    }
  }, [editorState]);

  const removeLink = useCallback((): void => {
    const newState = removeEntity(editorState);
    setEditorState(newState);
    setTimeout(() => {
      editor.current.focus();
    }, 0);
  }, [editorState]);

  const changeLinkUrl = useCallback(
    (newUrl: string) => {
      const newState = changeUrl(editorState, newUrl);
      setEditorState(newState);
      setTimeout(() => {
        editor.current.focus();
      }, 0);
    },
    [editorState]
  );

  const checkIsSelectionOnLink = useCallback(() => {
    const contentState = editorState.getCurrentContent();
    const startKey = editorState.getSelection().getStartKey();
    const startOffset = editorState.getSelection().getStartOffset();
    const endOffset = editorState.getSelection().getEndOffset();
    const currentBlock = contentState.getBlockForKey(startKey);
    const startSelectionEntityKey = currentBlock.getEntityAt(startOffset);
    const endSelectionEntityKey = currentBlock.getEntityAt(endOffset);
    if (!startSelectionEntityKey || !endSelectionEntityKey) {
      setIsSelectionOnLink(false);
      return;
    }
    const currentEntity = contentState.getEntity(startSelectionEntityKey);
    const isOnLink =
      startSelectionEntityKey === endSelectionEntityKey &&
      currentEntity.getType() === CustomInlineType.link;
    const { url } = currentEntity.getData();
    setIsSelectionOnLink(isOnLink);
    setSelectedLinkUrl(url);

    const selection = window.getSelection();
    if (selection) {
      const node = selection.anchorNode;
      if (node) {
        const element = node.parentElement;
        if (element) {
          const top = window.pageYOffset + element.getBoundingClientRect().bottom;
          const left = element.getBoundingClientRect().left;
          setSelectedLinkCoordinates({ top, left });
        }
      }
    }
  }, [editorState]);

  const isSelection = useMemo((): boolean => {
    const currentSelection = editorState.getSelection();
    return !currentSelection.isCollapsed();
  }, [editorState]);

  const setInputCoords = useCallback((): void => {
    const selection = window.getSelection();
    if (selection) {
      const range = selection.getRangeAt(0);

      const endNode = range.endContainer;
      if (range.endOffset === 0) {
        range.setEnd(endNode, 1);
        const top = window.pageYOffset + range.getBoundingClientRect().bottom;
        const left = range.getBoundingClientRect().left;
        setCaretCoordinates({ top, left });
        range.setEnd(endNode, 0);
      } else {
        const top = window.pageYOffset + range.getBoundingClientRect().bottom;
        const left = range.getBoundingClientRect().left;
        setCaretCoordinates({ top, left });
      }
    }
  }, []);

  const openLinkInput = useCallback(() => {
    setIsShowLinkInput(true);
  }, []);

  const closeLinkInput = useCallback(() => {
    setIsShowLinkInput(false);
  }, []);

  const closeLinkOptions = useCallback(() => {
    setTimeout(() => {
      setIsSelectionOnLink(false);
    }, 0);
  }, []);

  useEffect(() => {
    editor.current.focus();
  }, []);

  useEffect(() => {
    checkIsSelectionOnLink();
  }, [checkIsSelectionOnLink]);

  useEffect(() => {
    const editorHasFocus = editorState.getSelection().getHasFocus();
    if (editorHasFocus) {
      setInputCoords();
    }
  }, [editorState, setInputCoords]);

  useEffect(() => {
    const contentState = editorState.getCurrentContent();
    // -----
    if (contentState.getPlainText().trim() === "") {
      onChangeTextBlockData("", index);
      return;
    }
    // -----
    const rawState = convertToRaw(contentState);
    onChangeTextBlockData(JSON.stringify(rawState, null, 2), index);
  }, [editorState, index, onChangeTextBlockData]);

  const rteClassName = useMemo(() => {
    let className = "content-rte" + (isDragging ? " content-rte_is-dragging" : "");
    const contentState = editorState.getCurrentContent();
    if (!contentState.hasText()) {
      if (contentState.getBlockMap().first().getType() !== "unstyled") {
        className += " content-rte_placeholder_hidden";
      }
    }
    if (isDarkTheme) {
      className += " content-rte_dark-mode";
    }
    return className;
  }, [editorState, isDarkTheme, isDragging]);

  return (
    <div className={rteClassName}>
      <div className="content-rte-options-toggler">
        <button
          className="content-rte-options-toggler-btn"
          type="button"
          onClick={toggleEditingOptions}
        >
          {isOpenEditingOptions ? "hide " : "show "} editing options
        </button>
      </div>
      <div className="content-rte__editing-options" ref={editingOptions}>
        <div className="content-rte__block-styles">
          <RTEBlockStyleControls editorState={editorState} onToggle={toggleBlockType} />
        </div>
        <div className="content-rte__inline-styles">
          <RTEInlineStyleControls
            editorState={editorState}
            onToggle={toggleInlineStyle}
            unLink={unLink}
            openLinkInput={openLinkInput}
          />
        </div>
      </div>
      {isShowLinkInput && (
        <RTELinkInput
          setLink={setLink}
          isSelection={isSelection}
          closeLinkInput={closeLinkInput}
          coordinates={caretCoordinates}
        />
      )}
      <div className="content-rte__editor" ref={editorWrapper}>
        <Editor
          placeholder="Enter text"
          // spellCheck={true}
          editorState={editorState}
          onChange={setEditorState}
          // stripPastedStyles={true}
          handleKeyCommand={handleKeyCommand}
          blockRenderMap={extendedBlockRenderMap}
          blockStyleFn={blockStyleFn}
          customStyleMap={customStyleMap}
          ref={editor}
        />
      </div>
      {isSelectionOnLink && (
        <RTELinkOptions
          linkUrl={selectedLinkUrl}
          changeLinkUrl={changeLinkUrl}
          removeLink={removeLink}
          closeLinkOptions={closeLinkOptions}
          coordinates={selectedLinkCoordinates}
          editorWrapper={editorWrapper}
        />
      )}
      {/* dev only */}
      {/* <RTEDevOnly decorator={decorator} editorState={editorState} setEditorState={setEditorState} /> */}
      {/*  */}
    </div>
  );
};

export default ContentRichTextEditor;
