import React, { useMemo, useState, useCallback, useEffect } from "react";
import cloneDeep from "clone-deep";
import validator from "validator";
import axios, { AxiosError } from "axios";
import { useDispatch } from "react-redux";

import InputGroup from "../InputGroup/InputGroup";
import Spinner from "../Spinner/Spinner";
import SomethingWentWrong from "../SomethingWentWrong/SomethingWentWrong";
import { ReactComponent as SWWImg } from "../../assets/errorImgs/client-server-error.svg";

import { InputGroupType } from "../InputGroup/InputGroup";

import { IUser } from "../../models/IUser";
import { IValidationError } from "../../models/IValidationError";
import { convertInputErrors } from "../../utils/ts/convertInputErrors";
import { LocalStorageItems } from "../../models/LocalStorageItems";

import * as userActions from "../../redux/actions/userActions/userActionCreators";

import "./Login.scss";

interface ILoginProps {
  setAuthModeToRegister: () => void;
  setAuthModeToForgotPassword: () => void;
  closeAuthModal: () => void;
}

enum LoginInputFields {
  nickname = "nickname",
  password = "password"
}

interface ILoginInputErrors {
  nickname?: string[];
  password?: string[];
}

interface ILoginData {
  nickname: string;
  password: string;
}

interface ILoginSuccessfulResponseData {
  status: string;
  jwtToken: string;
  user: IUser;
  expiresInMs: number;
}

interface ILoginFailResponseData {
  status: string;
  serverError?: { customMsg: string };
  validationErrors?: IValidationError[];
}

const Login: React.FC<ILoginProps> = ({
  setAuthModeToRegister,
  setAuthModeToForgotPassword,
  closeAuthModal
}) => {
  const signal = useMemo(() => {
    return axios.CancelToken.source();
  }, []);

  const dispatch = useDispatch();

  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [inputErrors, setInputErrors] = useState<ILoginInputErrors>({});

  const [isFetching, setIsFetching] = useState(false);
  const [isSomethingWentWrong, setIsSomethingWentWrong] = useState(false);

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
      const newErrors = cloneDeep(inputErrors);
      delete newErrors[e.target.name as LoginInputFields];
      return setInputErrors(newErrors);
    },
    [inputErrors]
  );

  const validate = useCallback(() => {
    const clientErrors: ILoginInputErrors = {};

    if (nickname.trim().length < 1 || nickname.trim().length > 40) {
      const oldMsgs = clientErrors.nickname ? cloneDeep(clientErrors.nickname) : [];
      clientErrors.nickname = [...oldMsgs, "from 1 to 40 symbols"];
    }

    if (password.trim().length < 5 || password.trim().length > 40) {
      const oldMsgs = clientErrors.password ? cloneDeep(clientErrors.password) : [];
      clientErrors.password = [...oldMsgs, "from 5 to 40 symbols"];
    }

    if (validator.isLowercase(password)) {
      const oldMsgs = clientErrors.password ? cloneDeep(clientErrors.password) : [];
      clientErrors.password = [...oldMsgs, "at least 1 capital symbol"];
    }

    if (Object.keys(clientErrors).length > 0) {
      return clientErrors;
    }
  }, [nickname, password]);

  const loginHandler = useCallback(
    (data: ILoginSuccessfulResponseData) => {
      localStorage.setItem(LocalStorageItems.jwtToken, data.jwtToken);
      const remainingMilliseconds = data.expiresInMs;
      const expiryDate = new Date(new Date().getTime() + remainingMilliseconds);
      localStorage.setItem(LocalStorageItems.expiryDate, expiryDate.toString());
      dispatch(userActions.setUser(data.user));
      dispatch(userActions.setIsAuth(true));
    },
    [dispatch]
  );

  const logIn = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const validationResult = validate();
      console.log(validationResult);

      if (validationResult) {
        return setInputErrors(validationResult);
      }

      const userData: ILoginData = {
        nickname,
        password
      };

      setIsFetching(true);
      axios
        .post<ILoginSuccessfulResponseData>("/users/login", userData, {
          cancelToken: signal.token
        })
        .then((response) => {
          console.log(response.data);
          loginHandler(response.data);
          closeAuthModal();
        })
        .catch((error: AxiosError<ILoginFailResponseData>) => {
          if (error.response) {
            console.log(error.response);
            if (error.response.data.validationErrors) {
              const inputErrors = convertInputErrors(error.response.data.validationErrors);
              setInputErrors(inputErrors);
            } else {
              setIsSomethingWentWrong(true);
            }
          }
          setIsFetching(false);
        });
    },
    [closeAuthModal, loginHandler, nickname, password, signal, validate]
  );

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

  if (isSomethingWentWrong) {
    return (
      <SomethingWentWrong Img={SWWImg} closeSWWModal={closeSWWModal} msg={"something went wrong"} />
    );
  }

  return (
    <div className="login">
      <div className="login__title">Login</div>
      <form noValidate onSubmit={logIn}>
        <div className="login__nickname">
          <InputGroup
            type={InputGroupType.plain}
            inputType="text"
            {...(inputErrors.nickname ? { errors: inputErrors.nickname } : {})}
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
            {...(inputErrors.password ? { errors: inputErrors.password } : {})}
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
