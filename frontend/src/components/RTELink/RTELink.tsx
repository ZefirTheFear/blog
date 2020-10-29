import React from "react";
import { ContentState } from "draft-js";

import "./RTELink.scss";

interface IRTELinkProps {
  contentState: ContentState;
  entityKey: string;
}

const RTELink: React.FC<IRTELinkProps> = ({ contentState, entityKey, children }) => {
  const { url } = contentState.getEntity(entityKey).getData();

  return (
    <a href={url} title={url} className="rte-link">
      {children}
    </a>
  );
};

export default RTELink;
