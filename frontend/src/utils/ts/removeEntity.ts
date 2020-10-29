import { EditorState, Modifier } from "draft-js";

export default function removeEntity(editorState: EditorState) {
  const contentState = editorState.getCurrentContent();
  const selectionState = editorState.getSelection();
  const startKey = selectionState.getStartKey();
  const startOffset = selectionState.getStartOffset();
  const currentContentBlock = contentState.getBlockForKey(startKey);
  const entityKey = currentContentBlock.getEntityAt(startOffset);

  if (!entityKey) {
    return editorState;
  }

  let entitySelection = selectionState;

  currentContentBlock.findEntityRanges(
    (character) => character.getEntity() === entityKey,
    (start, end) => {
      entitySelection = selectionState.merge({
        anchorOffset: start,
        focusOffset: end
      });
    }
  );

  const newContentState = Modifier.applyEntity(contentState, entitySelection, null);

  const newEditorState = EditorState.push(editorState, newContentState, "apply-entity");

  return newEditorState;
}
