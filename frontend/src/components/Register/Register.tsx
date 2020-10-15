import React, { useState, useCallback } from "react";
import cloneDeep from "clone-deep";

import InputGroup from "../InputGroup/InputGroup";

import { InputGroupType } from "../InputGroup/InputGroup";

import "./Register.scss";

enum RegisterInputFields {
  nickname = "nickname",
  email = "email",
  password = "password",
  confirmPassword = "confirmPassword"
}

interface IRegisterInputErrors {
  nickname: string[];
  email: string[];
  password: string[];
  confirmPassword: string[];
}

interface IRegisterProps {
  setAuthModeToLogin: () => void;
}

const Register: React.FC<IRegisterProps> = ({ setAuthModeToLogin }) => {
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<IRegisterInputErrors>({
    nickname: [],
    email: [],
    password: [],
    confirmPassword: []
  });

  const changeInputValue = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === RegisterInputFields.nickname) {
      return setNickname(e.target.value);
    }
    if (e.target.name === RegisterInputFields.email) {
      return setEmail(e.target.value);
    }
    if (e.target.name === RegisterInputFields.password) {
      return setPassword(e.target.value);
    }
    if (e.target.name === RegisterInputFields.confirmPassword) {
      return setConfirmPassword(e.target.value);
    }
  }, []);

  const focusInput = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      const newErrors = cloneDeep(errors);
      delete newErrors[e.target.name as RegisterInputFields];
      return setErrors(newErrors);
    },
    [errors]
  );

  const registerUser = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("in progress");
  }, []);

  return (
    <div className="register">
      <div className="register__title">Register</div>
      <form noValidate onSubmit={registerUser}>
        <div className="register__nickname">
          <InputGroup
            type={InputGroupType.plain}
            inputType="text"
            errors={errors.nickname}
            placeholder="nickname"
            name={RegisterInputFields.nickname}
            value={nickname}
            onChange={changeInputValue}
            onFocus={focusInput}
          />
        </div>
        <div className="register__email">
          <InputGroup
            type={InputGroupType.plain}
            inputType="email"
            errors={errors.email}
            placeholder="email"
            name={RegisterInputFields.email}
            value={email}
            onChange={changeInputValue}
            onFocus={focusInput}
          />
        </div>
        <div className="register__password">
          <InputGroup
            type={InputGroupType.password}
            inputType="password"
            errors={errors.password}
            placeholder="password"
            name={RegisterInputFields.password}
            value={password}
            onChange={changeInputValue}
            onFocus={focusInput}
          />
        </div>
        <div className="register__confirm-password">
          <InputGroup
            type={InputGroupType.password}
            inputType="password"
            errors={errors.confirmPassword}
            placeholder="confirm password"
            name="confirmPassword"
            value={confirmPassword}
            onChange={changeInputValue}
            onFocus={focusInput}
          />
        </div>
        <button type="submit" className="register__submit-button">
          Register User
        </button>
      </form>
      <div className="register__login" onClick={setAuthModeToLogin}>
        Login
      </div>
    </div>
  );
};

export default Register;
