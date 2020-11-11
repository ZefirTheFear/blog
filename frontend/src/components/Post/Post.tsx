import React from "react";
import { Link } from "react-router-dom";

import { IPost } from "../../models/IPost";
import timeFormatter from "../../utils/ts/timeFormatter";

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
        <div>post content</div>
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
