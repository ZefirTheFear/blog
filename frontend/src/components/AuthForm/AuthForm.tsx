import React, { useState, useCallback } from "react";

import Login from "../Login/Login";
import Register from "../Register/Register";
import ForgotPassword from "../ForgotPassword/ForgotPassword";

import "./AuthForm.scss";

enum AuthMode {
  login = "login",
  register = "register",
  forgotPassword = "forgotPassword"
}

const AuthForm: React.FC = () => {
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
