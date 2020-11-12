import React from "react";
import { Link } from "react-router-dom";
import { v4 as uuid } from "uuid";

import { IPost } from "../../models/IPost";
import timeFormatter from "../../utils/ts/timeFormatter";
import PostContentTxt from "../PostContentTxt/PostContentTxt";

import "./Post.scss";

interface IPostProps {
  post: IPost;
}

const Post: React.FC<IPostProps> = ({ post }) => {
  return (
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
      </div>
    </article>
  );
};

export default Post;
