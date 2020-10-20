import React, { useState, useCallback, useEffect } from "react";
import cloneDeep from "clone-deep";
import validator from "validator";
import axios, { AxiosError } from "axios";

import InputGroup from "../InputGroup/InputGroup";

import { InputGroupType } from "../InputGroup/InputGroup";

import { convertInputErrors } from "../../utils/ts/convertInputErrors";

import { ReactComponent as SWWImg } from "../../assets/errorImgs/client-server-error.svg";

import Spinner from "../Spinner/Spinner";
import Modal from "../Modal/Modal";
import Confirm from "../Confirm/Confirm";

import "./Register.scss";
import SomethingWentWrong from "../SomethingWentWrong/SomethingWentWrong";

enum RegisterInputFields {
  nickname = "nickname",
  email = "email",
  password = "password",
  confirmPassword = "confirmPassword"
}

interface IRegisterData {
  nickname: string;
  email: string;
  password: string;
  confirmPassword: string;
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

const signal = axios.CancelToken.source();

const Register: React.FC<IRegisterProps> = ({ setAuthModeToLogin }) => {
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
        .post("/users/register", newUserData, { cancelToken: signal.token })
        .then((response) => {
          console.log(response);
          setIsNewUserIsRegistered(true);
        })
        .catch((error: AxiosError) => {
          if (error.response) {
            console.log(error.response);
          }
          if (error.response?.status === 422) {
            const inputErrors = convertInputErrors(error.response.data.validationErrors);
            setInputErrors(inputErrors);
          }
          if (error.response?.status === 503 || error.response?.status === 500) {
            setIsSomethingWentWrong(true);
          }
        })
        .finally(() => setIsFetching(false));
    },
    [confirmPassword, email, nickname, password, validate]
  );

  const closeNewUserModal = useCallback(() => {
    setIsNewUserIsRegistered(false);
  }, []);

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

  if (isNewUserIsRegistered) {
    return (
      <Modal closeModal={closeNewUserModal}>
        <Confirm msg={"activation sent to your email"} onClick={closeNewUserModal} />
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