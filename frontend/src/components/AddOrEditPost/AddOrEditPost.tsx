import React, { useMemo, useState, useCallback, useEffect } from "react";
import cloneDeep from "clone-deep";
import axios, { AxiosError } from "axios";

import InputGroup, { InputGroupType } from "../InputGroup/InputGroup";
import TagsMaker from "../TagsMaker/TagsMaker";

import { PostBodyUnit } from "../../models/PostBodyUnit";

import "./AddOrEditPost.scss";
import ContentMaker from "../ContentMaker/ContentMaker";

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
  const [postBody, setPostBody] = useState<PostBodyUnit[]>([]);
  const [tags, setTags] = useState<string[]>([]);
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

  const addOrEditPost = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("in progress");
  }, []);

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
          <ContentMaker />
        </div>
        <div className="add-or-edit-post__tags-maker">
          <TagsMaker />
        </div>

        <button type="submit" className="add-or-edit-post__submit-btn">
          Create Post
        </button>
      </form>
    </div>
  );
};

export default AddOrEditPost;
