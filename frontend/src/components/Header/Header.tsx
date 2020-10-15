import React, { useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";

import { FaSearch, FaSun, FaMoon, FaSignInAlt } from "react-icons/fa";

import { ReactComponent as Logo } from "../../assets/logo/logo.svg";

import SearchForm from "../SearchForm/SearchForm";
import Switcher from "../Switcher/Switcher";
import Modal from "../Modal/Modal";
import AuthForm from "../AuthForm/AuthForm";

import { RootState } from "../../redux/store";
import * as darkThemeActions from "../../redux/actions/darkThemeActions/dartThemeActionCreators";
import * as mobileSearchFormActions from "../../redux/actions/mobileSearchFormActions/mobileSearchFormActionCreators";

import "./Header.scss";

const Header: React.FC = () => {
  const dispatch = useDispatch();

  const isDarkTheme = useSelector((state: RootState) => state.darkTheme.isDarkTheme);

  const [isOpenAuthModal, setIsOpenAuthModal] = useState(false);

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

  return (
    <header className="header">
      <div className="header__inner">
        <span className="header__logo">
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
        <span className="header__login" title="signin/login" onClick={openAuthModal}>
          <FaSignInAlt />
        </span>
        {isOpenAuthModal && (
          <Modal closeModal={closeAuthModal}>
            <AuthForm />
          </Modal>
        )}
      </div>
    </header>
  );
};

export default Header;
