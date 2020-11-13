import React, { useCallback, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { v4 as uuid } from "uuid";
import axios, { AxiosError } from "axios";
import { useSelector } from "react-redux";

import { FaEdit, FaTrashAlt } from "react-icons/fa";

import Spinner from "../Spinner/Spinner";
import SomethingWentWrong from "../SomethingWentWrong/SomethingWentWrong";
import { ReactComponent as SWWImg } from "../../assets/errorImgs/client-server-error.svg";

import { IPost } from "../../models/IPost";
import { LocalStorageItems } from "../../models/LocalStorageItems";

import timeFormatter from "../../utils/ts/timeFormatter";
import PostContentTxt from "../PostContentTxt/PostContentTxt";

import { RootState } from "../../redux/store";

import "./Post.scss";

interface IPostProps {
  post: IPost;
  deletePost: (postId: string) => void;
}

interface IPostSuccessfulResponseData {
  status: string;
}

interface IPostFailResponseData {
  status: string;
  serverError?: { customMsg: string };
}

const Post: React.FC<IPostProps> = ({ post, deletePost }) => {
  const signalForDelete = useMemo(() => {
    return axios.CancelToken.source();
  }, []);

  const userId = useSelector((state: RootState) => state.user.user?._id);

  const jwtToken = useMemo(() => localStorage.getItem(LocalStorageItems.jwtToken), []);

  const [isFetching, setIsFetching] = useState(false);
  const [isSomethingWentWrong, setIsSomethingWentWrong] = useState(false);

  const deletePostHandler = useCallback(() => {
    setIsFetching(true);
    axios
      .delete<IPostSuccessfulResponseData>(`/posts/delete-post/${post._id}`, {
        headers: { Authorization: jwtToken },
        cancelToken: signalForDelete.token
      })
      .then((response) => {
        console.log(response);
        setIsFetching(false);
        deletePost(post._id);
      })
      .catch((error: AxiosError<IPostFailResponseData>) => {
        if (error.response) {
          console.log(error.response);
          setIsSomethingWentWrong(true);
          setIsFetching(false);
        }
      });
  }, [deletePost, jwtToken, post, signalForDelete]);

  const closeSWWModal = useCallback(() => {
    setIsSomethingWentWrong(false);
  }, []);

  return (
    <>
      {isFetching && <Spinner />}
      {isSomethingWentWrong && (
        <SomethingWentWrong
          Img={SWWImg}
          closeSWWModal={closeSWWModal}
          msg={"something went wrong"}
        />
      )}
      <article className="post">
        <div className="post__main">
          <h3>{post.title}</h3>
          <div className="post__tags">
            {post.tags.map((tag) => (
              <Link className="post__tag" key={tag} to={`/search/${tag}`}>
                {tag}
              </Link>
            ))}
          </div>
          <div className="post__content">
            {post.body.map((item) => {
              if (item.type === "text") {
                return (
                  <div className="post__content-txt" key={uuid()}>
                    <PostContentTxt content={item.content} />
                  </div>
                );
              } else if (item.type === "image") {
                return (
                  <div className="post__content-img" key={uuid()}>
                    <img src={item.url} alt="img" />
                  </div>
                );
              } else {
                return null;
              }
            })}
          </div>
        </div>
        <div className="post__footer">
          <div className="post__creator-avatar">
            <img src={post.creator.avatar.url} alt="avatar" />
          </div>
          <Link className="post__creator-nickname" to={`/@${post.creator.nickname}`}>
            {post.creator.nickname}
          </Link>
          <time className="post__created">{timeFormatter(new Date(post.createdAt))}</time>
          {userId === post.creator._id && (
            <div className="post__options">
              <div className="post__edit" title="edit">
                <FaEdit />
              </div>
              <div className="post__delete" title="delete" onClick={deletePostHandler}>
                <FaTrashAlt />
              </div>
            </div>
          )}
        </div>
      </article>
    </>
  );
};

export default Post;
