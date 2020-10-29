import React, { useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

import {
  FaSearch,
  FaSun,
  FaMoon,
  FaSignInAlt,
  FaSignOutAlt,
  FaUser,
  FaPencilAlt
} from "react-icons/fa";

import { ReactComponent as Logo } from "../../assets/logo/logo.svg";

import SearchForm from "../SearchForm/SearchForm";
import Switcher from "../Switcher/Switcher";
import Modal from "../Modal/Modal";
import AuthForm from "../AuthForm/AuthForm";

import { RootState } from "../../redux/store";
import * as darkThemeActions from "../../redux/actions/darkThemeActions/dartThemeActionCreators";
import * as mobileSearchFormActions from "../../redux/actions/mobileSearchFormActions/mobileSearchFormActionCreators";
import * as userActions from "../../redux/actions/userActions/userActionCreators";

import "./Header.scss";

const Header: React.FC = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const isDarkTheme = useSelector((state: RootState) => state.darkTheme.isDarkTheme);
  const isAuth = useSelector((state: RootState) => state.user.isAuth);
  const user = useSelector((state: RootState) => state.user.user);

  const [isOpenAuthModal, setIsOpenAuthModal] = useState(false);
  const [isOpenUserOptions, setIsOpenUserOptions] = useState(false);

  const goToHomePage = useCallback(() => {
    history.push("/");
    setIsOpenUserOptions(false);
  }, [history]);

  const toggleDarkMode = useCallback(() => {
    dispatch(darkThemeActions.toggleDarkTheme());
  }, [dispatch]);

  const toggleMobileSearchForm = useCallback(() => {
    dispatch(mobileSearchFormActions.toggleMobileSearchForm());
  }, [dispatch]);

  const openAuthModal = useCallback(() => {
    setIsOpenAuthModal(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setIsOpenAuthModal(false);
  }, []);

  const toggleUserOptions = useCallback(() => {
    setIsOpenUserOptions((prevState) => !prevState);
  }, []);

  const goToNewPostPage = useCallback(() => {
    history.push("/new-post");
    setIsOpenUserOptions(false);
  }, [history]);

  const logout = useCallback(() => {
    dispatch(userActions.logout());
    setIsOpenUserOptions(false);
  }, [dispatch]);

  return (
    <header className={"header" + (isDarkTheme ? " header_dark-mode" : "")}>
      <div className="header__inner">
        <span className="header__logo" onClick={goToHomePage}>
          <Logo />
        </span>
        <div className="header__mobile-controls">
          <span className="header__search-form">
            <SearchForm />
          </span>
          <span className="header__mobile-search" onClick={toggleMobileSearchForm}>
            <FaSearch />
          </span>
          <div className="header__dark-mode-toggler">
            <span className={"header__sun" + (!isDarkTheme ? " header__sun_active" : "")}>
              <FaSun />
            </span>
            <span className="header__switcher">
              <Switcher isActive={isDarkTheme} onClick={toggleDarkMode} />
            </span>
            <span className={"header__moon" + (isDarkTheme ? " header__moon_active" : "")}>
              <FaMoon />
            </span>
          </div>
        </div>
        {isAuth ? (
          <div className="header__user">
            <div className="header__user-img" onClick={toggleUserOptions}>
              <img src={user?.avatar.url} alt="avatar" />
            </div>
            {isOpenUserOptions && (
              <div className="header__user-options">
                <div title="create post" onClick={goToNewPostPage}>
                  <FaPencilAlt />
                </div>
                <div>
                  <FaUser />
                </div>
                <div onClick={logout} title="logout">
                  <FaSignOutAlt />
                </div>
              </div>
            )}
          </div>
        ) : (
          <span className="header__login" title="signin/login" onClick={openAuthModal}>
            <FaSignInAlt />
          </span>
        )}
        {isOpenAuthModal && (
          <Modal closeModal={closeAuthModal}>
            <AuthForm closeAuthModal={closeAuthModal} />
          </Modal>
        )}
      </div>
    </header>
  );
};

export default Header;
