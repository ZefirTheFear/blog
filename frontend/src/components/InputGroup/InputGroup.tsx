import React, { useState, useCallback } from "react";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";

import "./InputGroup.scss";

export enum InputGroupType {
  plain,
  password
}

interface IInputGroup {
  type: InputGroupType;
  inputType: string;
  errors: string[];
  placeholder: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus: (e: React.FocusEvent<HTMLInputElement>) => void;
}

const InputGroup: React.FC<IInputGroup> = ({
  type,
  inputType,
  errors,
  placeholder,
  name,
  value,
  onChange,
  onFocus
}) => {
  const [isShownPassword, setIsShownPassword] = useState(false);

  const toggleIsShownPassword = useCallback(() => {
    setIsShownPassword((prevState) => !prevState);
  }, []);

  return (
    <div className="input-group">
      <div
        className={"input-group__input-group" + (errors ? " input-group__input-group_invalid" : "")}
      >
        <input
          type={type === InputGroupType.plain ? inputType : isShownPassword ? "text" : "password"}
          className="input-group__input"
          placeholder={placeholder}
          name={name}
          value={value}
          onChange={onChange}
          onFocus={onFocus}
          autoComplete="off"
        />
        {type === InputGroupType.password && (
          <div
            className="input-group__type-toggle"
            onClick={toggleIsShownPassword}
            title={isShownPassword ? "hide" : "show"}
          >
            {isShownPassword ? <IoMdEyeOff /> : <IoMdEye />}
          </div>
        )}
      </div>
      {/* {errors ? errors.map((msg) => <InvalidFeedback key={msg} msg={msg} />) : null} */}
    </div>
  );
};

export default InputGroup;
