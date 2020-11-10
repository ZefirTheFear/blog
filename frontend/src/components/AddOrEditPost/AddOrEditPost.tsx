import React, { useMemo, useState, useCallback, useEffect } from "react";
import cloneDeep from "clone-deep";
import axios, { AxiosError } from "axios";

import InputGroup, { InputGroupType } from "../InputGroup/InputGroup";
import ContentMaker from "../ContentMaker/ContentMaker";
import TagsMaker from "../TagsMaker/TagsMaker";

import { LocalStorageItems } from "../../models/LocalStorageItems";

import { ContentUnitToSend } from "../../models/ContentUnit";

import "./AddOrEditPost.scss";

interface IAddOrEditPostInputErrors {
  postTitle?: string[];
  postBody?: string[];
  postTags?: string[];
}

enum AddOrEditPostInputFields {
  postTitle = "postTitle"
}

const AddOrEditPost: React.FC = () => {
  const signal = useMemo(() => {
    return axios.CancelToken.source();
  }, []);

  const jwtToken = localStorage.getItem(LocalStorageItems.jwtToken);

  const [postTitle, setPostTitle] = useState("");
  const [postBody, setPostBody] = useState<ContentUnitToSend[]>([]);
  const [postTags, setPostTags] = useState<string[]>([]);
  const [inputErrors, setInputErrors] = useState<IAddOrEditPostInputErrors>({});

  const changePostTitleValue = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setPostTitle(e.target.value);
  }, []);

  const focusPostTitleInput = useCallback((): void => {
    const newErrors = cloneDeep(inputErrors);
    delete newErrors.postTitle;
    setInputErrors(newErrors);
    return;
  }, [inputErrors]);

  const setContent = useCallback((content: ContentUnitToSend[]) => {
    setPostBody(content);
  }, []);

  const setTags = useCallback((tags: string[]) => {
    setPostTags(tags);
  }, []);

  const validate = useCallback(() => {
    const clientErrors: IAddOrEditPostInputErrors = {};

    if (postTitle.trim().length < 1 || postTitle.trim().length > 50) {
      const oldMsgs = clientErrors.postTitle ? cloneDeep(clientErrors.postTitle) : [];
      clientErrors.postTitle = [...oldMsgs, "from 1 to 50 symbols"];
    }

    let postContent = cloneDeep(postBody);
    postContent = postContent.filter(
      (item) => !(item.type === "text" && item.content.length === 0)
    );
    if (postContent.length < 1 || postContent.length > 8) {
      const oldMsgs = clientErrors.postBody ? cloneDeep(clientErrors.postBody) : [];
      clientErrors.postBody = [...oldMsgs, "from 1 to 8 content units"];
    }

    if (postTags.length < 1 || postTags.length > 8) {
      const oldMsgs = clientErrors.postTags ? cloneDeep(clientErrors.postTags) : [];
      clientErrors.postTags = [...oldMsgs, "from 1 to 8 tags"];
    }

    if (Object.keys(clientErrors).length > 0) {
      return clientErrors;
    }
  }, [postTitle, postBody, postTags]);

  const clearContentErrors = useCallback(() => {
    const newErrors = cloneDeep(inputErrors);
    delete newErrors.postBody;
    return setInputErrors(newErrors);
  }, [inputErrors]);

  const clearTagsErrors = useCallback(() => {
    const newErrors = cloneDeep(inputErrors);
    delete newErrors.postTags;
    return setInputErrors(newErrors);
  }, [inputErrors]);

  const addOrEditPost = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const validationResult = validate();
      console.log(validationResult);

      if (validationResult) {
        return setInputErrors(validationResult);
      }

      console.log("title", postTitle);
      console.log("postBody", postBody);
      console.log("tags", postTags);

      const postData = new FormData();
      postData.append("title", postTitle);
      const text: string[] = [];
      const contentOrder: ("text" | "image")[] = [];
      for (const contentUnit of postBody) {
        if (contentUnit.type === "text") {
          text.push(contentUnit.content);
          contentOrder.push("text");
        } else if (contentUnit.type === "image") {
          postData.append("images", contentUnit.content);
          contentOrder.push("image");
        }
      }
      postData.append("contentOrder", JSON.stringify(contentOrder));
      postData.append("text", JSON.stringify(text));
      postData.append("tags", JSON.stringify(postTags));

      axios
        .post("/posts/create-post", postData, {
          headers: { Authorization: jwtToken },
          cancelToken: signal.token
        })
        .then((response) => {
          console.log(response);
        });
    },
    [validate, postTitle, postBody, postTags, jwtToken, signal]
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
        <div className="add-or-edit-post__content-maker" onClick={clearContentErrors}>
          <ContentMaker
            sendContentToParent={setContent}
            {...(inputErrors.postBody ? { errors: inputErrors.postBody } : {})}
          />
        </div>
        <div className="add-or-edit-post__tags-maker" onClick={clearTagsErrors}>
          <TagsMaker
            sendTagsToParent={setTags}
            {...(inputErrors.postTags ? { errors: inputErrors.postTags } : {})}
          />
        </div>

        <button type="submit" className="add-or-edit-post__submit-btn">
          Create Post
        </button>
      </form>
    </div>
  );
};

export default AddOrEditPost;
