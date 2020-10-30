import React, { useCallback, useEffect, useRef } from "react";

import "./RTELinkInput.scss";

interface IRTELinkInputProps {
  linkUrl: string;
  setLinkUrl: (url: string) => void;
  setLink: () => void;
}

const RTELinkInput: React.FC<IRTELinkInputProps> = ({ linkUrl, setLinkUrl, setLink }) => {
  const input = useRef<HTMLInputElement>(null!);

  const onChangeLinkUrl = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setLinkUrl(e.target.value);
    },
    [setLinkUrl]
  );

  useEffect(() => {
    input.current.focus();
  }, []);

  return (
    <div className="rte-link-input">
      <input type="text" value={linkUrl} onChange={onChangeLinkUrl} ref={input} />
      <button type="button" onClick={setLink}>
        confirm
      </button>
    </div>
  );
};

export default RTELinkInput;
