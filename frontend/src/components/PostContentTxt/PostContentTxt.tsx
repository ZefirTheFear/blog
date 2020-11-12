import React, { useMemo } from "react";
import { convertFromRaw } from "draft-js";
import { stateToHTML, Options } from "draft-js-export-html";
import parse from "html-react-parser";

import { CoreBlockType, CustomBlockType } from "../RTEBlockStyleControls/RTEBlockStyleControls";
import { CoreInlineType, CustomInlineType } from "../RTEInlineStyleControls/RTEInlineStyleControls";

import addWrapperToCodeBlocks from "../../utils/ts/rte/addWrapperToCodeBlocks";
import addClassToLists from "../../utils/ts/rte/addClassToLists";

import "./PostContentTxt.scss";

interface IPostContentTxtProps {
  content: string;
}

const PostContentTxt: React.FC<IPostContentTxtProps> = ({ content }) => {
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

  const html = useMemo(() => {
    const contentState = convertFromRaw(JSON.parse(content));
    let html = stateToHTML(contentState, convertOptions);
    html = addWrapperToCodeBlocks(html);
    html = addClassToLists(html);
    return html;
  }, [content, convertOptions]);

  return <>{parse(html)}</>;
};

export default PostContentTxt;
