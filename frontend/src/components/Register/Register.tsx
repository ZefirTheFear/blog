import React, { useState, useCallback } from "react";
import cloneDeep from "clone-deep";
import validator from "validator";

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
  nickname?: string[];
  email?: string[];
  password?: string[];
  confirmPassword?: string[];
}

interface IRegisterProps {
  setAuthModeToLogin: () => void;
}

const Register: React.FC<IRegisterProps> = ({ setAuthModeToLogin }) => {
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<IRegisterInputErrors>({});

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

  const validate = useCallback(() => {
    const clientErrors: IRegisterInputErrors = {};

    if (nickname.trim().length < 1 || nickname.trim().length > 25) {
      const oldMsgs = clientErrors.nickname ? cloneDeep(clientErrors.nickname) : [];
      clientErrors.nickname = [...oldMsgs, "from 1 to 25 symbols"];
    }

    if (!validator.isEmail(email)) {
      const oldMsgs = clientErrors.email ? cloneDeep(clientErrors.email) : [];
      clientErrors.email = [...oldMsgs, "enter valid email"];
    }

    if (password.trim().length < 5 || password.trim().length > 30) {
      const oldMsgs = clientErrors.password ? cloneDeep(clientErrors.password) : [];
      clientErrors.password = [...oldMsgs, "from 5 to 25 symbols"];
    }

    if (validator.isLowercase(password)) {
      const oldMsgs = clientErrors.password ? cloneDeep(clientErrors.password) : [];
      clientErrors.password = [...oldMsgs, "at least 1 capital symbol"];
    }

    if (confirmPassword !== password) {
      const oldMsgs = clientErrors.confirmPassword ? cloneDeep(clientErrors.confirmPassword) : [];
      clientErrors.confirmPassword = [...oldMsgs, "the password must match"];
    }

    if (Object.keys(clientErrors).length > 0) {
      console.log(clientErrors);
      return clientErrors;
    }
  }, [nickname, email, password, confirmPassword]);

  const registerUser = useCallback(
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
    <div className="register">
      <div className="register__title">Register</div>
      <form noValidate onSubmit={registerUser}>
        <div className="register__nickname">
          <InputGroup
            type={InputGroupType.plain}
            inputType="text"
            {...(errors.nickname ? { errors: errors.nickname } : {})}
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
            {...(errors.email ? { errors: errors.email } : {})}
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
            {...(errors.password ? { errors: errors.password } : {})}
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
            {...(errors.confirmPassword ? { errors: errors.confirmPassword } : {})}
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
