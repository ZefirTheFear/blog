import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios, { AxiosError } from "axios";

import Spinner from "../Spinner/Spinner";
import SomethingWentWrong from "../SomethingWentWrong/SomethingWentWrong";
import { ReactComponent as SWWImg } from "../../assets/errorImgs/client-server-error.svg";

import Post from "../Post/Post";
import PostPagination from "../PostPagination/PostPagination";

import { IPost } from "../../models/IPost";
import { IValidationError } from "../../models/IValidationError";

import "./Posts.scss";

interface IPostsSuccessfulResponseData {
  status: string;
  posts: IPost[];
  lastPage: number;
}

interface IPostsFailResponseData {
  status: string;
  validationErrors?: IValidationError[];
  serverError?: { customMsg: string };
}

const Posts: React.FC = () => {
  const signal = useMemo(() => {
    return axios.CancelToken.source();
  }, []);

  const [posts, setPosts] = useState<IPost[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(0);

  const [isFetching, setIsFetching] = useState(true);
  const [isSomethingWentWrong, setIsSomethingWentWrong] = useState(false);

  const fetchPosts = useCallback(() => {
    setIsFetching(true);
    axios
      .get<IPostsSuccessfulResponseData>("/posts/get-posts", {
        headers: { Page: currentPage },
        cancelToken: signal.token
      })
      .then((response) => {
        console.log(response);
        setPosts(response.data.posts);
        setLastPage(response.data.lastPage);
      })
      .catch((error: AxiosError<IPostsFailResponseData>) => {
        if (error.response) {
          console.log(error.response);
          setIsSomethingWentWrong(true);
        }
      })
      .finally(() => setIsFetching(false));
  }, [currentPage, signal]);

  const closeSWWModal = useCallback(() => {
    setIsSomethingWentWrong(false);
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  useEffect(() => {
    return () => {
      signal.cancel();
    };
  }, [signal]);

  // if (isFetching) {
  //   return <Spinner />;
  // }

  if (isSomethingWentWrong) {
    return (
      <SomethingWentWrong Img={SWWImg} closeSWWModal={closeSWWModal} msg={"something went wrong"} />
    );
  }

  return (
    <>
      {isFetching && <Spinner />}
      <div className="posts">
        {posts.map((post) => (
          <div className="posts__post" key={post._id}>
            <Post post={post} />
          </div>
        ))}
        {lastPage > 1 && (
          <div className="posts__pagination">
            <PostPagination
              currentPage={currentPage}
              lastPage={lastPage}
              setCurrentPage={setCurrentPage}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default Posts;
