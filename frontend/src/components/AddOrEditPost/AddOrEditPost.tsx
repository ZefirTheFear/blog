import React, { useMemo, useState, useCallback, useEffect } from "react";
import cloneDeep from "clone-deep";
import axios, { AxiosError } from "axios";

import InputGroup, { InputGroupType } from "../InputGroup/InputGroup";
import ContentMaker from "../ContentMaker/ContentMaker";
import TagsMaker from "../TagsMaker/TagsMaker";

import { ContentUnitToSend } from "../../models/ContentUnit";

import "./AddOrEditPost.scss";

interface IAddOrEditPostInputErrors {
  postTitle?: string[];
  postBody?: string[];
  tags?: string[];
}

enum AddOrEditPostInputFields {
  postTitle = "postTitle",
  postBody = "postBody",
  tags = "tags"
}

const AddOrEditPost: React.FC = () => {
  const signal = useMemo(() => {
    return axios.CancelToken.source();
  }, []);

  const [postTitle, setPostTitle] = useState("");
  const [postBody, setPostBody] = useState<ContentUnitToSend[]>([]);
  const [postTags, setPostTags] = useState<string[]>([]);
  const [inputErrors, setInputErrors] = useState<IAddOrEditPostInputErrors>({});

  const changePostTitleValue = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setPostTitle(e.target.value);
  }, []);

  const focusPostTitleInput = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      const newErrors = cloneDeep(inputErrors);
      delete newErrors.postTitle;
      return setInputErrors(newErrors);
    },
    [inputErrors]
  );

  const setContent = useCallback((content: ContentUnitToSend[]) => {
    setPostBody(content);
  }, []);

  const setTags = useCallback((tags: string[]) => {
    setPostTags(tags);
  }, []);

  const addOrEditPost = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      // TODO validation
      console.log("in progress");
      console.log("title", postTitle);
      console.log("postBody", postBody);
      console.log("tags", postTags);
    },
    [postBody, postTitle, postTags]
  );

  useEffect(() => {
    return () => {
      signal.cancel();
    };
  }, [signal]);

  return (
    <div className="add-or-edit-post">
      <form noValidate onSubmit={addOrEditPost}>
        <div className="add-or-edit-post__title">
          <InputGroup
            type={InputGroupType.plain}
            inputType="text"
            {...(inputErrors.postTitle ? { errors: inputErrors.postTitle } : {})}
            placeholder="Title"
            name={AddOrEditPostInputFields.postTitle}
            value={postTitle}
            onChange={changePostTitleValue}
            onFocus={focusPostTitleInput}
          />
        </div>
        <div className="add-or-edit-post__content-maker">
          <ContentMaker sendContentToParent={setContent} />
        </div>
        <div className="add-or-edit-post__tags-maker">
          <TagsMaker sendTagsToParent={setTags} />
        </div>

        <button type="submit" className="add-or-edit-post__submit-btn">
          Create Post
        </button>
      </form>
    </div>
  );
};

export default AddOrEditPost;
