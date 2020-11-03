import { EditorState } from "draft-js";

export default function changeLinkUrl(editorState: EditorState, newUrl: string) {
  const contentState = editorState.getCurrentContent();
  const selectionState = editorState.getSelection();
  const startKey = selectionState.getStartKey();
  const startOffset = selectionState.getStartOffset();
  const endOffset = selectionState.getEndOffset();
  const currentContentBlock = contentState.getBlockForKey(startKey);
  const entityKey = currentContentBlock.getEntityAt(startOffset);

  if (!entityKey) {
    return editorState;
  }

  const newConSt = contentState.replaceEntityData(entityKey, { url: newUrl });
  let newEditorState = EditorState.set(editorState, { currentContent: newConSt });

  const newSelection = selectionState.merge({ anchorOffset: endOffset, focusOffset: endOffset });
  newEditorState = EditorState.forceSelection(newEditorState, newSelection);

  return newEditorState;
}
