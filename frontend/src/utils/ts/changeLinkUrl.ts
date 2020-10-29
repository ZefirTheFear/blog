import { EditorState, RichUtils } from "draft-js";
import { CustomInlineType } from "../../components/RTEInlineStyleControls/RTEInlineStyleControls";

export default function removeEntity(editorState: EditorState, newUrl: string) {
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

  const contentStateWithEntity = contentState.createEntity(CustomInlineType.link, "MUTABLE", {
    url: newUrl
  });
  const newEntityKey = contentStateWithEntity.getLastCreatedEntityKey();
  // let newContentState = Modifier.applyEntity(contentState, entitySelection, null);
  // newEditorState = EditorState.push(editorState, newContentState, "apply-entity");
  // newEditorState = EditorState.set(editorState, { currentContent: contentStateWithEntity });
  // newEditorState = RichUtils.toggleLink(newEditorState, entitySelection, newEntityKey);
  const newEditorState = RichUtils.toggleLink(editorState, entitySelection, newEntityKey);

  return newEditorState;
}
