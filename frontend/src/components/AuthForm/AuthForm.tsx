import React, { useState, useCallback } from "react";

import Login from "../Login/Login";
import Register from "../Register/Register";
import ForgotPassword from "../ForgotPassword/ForgotPassword";

import "./AuthForm.scss";

interface IAuthFromProps {
  closeAuthModal: () => void;
}

enum AuthMode {
  login = "login",
  register = "register",
  forgotPassword = "forgotPassword"
}

const AuthForm: React.FC<IAuthFromProps> = ({ closeAuthModal }) => {
  const [authMode, setAuthMode] = useState<AuthMode>(AuthMode.login);

  const setAuthModeToRegister = useCallback(() => {
    return setAuthMode(AuthMode.register);
  }, []);
  const setAuthModeToLogin = useCallback(() => {
    return setAuthMode(AuthMode.login);
  }, []);
  const setAuthModeToForgotPassword = useCallback(() => {
    return setAuthMode(AuthMode.forgotPassword);
  }, []);

  return (
    <div className="auth-form">
      {authMode === AuthMode.login ? (
        <Login
          setAuthModeToRegister={setAuthModeToRegister}
          setAuthModeToForgotPassword={setAuthModeToForgotPassword}
          closeAuthModal={closeAuthModal}
        />
      ) : authMode === AuthMode.register ? (
        <Register setAuthModeToLogin={setAuthModeToLogin} />
      ) : (
        <ForgotPassword setAuthModeToLogin={setAuthModeToLogin} />
      )}
    </div>
  );
};

export default AuthForm;
