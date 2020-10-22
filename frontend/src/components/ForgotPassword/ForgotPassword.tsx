import React, { useState, useCallback, useEffect } from "react";
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

import "./ForgotPassword.scss";

interface IForgotPasswordProps {
  setAuthModeToLogin: () => void;
}

enum ForgotPasswordInputFields {
  nickname = "nickname",
  email = "email"
}

interface IForgotPasswordInputErrors {
  nickname?: string[];
  email?: string[];
}

interface IForgotPasswordData {
  nickname: string;
  email: string;
}

interface IForgotPasswordSuccessfulResponseData {
  status: string;
}

interface IForgotPasswordFailResponseData {
  status: string;
  validationErrors?: IValidationError[];
  serverError?: { customMsg: string };
}
const signal = axios.CancelToken.source();

const ForgotPassword: React.FC<IForgotPasswordProps> = ({ setAuthModeToLogin }) => {
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [inputErrors, setInputErrors] = useState<IForgotPasswordInputErrors>({});

  const [isFetching, setIsFetching] = useState(false);
  const [isNewPasswordIsSet, setIsNewPasswordIsSet] = useState(false);
  const [isSomethingWentWrong, setIsSomethingWentWrong] = useState(false);

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
      const newErrors = cloneDeep(inputErrors);
      delete newErrors[e.target.name as ForgotPasswordInputFields];
      return setInputErrors(newErrors);
    },
    [inputErrors]
  );

  const validate = useCallback(() => {
    const clientErrors: IForgotPasswordInputErrors = {};

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

    if (Object.keys(clientErrors).length > 0) {
      return clientErrors;
    }
  }, [email, nickname]);

  const resetPassword = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const validationResult = validate();
      console.log(validationResult);

      if (validationResult) {
        return setInputErrors(validationResult);
      }

      const forgotPasswordData: IForgotPasswordData = {
        nickname,
        email
      };

      setIsFetching(true);
      axios
        .patch<IForgotPasswordSuccessfulResponseData>("/users/reset-password", forgotPasswordData, {
          cancelToken: signal.token
        })
        .then((response) => {
          console.log(response);
          setIsNewPasswordIsSet(true);
        })
        .catch((error: AxiosError<IForgotPasswordFailResponseData>) => {
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
    [email, nickname, validate]
  );

  const closeNewPasswordModal = useCallback(() => {
    setIsNewPasswordIsSet(false);
    setAuthModeToLogin();
  }, [setAuthModeToLogin]);

  const closeSWWModal = useCallback(() => {
    setIsSomethingWentWrong(false);
  }, []);

  useEffect(() => {
    return () => {
      signal.cancel();
    };
  }, []);

  if (isFetching) {
    return <Spinner />;
  }

  if (isNewPasswordIsSet) {
    return (
      <Modal closeModal={closeNewPasswordModal}>
        <Confirm msg={"new password sent to your email"} onClick={closeNewPasswordModal} />
      </Modal>
    );
  }

  if (isSomethingWentWrong) {
    return (
      <SomethingWentWrong Img={SWWImg} closeSWWModal={closeSWWModal} msg={"something went wrong"} />
    );
  }

  return (
    <div className="forgot-password">
      <div className="forgot-password__title">Password Recovery</div>
      <form noValidate onSubmit={resetPassword}>
        <div className="forgot-password__nickname">
          <InputGroup
            type={InputGroupType.plain}
            inputType="text"
            {...(inputErrors.nickname ? { errors: inputErrors.nickname } : {})}
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
            {...(inputErrors.email ? { errors: inputErrors.email } : {})}
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
