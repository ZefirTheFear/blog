import React, { useCallback, useState } from "react";

import "./RTELinkInput.scss";

interface IRTELinkInputProps {
  linkUrl: string;
}

const RTELinkInput: React.FC<IRTELinkInputProps> = ({ linkUrl }) => {
  const [url, setUrl] = useState(linkUrl);

  const setLinkUrl = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
  }, []);

  return (
    <div className="rte-link-input">
      <input type="text" value={url} onChange={setLinkUrl} />
    </div>
  );
};

export default RTELinkInput;
