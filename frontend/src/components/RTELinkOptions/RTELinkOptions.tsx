import React, { useCallback, useState, useRef } from "react";
import validator from "validator";

import InputGroup, { InputGroupType } from "../InputGroup/InputGroup";
import RTELinkModal from "../RTELinkModal/RTELinkModal";

import { ICoordinates } from "../ContentRichTextEditor/ContentRichTextEditor";

import "./RTELinkOptions.scss";

interface IRTELinkOptionsProps {
  linkUrl: string;
  changeLinkUrl: (url: string) => void;
  removeLink: () => void;
  closeLinkOptions: () => void;
  coordinates: ICoordinates;
  editorWrapper: React.MutableRefObject<HTMLDivElement>;
}

const RTELinkOptions: React.FC<IRTELinkOptionsProps> = ({
  linkUrl,
  changeLinkUrl,
  removeLink,
  closeLinkOptions,
  coordinates,
  editorWrapper
}) => {
  const inputOptions = useRef<HTMLDivElement>(null!);

  const [isShowOptions, setIsShowOptions] = useState(true);
  const [newLinkUrl, setNewLinkUrl] = useState(linkUrl);
  const [inputErrors, setInputErrors] = useState<string[]>([]);

  const openChangeInput = useCallback(() => {
    setIsShowOptions(false);
  }, []);

  const focusInput = useCallback(() => {
    setInputErrors([]);
  }, []);

  const changeNewLinkUrl = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setNewLinkUrl(e.target.value);
  }, []);

  const validate = useCallback(() => {
    let clientErrors: string[] = [];

    if (!validator.isURL(newLinkUrl, { protocols: ["http", "https"], require_protocol: true })) {
      const oldMsgs = clientErrors.length > 0 ? clientErrors : [];
      clientErrors = [...oldMsgs, "enter valid url"];
    }

    if (Object.keys(clientErrors).length > 0) {
      return clientErrors;
    }
  }, [newLinkUrl]);

  const applyNewLinkUrl = useCallback(() => {
    const validationResult = validate();
    if (validationResult) {
      return setInputErrors(validationResult);
    }
    changeLinkUrl(newLinkUrl);
    setIsShowOptions(true);
  }, [changeLinkUrl, newLinkUrl, validate]);

  const checkLinkOptionsOnBlur = useCallback(
    (e: MouseEvent) => {
      let element = e.target as HTMLElement;
      while (element !== document.body) {
        if (element === inputOptions.current || element === editorWrapper.current) {
          return;
        }
        element = element.parentElement!;
      }
      closeLinkOptions();
    },
    [closeLinkOptions, editorWrapper]
  );

  return (
    <RTELinkModal coordinates={coordinates} checkModalOnBlur={checkLinkOptionsOnBlur}>
      <div className="rte-link-options" ref={inputOptions}>
        {isShowOptions ? (
          <div className="rte-link-options__controls">
            <span className="rte-link-options__link">{linkUrl}</span>
            <span>&nbsp;-&nbsp;</span>
            <span className="rte-link-options__option" onClick={openChangeInput}>
              Change
            </span>
            <span className="rte-link-options__devider" />
            <span className="rte-link-options__option" onClick={removeLink}>
              Remove
            </span>
          </div>
        ) : (
          <>
            <div className="rte-link-options__input">
              <InputGroup
                type={InputGroupType.plain}
                inputType="url"
                {...(inputErrors.length > 0 ? { errors: inputErrors } : {})}
                placeholder="Url"
                name="url"
                value={newLinkUrl}
                onChange={changeNewLinkUrl}
                onFocus={focusInput}
                isInitialFocused
              />
            </div>
            <button className="rte-link-options__btn" type="button" onClick={applyNewLinkUrl}>
              apply
            </button>
          </>
        )}
      </div>
    </RTELinkModal>
  );
};

export default RTELinkOptions;
