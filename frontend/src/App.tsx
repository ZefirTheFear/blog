import React, { useCallback, useState, useEffect } from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";

import { RootState } from "./redux/store";
import * as darkThemeActions from "./redux/actions/darkThemeActions/dartThemeActionCreators";

import "./App.scss";

const App: React.FC = () => {
  const dispatch = useDispatch();

  const isDarkTheme = useSelector((state: RootState) => state.darkTheme.isDarkTheme);

  const [checkingDarkMode, setCheckingDarkMode] = useState(true);

  const checkDarkMode = useCallback(() => {
    const darkTheme = localStorage.getItem("isDarkTheme");
    if (darkTheme === "true") {
      dispatch(darkThemeActions.setIsDarkTheme(true));
    }
    setCheckingDarkMode(false);
  }, [dispatch]);

  useEffect(() => {
    checkDarkMode();
    return () => {};
  }, [checkDarkMode]);

  if (checkingDarkMode) {
    return <div>Loading...</div>;
  }

  return (
    <div className={"app" + (isDarkTheme ? " app_dark-mode" : "")}>
      <BrowserRouter>
        <Header />
        <div className="app__inner">
          <Switch>
            <Redirect to="/" />
          </Switch>
        </div>
        <Footer />
      </BrowserRouter>
    </div>
  );
};

export default App;
