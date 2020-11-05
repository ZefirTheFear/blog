import React, { useCallback, useMemo } from "react";
import { EditorState, convertToRaw, convertFromRaw, CompositeDecorator } from "draft-js";
import { stateToHTML, Options } from "draft-js-export-html";
import parse from "html-react-parser";

import { CoreBlockType, CustomBlockType } from "../RTEBlockStyleControls/RTEBlockStyleControls";
import { CoreInlineType, CustomInlineType } from "../RTEInlineStyleControls/RTEInlineStyleControls";

import addWrapperToCodeBlocks from "../../utils/ts/rte/addWrapperToCodeBlocks";
import addClassToLists from "../../utils/ts/rte/addClassToLists";

import "./RTEDevOnly.scss";

interface IRTEDevOnlyProps {
  decorator: CompositeDecorator;
  editorState: EditorState;
  setEditorState: (editorState: EditorState) => void;
}

const RTEDevOnly: React.FC<IRTEDevOnlyProps> = ({ decorator, editorState, setEditorState }) => {
  const getContentAsRawJson = useCallback(() => {
    const contentState = editorState.getCurrentContent();
    const rawState = convertToRaw(contentState);
    return JSON.stringify(rawState, null, 2);
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

  const setEditorContent = useCallback(() => {
    const rawEditorData = loadContent();
    if (rawEditorData !== null) {
      const contentState = convertFromRaw(rawEditorData);
      const newEditorState = EditorState.createWithContent(contentState, decorator);
      setEditorState(newEditorState);
    } else {
      setEditorState(EditorState.createEmpty(decorator));
    }
  }, [decorator, loadContent, setEditorState]);

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

  return (
    <div className="rte-dev-only">
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
    </div>
  );
};

export default RTEDevOnly;
