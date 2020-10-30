import { ContentState, ContentBlock, CharacterMetadata } from "draft-js";

import { CustomInlineType } from "../../../components/RTEInlineStyleControls/RTEInlineStyleControls";

export default (
  contentBlock: ContentBlock,
  callback: (start: number, end: number) => void,
  contentState: ContentState
): void => {
  contentBlock.findEntityRanges((character: CharacterMetadata) => {
    const entityKey = character.getEntity();
    return (
      entityKey !== null && contentState.getEntity(entityKey).getType() === CustomInlineType.link
    );
  }, callback);
};
