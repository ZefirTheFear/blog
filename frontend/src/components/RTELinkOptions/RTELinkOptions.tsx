import React, { useCallback, useState } from "react";

import "./RTELinkOptions.scss";

interface IRTELinkOptionsProps {
  linkUrl: string;
  changeLinkUrl: (url: string) => void;
  removeLink: () => void;
}

const RTELinkOptions: React.FC<IRTELinkOptionsProps> = ({ linkUrl, changeLinkUrl, removeLink }) => {
  const [isShowOptions, setIsShowOptions] = useState(true);
  const [newLinkUrl, setNewLinkUrl] = useState(linkUrl);

  const openChangeInput = useCallback(() => {
    setIsShowOptions(false);
  }, []);

  const changeNewLinkUrl = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setNewLinkUrl(e.target.value);
  }, []);

  const applyNewLinkUrl = useCallback(() => {
    changeLinkUrl(newLinkUrl);
    setIsShowOptions(true);
  }, [changeLinkUrl, newLinkUrl]);

  if (isShowOptions) {
    return (
      <div className="rte-link-options">
        <span>{linkUrl} - </span>
        <span onClick={openChangeInput}>Change</span>
        <span onClick={removeLink}>Remove</span>
      </div>
    );
  }
  return (
    <div>
      <input type="text" value={newLinkUrl} onChange={changeNewLinkUrl} />
      <button type="button" onClick={applyNewLinkUrl}>
        apply
      </button>
    </div>
  );
};

export default RTELinkOptions;
