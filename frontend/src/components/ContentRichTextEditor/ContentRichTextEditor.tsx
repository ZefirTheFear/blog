import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import {
  Editor,
  EditorState,
  SelectionState,
  RichUtils,
  CompositeDecorator,
  ContentBlock,
  DraftBlockType,
  DraftEditorCommand,
  DefaultDraftBlockRenderMap,
  DraftBlockRenderConfig,
  DraftHandleValue,
  DraftStyleMap,
  convertToRaw,
  convertFromRaw
} from "draft-js";
import * as Immutable from "immutable";
import "draft-js/dist/Draft.css";
import { stateToHTML, Options } from "draft-js-export-html";
import parse from "html-react-parser";

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

import { RootState } from "../../redux/store";

import removeEntity from "../../utils/ts/rte/removeEntity";
import changeUrl from "../../utils/ts/rte/changeLinkUrl";
import findLinkEntities from "../../utils/ts/rte/findLinkEntities";
import addWrapperToCodeBlocks from "../../utils/ts/rte/addWrapperToCodeBlocks";
import addClassToLists from "../../utils/ts/rte/addClassToLists";

import globalStyles from "../../utils/css/variables.scss";
import "./ContentRichTextEditor.scss";

interface IContentRichTextEditorProps {
  isDragging: boolean;
}

