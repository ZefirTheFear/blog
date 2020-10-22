import React, { useMemo, useState, useCallback, useEffect } from "react";
import cloneDeep from "clone-deep";
import validator from "validator";
import axios, { AxiosError } from "axios";

import InputGroup from "../InputGroup/InputGroup";
import Spinner from "../Spinner/Spinner";
import Modal from "../Modal/Modal";
import Confirm from "../Confirm/Confirm";
import SomethingWentWrong from "../SomethingWentWrong/SomethingWentWrong";
import { ReactComponent as SWWImg } from "../../assets/errorImgs/client-server-error.svg";

import { InputGroupType } from "../InputGroup/InputGroup";
import { IValidationError } from "../../models/IValidationError";

import { convertInputErrors } from "../../utils/ts/convertInputErrors";

import "./Register.scss";

interface IRegisterProps {
  setAuthModeToLogin: () => void;
}

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

interface IRegisterData {
  nickname: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface IRegisterSuccessfulResponseData {
  status: string;
}

interface IRegisterFailResponseData {
  status: string;
  validationErrors?: IValidationError[];
  serverError?: { customMsg: string };
}

const Register: React.FC<IRegisterProps> = ({ setAuthModeToLogin }) => {
  const signal = useMemo(() => {
    return axios.CancelToken.source();
  }, []);

  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [inputErrors, setInputErrors] = useState<IRegisterInputErrors>({});

  const [isFetching, setIsFetching] = useState(false);
  const [isNewUserIsRegistered, setIsNewUserIsRegistered] = useState(false);
  const [isSomethingWentWrong, setIsSomethingWentWrong] = useState(false);

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
      const newErrors = cloneDeep(inputErrors);
      delete newErrors[e.target.name as RegisterInputFields];
      return setInputErrors(newErrors);
    },
    [inputErrors]
  );

  const validate = useCallback(() => {
    const clientErrors: IRegisterInputErrors = {};

    if (nickname.trim().length < 1 || nickname.trim().length > 40) {
      const oldMsgs = clientErrors.nickname ? cloneDeep(clientErrors.nickname) : [];
      clientErrors.nickname = [...oldMsgs, "from 1 to 40 symbols"];
    }

    if (email.trim().length < 5 || email.trim().length > 50) {
      const oldMsgs = clientErrors.email ? cloneDeep(clientErrors.email) : [];
      clientErrors.email = [...oldMsgs, "from 5 to 50 chars"];
    }

    if (!validator.isEmail(email)) {
      const oldMsgs = clientErrors.email ? cloneDeep(clientErrors.email) : [];
      clientErrors.email = [...oldMsgs, "enter valid email"];
    }

    if (password.trim().length < 5 || password.trim().length > 40) {
      const oldMsgs = clientErrors.password ? cloneDeep(clientErrors.password) : [];
      clientErrors.password = [...oldMsgs, "from 5 to 40 symbols"];
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
      return clientErrors;
    }
  }, [nickname, email, password, confirmPassword]);

  const registerUser = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const validationResult = validate();
      console.log(validationResult);

      if (validationResult) {
        return setInputErrors(validationResult);
      }

      const newUserData: IRegisterData = {
        nickname,
        email,
        password,
        confirmPassword
      };

      setIsFetching(true);
      axios
        .post<IRegisterSuccessfulResponseData>("/users/register", newUserData, {
          cancelToken: signal.token
        })
        .then((response) => {
          console.log(response);
          setIsNewUserIsRegistered(true);
        })
        .catch((error: AxiosError<IRegisterFailResponseData>) => {
          if (error.response) {
            console.log(error.response);
            if (error.response.data.validationErrors) {
              const inputErrors = convertInputErrors(error.response.data.validationErrors!);
              setInputErrors(inputErrors);
            } else {
              setIsSomethingWentWrong(true);
            }
          }
        })
        .finally(() => setIsFetching(false));
    },
    [confirmPassword, email, nickname, password, signal, validate]
  );

  const closeNewUserModal = useCallback(() => {
    setIsNewUserIsRegistered(false);
    setAuthModeToLogin();
  }, [setAuthModeToLogin]);

  const closeSWWModal = useCallback(() => {
    setIsSomethingWentWrong(false);
  }, []);

  useEffect(() => {
    return () => {
      signal.cancel();
    };
  }, [signal]);

  if (isFetching) {
    return <Spinner />;
  }

  if (isNewUserIsRegistered) {
    return (
      <Modal closeModal={closeNewUserModal}>
        <Confirm
          msg={"activation sent to your email. \n activate your profile before login"}
          onClick={closeNewUserModal}
        />
      </Modal>
    );
  }

  if (isSomethingWentWrong) {
    return (
      <SomethingWentWrong Img={SWWImg} closeSWWModal={closeSWWModal} msg={"something went wrong"} />
    );
  }

  return (
    <div className="register">
      <div className="register__title">Register</div>
      <form noValidate onSubmit={registerUser}>
        <div className="register__nickname">
          <InputGroup
            type={InputGroupType.plain}
            inputType="text"
            {...(inputErrors.nickname ? { errors: inputErrors.nickname } : {})}
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
            {...(inputErrors.email ? { errors: inputErrors.email } : {})}
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
            {...(inputErrors.password ? { errors: inputErrors.password } : {})}
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
            {...(inputErrors.confirmPassword ? { errors: inputErrors.confirmPassword } : {})}
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
