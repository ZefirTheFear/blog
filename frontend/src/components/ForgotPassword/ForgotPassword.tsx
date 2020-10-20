import React, { useState, useCallback } from "react";
import cloneDeep from "clone-deep";
import validator from "validator";

import InputGroup from "../InputGroup/InputGroup";

import { InputGroupType } from "../InputGroup/InputGroup";

import "./ForgotPassword.scss";

enum ForgotPasswordInputFields {
  nickname = "nickname",
  email = "email"
}

interface IForgotPasswordInputErrors {
  nickname?: string[];
  email?: string[];
}

interface IForgotPasswordProps {
  setAuthModeToLogin: () => void;
}

const ForgotPassword: React.FC<IForgotPasswordProps> = ({ setAuthModeToLogin }) => {
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<IForgotPasswordInputErrors>({});

  const changeInputValue = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === ForgotPasswordInputFields.nickname) {
      return setNickname(e.target.value);
    }
    if (e.target.name === ForgotPasswordInputFields.email) {
      return setEmail(e.target.value);
    }
  }, []);

  const focusInput = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      const newErrors = cloneDeep(errors);
      delete newErrors[e.target.name as ForgotPasswordInputFields];
      return setErrors(newErrors);
    },
    [errors]
  );

  const validate = useCallback(() => {
    const clientErrors: IForgotPasswordInputErrors = {};

    if (nickname.trim().length < 1 || nickname.trim().length > 25) {
      const oldMsgs = clientErrors.nickname ? cloneDeep(clientErrors.nickname) : [];
      clientErrors.nickname = [...oldMsgs, "from 1 to 25 symbols"];
    }

    if (!validator.isEmail(email)) {
      const oldMsgs = clientErrors.email ? cloneDeep(clientErrors.email) : [];
      clientErrors.email = [...oldMsgs, "enter valid email"];
    }

    if (Object.keys(clientErrors).length > 0) {
      return clientErrors;
    }
  }, [email, nickname]);

  const resetPassword = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      console.log("in progress");

      const validationResult = validate();
      console.log(validationResult);

      if (validationResult) {
        return setErrors(validationResult);
      }
    },
    [validate]
  );

  return (
    <div className="forgot-password">
      <div className="forgot-password__title">Password Recovery</div>
      <form noValidate onSubmit={resetPassword}>
        <div className="forgot-password__nickname">
          <InputGroup
            type={InputGroupType.plain}
            inputType="text"
            {...(errors.nickname ? { errors: errors.nickname } : {})}
            placeholder="nickname"
            name={ForgotPasswordInputFields.nickname}
            value={nickname}
            onChange={changeInputValue}
            onFocus={focusInput}
          />
        </div>
        <div className="forgot-password__email">
          <InputGroup
            type={InputGroupType.plain}
            inputType="email"
            {...(errors.email ? { errors: errors.email } : {})}
            placeholder="email"
            name={ForgotPasswordInputFields.email}
            value={email}
            onChange={changeInputValue}
            onFocus={focusInput}
          />
        </div>
        <button type="submit" className="forgot-password__submit-button">
          Get new password
        </button>
      </form>
      <div className="forgot-password__login" onClick={setAuthModeToLogin}>
        Login
      </div>
    </div>
  );
};

export default ForgotPassword;