const ContentRichTextEditor: React.FC<IContentRichTextEditorProps> = ({ isDragging }) => {
  const editor = useRef<Editor>(null!);

  const isDarkTheme = useSelector((state: RootState) => state.darkTheme.isDarkTheme);

  const decorator = new CompositeDecorator([
    {
      strategy: findLinkEntities,
      component: RTELink
    }
  ]);

  const [editorState, setEditorState] = useState(() => EditorState.createEmpty(decorator));
  const [isShowLinkInput, setIsShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [linkSelection, setLinkSelection] = useState<SelectionState>(null!);
  const [isSelectionOnLink, setIsSelectionOnLink] = useState(false);
  const [selectedLinkUrl, setSelectedLinkUrl] = useState("");

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

  const toggleLinkInput = useCallback(() => {
    const selection = editorState.getSelection();
    if (selection.isCollapsed()) {
      return;
    }
    setLinkSelection(selection);
    setIsShowLinkInput((prevState) => !prevState);
  }, [editorState]);

  const setLink = useCallback((): void => {
    const contentState = editorState.getCurrentContent();

    const contentStateWithEntity = contentState.createEntity(CustomInlineType.link, "MUTABLE", {
      url: linkUrl
    });

    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();

    let newEditorState = RichUtils.toggleLink(editorState, linkSelection, entityKey);

    const endOffset = linkSelection.getEndOffset();
    const newSelection = linkSelection.merge({ anchorOffset: endOffset, focusOffset: endOffset });
    newEditorState = EditorState.forceSelection(newEditorState, newSelection);

    setEditorState(newEditorState);
    setLinkUrl("");
    setIsShowLinkInput(false);
  }, [editorState, linkSelection, linkUrl]);

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

  const checkEditorState = useCallback(() => {
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
  }, [editorState]);

  // -------- dev only --------
  const convertOptions = useMemo<Options>(() => {
    return {
      defaultBlockTag: "p",
      blockStyleFn: (block) => {
        switch (block.getType()) {
          case CoreBlockType.headerFour:
            return {
              attributes: { class: "content-h4" }
            };
          case CoreBlockType.blockquote:
            return {
              attributes: { class: "content-blockquote" }
            };
          case CoreBlockType.unorderedLI:
            return {
              attributes: { class: "content-uli" }
            };
          case CoreBlockType.orderedLI:
            return {
              attributes: { class: "content-oli" }
            };
          default:
            return {};
        }
      },

      blockRenderers: {
        [CustomBlockType.section]: (block) => {
          return `<section class="content-section">${escape(block.getText())}</section>`;
        }
      },

      inlineStyles: {
        [CoreInlineType.bold]: { element: "span", attributes: { class: "content-bold" } },
        [CoreInlineType.italic]: { element: "span", attributes: { class: "content-italic" } },
        [CoreInlineType.underline]: { element: "span", attributes: { class: "content-underline" } },
        [CoreInlineType.strikethrough]: {
          element: "span",
          attributes: { class: "content-strikethrough" }
        },
        [CoreInlineType.code]: { attributes: { class: "content-inline-code" } },
        [CustomInlineType.superscript]: {
          element: "sup",
          attributes: { class: "content-sup" }
        },
        [CustomInlineType.subscript]: {
          element: "sub",
          attributes: { class: "content-sub" }
        },
        [CustomInlineType.highlight]: { attributes: { class: "content-highlight" } }
      },
      entityStyleFn: (entity) => {
        if (entity.getType() === CustomInlineType.link) {
          return {
            element: "a",
            attributes: {
              class: "content-link",
              href: entity.getData().url,
              target: "_blank"
            }
          };
        }
      }
    };
  }, []);

  const getContentAsRawJson = useCallback(() => {
    const contentState = editorState.getCurrentContent();
    const raw = convertToRaw(contentState);
    return JSON.stringify(raw, null, 2);
  }, [editorState]);

  const logState = useCallback((): void => {
    console.log(convertToRaw(editorState.getCurrentContent()));
  }, [editorState]);

  const saveContent = useCallback(() => {
    const json = getContentAsRawJson();
    localStorage.setItem("DraftEditorContentJson", json);
  }, [getContentAsRawJson]);

  const loadContent = useCallback(() => {
    const savedData = localStorage.getItem("DraftEditorContentJson");
    return savedData ? JSON.parse(savedData) : null;
  }, []);

  const setEditorContent = useCallback(() => {
    const rawEditorData = loadContent();
    if (rawEditorData !== null) {
      const contentState = convertFromRaw(rawEditorData);
      const newEditorState = EditorState.createWithContent(contentState, decorator);
      setEditorState(newEditorState);
    } else {
      setEditorState(EditorState.createEmpty(decorator));
    }
  }, [decorator, loadContent]);

  // const html = useMemo(() => {
  //   const rawEditorData = loadContent();
  //   let contentState;
  //   if (rawEditorData !== null) {
  //     contentState = convertFromRaw(rawEditorData);
  //   }
  //   if (contentState) {
  //     return stateToHTML(contentState, convertOptions);
  //   } else {
  //     return "";
  //   }
  // }, [convertOptions, loadContent]);
  // --------------------------

  useEffect(() => {
    checkEditorState();
  }, [checkEditorState]);

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
      <div className="content-rte__block-styles">
        <RTEBlockStyleControls editorState={editorState} onToggle={toggleBlockType} />
      </div>
      <div className="content-rte__inline-styles">
        <RTEInlineStyleControls
          editorState={editorState}
          onToggle={toggleInlineStyle}
          unLink={unLink}
          removeLink={removeLink}
          changeLinkUrl={changeLinkUrl}
          toggleLinkInput={toggleLinkInput}
        />
      </div>
      {isShowLinkInput && (
        <RTELinkInput linkUrl={linkUrl} setLinkUrl={setLinkUrl} setLink={setLink} />
      )}
      <div className="content-rte__editor">
        <Editor
          placeholder="Enter text"
          // spellCheck={true}
          editorState={editorState}
          onChange={setEditorState}
          stripPastedStyles={true}
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
        />
      )}
      {/* dev only */}
      <button className="dev-btn" onClick={logState}>
        Log State
      </button>
      <button className="dev-btn" onClick={saveContent}>
        Save content
      </button>
      <button className="dev-btn" onClick={setEditorContent}>
        Load content
      </button>
      <div className="rich-text-editor__html-preview">
        <pre>
          {addClassToLists(
            addWrapperToCodeBlocks(stateToHTML(editorState.getCurrentContent(), convertOptions))
          )}
        </pre>
      </div>
      <div className="rich-text-editor__html-preview">
        {parse(
          addClassToLists(
            addWrapperToCodeBlocks(stateToHTML(editorState.getCurrentContent(), convertOptions))
          )
        )}
      </div>
      {/*  */}
    </div>
  );
};

export default ContentRichTextEditor;
