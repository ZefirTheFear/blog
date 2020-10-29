import React, { useCallback, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import {
  Editor,
  EditorState,
  RichUtils,
  CompositeDecorator,
  ContentBlock,
  ContentState,
  CharacterMetadata,
  DraftBlockType,
  DraftEditorCommand,
  DefaultDraftBlockRenderMap,
  DraftBlockRenderConfig,
  DraftHandleValue,
  DraftStyleMap,
  convertToRaw
} from "draft-js";
import * as Immutable from "immutable";
import "draft-js/dist/Draft.css";
import { stateToHTML } from "draft-js-export-html";

import RTELink from "../RTELink/RTELink";
import RTEBlockStyleControls from "../RTEBlockStyleControls/RTEBlockStyleControls";
import RTEInlineStyleControls, {
  CustomInlineType
} from "../RTEInlineStyleControls/RTEInlineStyleControls";

import { RootState } from "../../redux/store";

import removeEntity from "../../utils/ts/removeEntity";
import changeUrl from "../../utils/ts/changeLinkUrl";

import globalStyles from "../../utils/css/variables.scss";
import "./ContentRichTextEditor.scss";

interface IContentRichTextEditorProps {
  isDragging: boolean;
}

const ContentRichTextEditor: React.FC<IContentRichTextEditorProps> = ({ isDragging }) => {
  const isDarkTheme = useSelector((state: RootState) => state.darkTheme.isDarkTheme);

  const findLinkEntities = useCallback(
    (
      contentBlock: ContentBlock,
      callback: (start: number, end: number) => void,
      contentState: ContentState
    ): void => {
      contentBlock.findEntityRanges((character: CharacterMetadata) => {
        const entityKey = character.getEntity();
        return (
          entityKey !== null &&
          contentState.getEntity(entityKey).getType() === CustomInlineType.link
        );
      }, callback);
    },
    []
  );

  const decorator = new CompositeDecorator([
    {
      strategy: findLinkEntities,
      component: RTELink
    }
  ]);

  const [editorState, setEditorState] = useState(() => EditorState.createEmpty(decorator));

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
        "header-four": {
          element: "h4"
        },
        unstyled: {
          element: "div"
        },
        section: {
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
      case "header-four":
        return "rte-h4";
      case "blockquote":
        return "rte-blockquote";
      case "code-block":
        return "rte-code-block";
      default:
        return "";
    }
  }, []);

  const customStyleMap = useMemo<DraftStyleMap>(() => {
    return {
      CODE: {
        display: "inline-block",
        padding: "5px",
        backgroundColor: globalStyles.commonGreyColor,
        fontFamily: "monospace",
        borderRadius: globalStyles.mainBorderRadius
      },
      SUPERSCRIPT: {
        fontSize: "0.7rem",
        verticalAlign: "top",
        display: "inline-flex"
      },
      SUBSCRIPT: {
        fontSize: "0.7rem",
        verticalAlign: "bottom",
        display: "inline-flex"
      },
      HIGHLIGHT: {
        backgroundColor: globalStyles.mainAppColor
      }
    };
  }, []);

  const setLink = useCallback((): void => {
    // получаем ссылку из prompt диалога
    const urlValue = prompt("Введите ссылку", "");
    if (!urlValue) {
      return;
    }

    // получаем текущий contentState
    const contentState = editorState.getCurrentContent();

    // создаем Entity
    const contentStateWithEntity = contentState.createEntity(CustomInlineType.link, "MUTABLE", {
      url: urlValue
    });

    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();

    // обновляем свойство currentContent у editorState
    const newEditorState = EditorState.set(editorState, { currentContent: contentStateWithEntity });

    // с помощью метода toggleLink из RichUtils генерируем новый
    // editorState и обновляем стейт
    setEditorState(RichUtils.toggleLink(newEditorState, newEditorState.getSelection(), entityKey));
  }, [editorState]);

  const unLink = useCallback((): void => {
    const selection = editorState.getSelection();
    if (!selection.isCollapsed()) {
      setEditorState(RichUtils.toggleLink(editorState, selection, null));
    }
  }, [editorState]);

  const removeLink = useCallback((): void => {
    const newState = removeEntity(editorState);
    setEditorState(newState);
  }, [editorState]);

  const changeLinkUrl = useCallback(() => {
    const newUrlValue = prompt("Введите ссылку", "");
    if (!newUrlValue) {
      return;
    }
    const newState = changeUrl(editorState, newUrlValue);
    setEditorState(newState);

    // const contentState = editorState.getCurrentContent();
    // const startKey = editorState.getSelection().getStartKey();
    // const startOffset = editorState.getSelection().getStartOffset();
    // const currentBlock = contentState.getBlockForKey(startKey);
    // const entityKey = currentBlock.getEntityAt(startOffset);
    // if (
    //   entityKey !== null &&
    //   contentState.getEntity(entityKey).getType() === CustomInlineType.link
    // ) {
    //   // contentState.replaceEntityData(entityKey, { url: newUrlValue });
    //   // contentState.mergeEntityData(entityKey, { url: newUrlValue, q: "q" });
    //   const newContentState = contentState.replaceEntityData(entityKey, {
    //     url: newUrlValue,
    //     q: "q"
    //   });
    //   const newEditorState = EditorState.set(editorState, { currentContent: newContentState });
    //   setEditorState(newEditorState);
    //   // const newEditorState = EditorState.push(editorState, newContentState, "apply-entity");
    //   // setEditorState(RichUtils.toggleInlineStyle(editorState, "h"));
    //   // setEditorState(RichUtils.toggleInlineStyle(editorState, "h"));
    // }
  }, [editorState]);

  // -------- dev only --------
  const logState = useCallback((): void => {
    console.log(convertToRaw(editorState.getCurrentContent()));
  }, [editorState]);
  // --------------------------

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
          setLink={setLink}
          unLink={unLink}
          removeLink={removeLink}
          changeLinkUrl={changeLinkUrl}
        />
      </div>
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
        />
      </div>
      <button onClick={logState}>Log State</button>
      {/* dev only */}
      <div className="rich-text-editor__html-preview">
        <pre>{stateToHTML(editorState.getCurrentContent())}</pre>
      </div>
      {/*  */}
    </div>
  );
};

export default ContentRichTextEditor;
