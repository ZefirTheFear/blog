import React, { useMemo, useState, useCallback, useEffect } from "react";
import cloneDeep from "clone-deep";
import axios, { AxiosError } from "axios";
import { useHistory } from "react-router-dom";

import Spinner from "../Spinner/Spinner";
import SomethingWentWrong from "../SomethingWentWrong/SomethingWentWrong";
import { ReactComponent as SWWImg } from "../../assets/errorImgs/client-server-error.svg";
import InputGroup, { InputGroupType } from "../InputGroup/InputGroup";
import ContentMaker from "../ContentMaker/ContentMaker";
import TagsMaker from "../TagsMaker/TagsMaker";

import { IValidationError } from "../../models/IValidationError";
import { LocalStorageItems } from "../../models/LocalStorageItems";
import { ContentUnitToSend } from "../../models/ContentUnit";

import { convertInputErrors } from "../../utils/ts/convertInputErrors";

import "./AddOrEditPost.scss";

interface IAddOrEditPostInputErrors {
  title?: string[];
  contentOrder?: string[];
  tags?: string[];
  // postTitle?: string[];
  // postBody?: string[];
  // postTags?: string[];
}

enum AddOrEditPostInputFields {
  postTitle = "postTitle"
}

interface IAddOrEditPostSuccessfulResponseData {
  status: string;
}

interface IAddOrEditPostFailResponseData {
  status: string;
  validationErrors?: IValidationError[];
  serverError?: { customMsg: string };
}

const AddOrEditPost: React.FC = () => {
  const signal = useMemo(() => {
    return axios.CancelToken.source();
  }, []);

  const history = useHistory();

  const jwtToken = useMemo(() => localStorage.getItem(LocalStorageItems.jwtToken), []);

  // const jwtToken = localStorage.getItem(LocalStorageItems.jwtToken);

  const [postTitle, setPostTitle] = useState("");
  const [postBody, setPostBody] = useState<ContentUnitToSend[]>([]);
  const [postTags, setPostTags] = useState<string[]>([]);
  const [inputErrors, setInputErrors] = useState<IAddOrEditPostInputErrors>({});

  const [isFetching, setIsFetching] = useState(false);
  const [isSomethingWentWrong, setIsSomethingWentWrong] = useState(false);

  const changePostTitleValue = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setPostTitle(e.target.value);
  }, []);

  const focusPostTitleInput = useCallback((): void => {
    const newErrors = cloneDeep(inputErrors);
    delete newErrors.title;
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
      const oldMsgs = clientErrors.title ? cloneDeep(clientErrors.title) : [];
      clientErrors.title = [...oldMsgs, "from 1 to 50 symbols"];
    }

    let postContent = cloneDeep(postBody);
    postContent = postContent.filter(
      (item) => !(item.type === "text" && item.content.length === 0)
    );
    if (postContent.length < 1 || postContent.length > 8) {
      const oldMsgs = clientErrors.contentOrder ? cloneDeep(clientErrors.contentOrder) : [];
      clientErrors.contentOrder = [...oldMsgs, "from 1 to 8 content units"];
    }

    if (postTags.length < 1 || postTags.length > 8) {
      const oldMsgs = clientErrors.tags ? cloneDeep(clientErrors.tags) : [];
      clientErrors.tags = [...oldMsgs, "from 1 to 8 tags"];
    }

    if (Object.keys(clientErrors).length > 0) {
      return clientErrors;
    }
  }, [postTitle, postBody, postTags]);

  const clearContentErrors = useCallback(() => {
    const newErrors = cloneDeep(inputErrors);
    delete newErrors.contentOrder;
    return setInputErrors(newErrors);
  }, [inputErrors]);

  const clearTagsErrors = useCallback(() => {
    const newErrors = cloneDeep(inputErrors);
    delete newErrors.tags;
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

      setIsFetching(true);
      axios
        .post<IAddOrEditPostSuccessfulResponseData>("/posts/create-post", postData, {
          headers: { Authorization: jwtToken },
          cancelToken: signal.token
        })
        .then((response) => {
          console.log(response);
          history.push("/");
        })
        .catch((error: AxiosError<IAddOrEditPostFailResponseData>) => {
          if (error.response) {
            console.log(error.response);
            if (error.response.data.validationErrors) {
              const inputErrors = convertInputErrors(error.response.data.validationErrors);
              setInputErrors(inputErrors);
            } else {
              setIsSomethingWentWrong(true);
            }
          }
          setIsFetching(false);
        });
    },
    [validate, postTitle, postBody, postTags, jwtToken, signal, history]
  );

  const closeSWWModal = useCallback(() => {
    setIsSomethingWentWrong(false);
  }, []);

  useEffect(() => {
    return () => {
      signal.cancel();
    };
  }, [signal]);

  if (isFetching) {
    return <Spinner />;
  }

  if (isSomethingWentWrong) {
    return (
      <SomethingWentWrong Img={SWWImg} closeSWWModal={closeSWWModal} msg={"something went wrong"} />
    );
  }

  return (
    <div className="add-or-edit-post">
      <form noValidate onSubmit={addOrEditPost}>
        <div className="add-or-edit-post__title">
          <InputGroup
            type={InputGroupType.plain}
            inputType="text"
            {...(inputErrors.title ? { errors: inputErrors.title } : {})}
            placeholder="Title"
            name={AddOrEditPostInputFields.postTitle}
            value={postTitle}
            onChange={changePostTitleValue}
            onFocus={focusPostTitleInput}
            isInitialFocused
          />
        </div>
        <div className="add-or-edit-post__content-maker" onClick={clearContentErrors}>
          <ContentMaker
            sendContentToParent={setContent}
            {...(inputErrors.contentOrder ? { errors: inputErrors.contentOrder } : {})}
          />
        </div>
        <div className="add-or-edit-post__tags-maker" onClick={clearTagsErrors}>
          <TagsMaker
            sendTagsToParent={setTags}
            {...(inputErrors.tags ? { errors: inputErrors.tags } : {})}
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
