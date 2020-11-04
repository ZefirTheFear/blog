import React, { useRef, useState, useCallback } from "react";
import cloneDeep from "clone-deep";

import InputGroup, { InputGroupType } from "../InputGroup/InputGroup";
import { ICoordinates } from "../ContentRichTextEditor/ContentRichTextEditor";

import "./RTELinkInput.scss";
import RTELinkModal from "../RTELinkModal/RTELinkModal";
import validator from "validator";

interface IRTELinkInputProps {
  isSelection: boolean;
  setLink: (isFromSelection: boolean, url: string, text: string) => void;
  closeLinkInput: () => void;
  coordinates: ICoordinates;
}

enum RTELinkInputFields {
  text = "text",
  url = "url"
}

interface IRTELinkInputErrors {
  text?: string[];
  url?: string[];
}

const RTELinkInput: React.FC<IRTELinkInputProps> = ({
  isSelection,
  setLink,
  closeLinkInput,
  coordinates
}) => {
  const inputBlock = useRef<HTMLDivElement>(null!);

  const [text, setText] = useState("");
  const [url, setUrl] = useState("");
  const [inputErrors, setInputErrors] = useState<IRTELinkInputErrors>({});

  const changeInputValue = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === RTELinkInputFields.text) {
      return setText(e.target.value);
    }
    if (e.target.name === RTELinkInputFields.url) {
      return setUrl(e.target.value);
    }
  }, []);

  const focusInput = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      const newErrors = cloneDeep(inputErrors);
      delete newErrors[e.target.name as RTELinkInputFields];
      return setInputErrors(newErrors);
    },
    [inputErrors]
  );

  const validate = useCallback(() => {
    const clientErrors: IRTELinkInputErrors = {};

    if (!isSelection) {
      if (text.trim().length < 1 || text.trim().length > 40) {
        const oldMsgs = clientErrors.text ? cloneDeep(clientErrors.text) : [];
        clientErrors.text = [...oldMsgs, "from 1 to 40 symbols"];
      }
    }

    if (!validator.isURL(url, { protocols: ["http", "https"], require_protocol: true })) {
      const oldMsgs = clientErrors.url ? cloneDeep(clientErrors.url) : [];
      clientErrors.url = [...oldMsgs, "enter valid url"];
    }

    if (Object.keys(clientErrors).length > 0) {
      return clientErrors;
    }
  }, [isSelection, text, url]);

  const setLinkUrl = useCallback(() => {
    const validationResult = validate();
    if (validationResult) {
      return setInputErrors(validationResult);
    }
    setLink(isSelection, url, text);
  }, [isSelection, setLink, text, url, validate]);

  const checkInputBlockOnBlur = useCallback(
    (e: MouseEvent) => {
      let element = e.target as HTMLElement;
      while (element !== document.body) {
        if (element === inputBlock.current) {
          return;
        }
        element = element.parentElement!;
      }
      closeLinkInput();
    },
    [closeLinkInput]
  );

  return (
    <RTELinkModal coordinates={coordinates} checkModalOnBlur={checkInputBlockOnBlur}>
      <div className="rte-link-input" ref={inputBlock}>
        {!isSelection && (
          <div className="rte-link-input__text">
            <InputGroup
              type={InputGroupType.plain}
              inputType="text"
              {...(inputErrors.text ? { errors: inputErrors.text } : {})}
              placeholder="Text"
              name={RTELinkInputFields.text}
              value={text}
              onChange={changeInputValue}
              onFocus={focusInput}
              isInitialFocused
            />
          </div>
        )}
        <div className="rte-link-input__url">
          <InputGroup
            type={InputGroupType.plain}
            inputType="url"
            {...(inputErrors.url ? { errors: inputErrors.url } : {})}
            placeholder="Url"
            name={RTELinkInputFields.url}
            value={url}
            onChange={changeInputValue}
            onFocus={focusInput}
            isInitialFocused={isSelection}
          />
        </div>
        <button className="rte-link-input__btn" type="button" onClick={setLinkUrl}>
          Insert
        </button>
      </div>
    </RTELinkModal>
  );
};

export default RTELinkInput;
