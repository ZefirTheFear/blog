import React, { useRef, useState, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import cloneDeep from "clone-deep";

import InputGroup, { InputGroupType } from "../InputGroup/InputGroup";
import { ICoordinates } from "../ContentRichTextEditor/ContentRichTextEditor";

import "./RTELinkInput.scss";

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
  const tooltipTriangle = useRef<HTMLDivElement>(null!);
  const inputBlock = useRef<HTMLDivElement>(null!);

  const [text, setText] = useState("");
  const [url, setUrl] = useState("");
  const [inputErrors, setInputErrors] = useState<IRTELinkInputErrors>({});

  const [isMounted, setIsMounted] = useState(false);

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

  const setLinkUrl = useCallback(() => {
    // TODO validation
    setLink(isSelection, url, text);
  }, [isSelection, setLink, text, url]);

  const setPosition = useCallback(() => {
    tooltipTriangle.current.style.top = coordinates.top + "px";
    tooltipTriangle.current.style.left = coordinates.left + "px";
    tooltipTriangle.current.style.display = "block";

    const clientWidth = document.documentElement.clientWidth;
    const inputBlockoffsetWidth = parseInt(getComputedStyle(inputBlock.current).width);
    if (clientWidth / inputBlockoffsetWidth < 1.5) {
      inputBlock.current.style.left = (clientWidth - inputBlockoffsetWidth) / 2 + "px";
    } else if (coordinates.left < clientWidth / 2) {
      inputBlock.current.style.left = coordinates.left - 32 + "px";
    } else {
      inputBlock.current.style.left = coordinates.left - inputBlockoffsetWidth + 32 + "px";
    }
    inputBlock.current.style.top = coordinates.top + "px";
    inputBlock.current.style.display = "block";
  }, [coordinates]);

  const checkInputBlockOnBlur = useCallback(
    (e: MouseEvent) => {
      let node = e.target as HTMLElement;
      while (node !== document.body) {
        if (node === inputBlock.current) {
          return;
        }
        node = node.parentElement!;
      }
      closeLinkInput();
    },
    [closeLinkInput]
  );

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    window.addEventListener("click", checkInputBlockOnBlur);
    return () => {
      window.removeEventListener("click", checkInputBlockOnBlur);
    };
  }, [checkInputBlockOnBlur]);

  useEffect(() => {
    if (!isMounted) {
      setPosition();
    }
  }, [isMounted, setPosition]);

  return createPortal(
    <div className="rte-link-input">
      <div className="rte-link-input__triangle" ref={tooltipTriangle} />
      <div className="rte-link-input__input-block" ref={inputBlock}>
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
    </div>,
    document.body
  );
};

export default RTELinkInput;
