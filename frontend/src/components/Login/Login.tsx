import React, { useState, useCallback } from "react";
import cloneDeep from "clone-deep";

import InputGroup from "../InputGroup/InputGroup";

import { InputGroupType } from "../InputGroup/InputGroup";

import "./Login.scss";

enum LoginInputFields {
  nickname = "nickname",
  password = "password"
}

interface ILoginInputErrors {
  nickname?: string[];
  password?: string[];
}

interface ILoginProps {
  setAuthModeToRegister: () => void;
  setAuthModeToForgotPassword: () => void;
}

const Login: React.FC<ILoginProps> = ({ setAuthModeToRegister, setAuthModeToForgotPassword }) => {
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<ILoginInputErrors>({});

  const changeInputValue = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === LoginInputFields.nickname) {
      return setNickname(e.target.value);
    }
    if (e.target.name === LoginInputFields.password) {
      return setPassword(e.target.value);
    }
  }, []);

  const focusInput = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      const newErrors = cloneDeep(errors);
      delete newErrors[e.target.name as LoginInputFields];
      return setErrors(newErrors);
    },
    [errors]
  );

  const validate = useCallback(() => {
    const clientErrors: ILoginInputErrors = {};

    if (nickname.trim().length < 1 || nickname.trim().length > 25) {
      const oldMsgs = clientErrors.nickname ? cloneDeep(clientErrors.nickname) : [];
      clientErrors.nickname = [...oldMsgs, "from 1 to 25 symbols"];
    }

    if (password.trim().length < 5 || password.trim().length > 30) {
      const oldMsgs = clientErrors.password ? cloneDeep(clientErrors.password) : [];
      clientErrors.password = [...oldMsgs, "from 5 to 25 symbols"];
    }

    if (Object.keys(clientErrors).length > 0) {
      return clientErrors;
    }
  }, [nickname, password]);

  const logIn = useCallback(
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
    <div className="login">
      <div className="login__title">Login</div>
      <form noValidate onSubmit={logIn}>
        <div className="login__nickname">
          <InputGroup
            type={InputGroupType.plain}
            inputType="text"
            {...(errors.nickname ? { errors: errors.nickname } : {})}
            name={LoginInputFields.nickname}
            placeholder="nickname"
            value={nickname}
            onChange={changeInputValue}
            onFocus={focusInput}
          />
        </div>
        <div className="login__password">
          <InputGroup
            type={InputGroupType.password}
            inputType="password"
            {...(errors.password ? { errors: errors.password } : {})}
            name={LoginInputFields.password}
            placeholder="password"
            value={password}
            onChange={changeInputValue}
            onFocus={focusInput}
          />
        </div>
        <button type="submit" className="login__submit-button">
          Login
        </button>
      </form>
      <div className="login__forgot" onClick={setAuthModeToForgotPassword}>
        I Forgot password
      </div>
      <div className="login__register" onClick={setAuthModeToRegister}>
        Register
      </div>
    </div>
  );
};

export default Login;
