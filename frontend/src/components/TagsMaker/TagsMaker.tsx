import React, { useCallback, useEffect, useState } from "react";

import { FaPlus, FaTrashAlt } from "react-icons/fa";

import InputGroup, { InputGroupType } from "../InputGroup/InputGroup";
import InvalidFeedback from "../InvalidFeedback/InvalidFeedback";

import "./TagsMaker.scss";

interface ITagsMakerProps {
  sendTagsToParent: (tags: string[]) => void;
  errors?: string[];
}

const TagsMaker: React.FC<ITagsMakerProps> = ({ sendTagsToParent, errors }) => {
  const [tags, setTags] = useState<string[]>([
    // "random tag",
    // "1234567890123456789012345678901234567890",
    // "fghf dfgh fghdfh",
    // "fghdfhdfg hdfhg",
    // "fghfdhd dfhfdgh hfdgh",
    // "fhdhdfg",
    // "fghdfgh"
  ]);
  const [currentTag, setCurrentTag] = useState("");
  const [tagErrors, setTagErrors] = useState<string[]>([]);

  const changeCurrentTagValue = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentTag(e.target.value);
  }, []);

  const focusTagInput = useCallback(() => {
    setTagErrors([]);
  }, []);

  const validate = useCallback(() => {
    for (const tag of tags) {
      if (tag === currentTag.trim()) {
        return;
      }
    }

    let validationErrors: string[] = [];

    if (currentTag.trim().length < 1 || currentTag.trim().length > 40) {
      const oldMsgs = validationErrors ? validationErrors : [];
      validationErrors = [...oldMsgs, "from 1 to 40 symbols"];
    }

    if (tags.length > 7) {
      const oldMsgs = validationErrors ? validationErrors : [];
      validationErrors = [...oldMsgs, "no more than 8 tags"];
    }

    return validationErrors;
  }, [currentTag, tags]);

  const addTag = useCallback(() => {
    const validationResult = validate();

    if (!validationResult) {
      setCurrentTag("");
      return;
    }
    if (validationResult.length > 0) {
      setTagErrors(validationResult);
      return;
    }
    setTags((prevTags) => [...prevTags, currentTag]);
    setCurrentTag("");
  }, [currentTag, validate]);

  const removeTag = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const newTags = tags.filter((tag) => tag !== e.currentTarget.getAttribute("data-tag"));
      setTags(newTags);
    },
    [tags]
  );

  useEffect(() => {
    sendTagsToParent(tags);
  }, [sendTagsToParent, tags]);

  return (
    <div className="tags-maker">
      <div className={"tags-maker__tags" + (errors ? " tags-maker__tags_invalid" : "")}>
        <div className="tags-maker__input-group">
          <div className="tags-maker__input">
            <InputGroup
              type={InputGroupType.plain}
              inputType="text"
              {...(tagErrors.length > 0 ? { errors: tagErrors } : {})}
              placeholder="tag"
              name="tag"
              value={currentTag}
              onChange={changeCurrentTagValue}
              onFocus={focusTagInput}
            />
          </div>
          <div className="tags-maker__add">
            <button type="button" onClick={addTag}>
              <FaPlus />
            </button>
          </div>
        </div>
        {tags.length > 0 && (
          <div className="tags-maker__tags-list">
            {tags.map((tag) => (
              <div key={tag} className="tags-maker__tag">
                <div className="tags-maker__remove-tag" data-tag={tag} onClick={removeTag}>
                  <FaTrashAlt />
                </div>
                <div className="tags-maker__tag-text">{tag}</div>
              </div>
            ))}
          </div>
        )}
      </div>
      {errors && errors.map((msg) => <InvalidFeedback key={msg} msg={msg} />)}
    </div>
  );
};

export default TagsMaker;
