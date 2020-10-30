import { EditorState, Modifier } from "draft-js";

export default function removeEntity(editorState: EditorState) {
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

  let newEditorState = EditorState.push(editorState, newContentState, "apply-entity");

  const newSelection = selectionState.merge({ anchorOffset: endOffset, focusOffset: endOffset });
  newEditorState = EditorState.forceSelection(newEditorState, newSelection);

  return newEditorState;
}
