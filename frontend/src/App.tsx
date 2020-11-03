import React, { useCallback, useState, useEffect } from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios, { AxiosError } from "axios";

import HomePage from "./pages/HomePage/HomePage";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import NewPost from "./pages/NewPost/NewPostPage";

import Spinner from "./components/Spinner/Spinner";
import Header from "./components/Header/Header";
import MobileSearchForm from "./components/MobileSearchForm/MobileSearchForm";
import Footer from "./components/Footer/Footer";

import { IUser } from "./models/IUser";
import { LocalStorageItems } from "./models/LocalStorageItems";

import { RootState } from "./redux/store";
import * as darkThemeActions from "./redux/actions/darkThemeActions/dartThemeActionCreators";
import * as userActions from "./redux/actions/userActions/userActionCreators";

import "./App.scss";

interface ISuccessfulCheckUserResponseData {
  status: string;
  user: IUser;
}

interface IFailCheckUserResponseData {
  status: string;
  serverError?: { customMsg: string };
}

const signal = axios.CancelToken.source();

const App: React.FC = () => {
  const dispatch = useDispatch();

  const isDarkTheme = useSelector((state: RootState) => state.darkTheme.isDarkTheme);
  const isAuth = useSelector((state: RootState) => state.user.isAuth);

  const [checkingDarkMode, setCheckingDarkMode] = useState(true);
  const [isFetching, setIsFetching] = useState(true);

  const checkDarkMode = useCallback(() => {
    const darkTheme = localStorage.getItem("isDarkTheme");
    if (darkTheme === "true") {
      dispatch(darkThemeActions.setIsDarkTheme(true));
    }
    setCheckingDarkMode(false);
  }, [dispatch]);

  const checkUser = useCallback(() => {
    const jwtToken = localStorage.getItem(LocalStorageItems.jwtToken);
    const expiryDate = localStorage.getItem(LocalStorageItems.expiryDate);
    if (!jwtToken || !expiryDate) {
      dispatch(userActions.logout());
      setIsFetching(false);
      return;
    }

    axios
      .get<ISuccessfulCheckUserResponseData>("/users/check-user", {
        cancelToken: signal.token,
        headers: { Authorization: jwtToken }
      })
      .then((response) => {
        console.log(response.data);
        dispatch(userActions.setUser(response.data.user));
        dispatch(userActions.setIsAuth(true));
      })
      .catch((error: AxiosError<IFailCheckUserResponseData>) => {
        if (error.response) {
          console.log(error.response);
        }
      })
      .finally(() => setIsFetching(false));
  }, [dispatch]);

  const setAutoLogout = useCallback(() => {
    const expiryDate = localStorage.getItem(LocalStorageItems.expiryDate);
    if (!expiryDate) {
      dispatch(userActions.logout());
      return;
    }
    const delayInms = new Date(new Date(expiryDate).getTime() - new Date().getTime()).getTime();
    console.log(`logout in ${delayInms / (3600 * 1000)} h `);
    setTimeout(() => {
      dispatch(userActions.logout());
    }, delayInms);
  }, [dispatch]);

  useEffect(() => {
    checkDarkMode();
    checkUser();
  }, [checkDarkMode, checkUser]);

  useEffect(() => {
    if (isAuth) {
      setAutoLogout();
    }
  }, [setAutoLogout, isAuth]);

  useEffect(() => {
    return () => {
      signal.cancel();
    };
  }, []);

  // ----------- dev-only ----------
  const toggleDarkTheme = useCallback(
    (e: KeyboardEvent) => {
      if (e.code === "NumpadSubtract" && e.shiftKey) {
        dispatch(darkThemeActions.toggleDarkTheme());
      }
    },
    [dispatch]
  );

  useEffect(() => {
    window.addEventListener("keydown", toggleDarkTheme);
  }, [toggleDarkTheme]);
  // --------------------------------

  if (checkingDarkMode || isFetching) {
    return <Spinner />;
  }

  return (
    <div className={"app" + (isDarkTheme ? " app_dark-mode" : "")}>
      <BrowserRouter>
        <Header />
        <MobileSearchForm />
        <div className="app__inner">
          <Switch>
            <Route exact path="/" component={HomePage} />
            <Route path="/@:nickname" component={ProfilePage} />
            {isAuth && <Route exact path="/new-post" component={NewPost} />}
            <Redirect to="/" />
          </Switch>
        </div>
        <Footer />
      </BrowserRouter>
    </div>
  );
};

export default App;
