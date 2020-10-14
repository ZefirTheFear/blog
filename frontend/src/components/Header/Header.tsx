import React, { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";

import { FaSun } from "react-icons/fa";
import { FaMoon } from "react-icons/fa";

import Switcher from "../Switcher/Switcher";

import { RootState } from "../../redux/store";
import * as darkThemeActions from "../../redux/actions/darkThemeActions/dartThemeActionCreators";

import "./Header.scss";

const Header: React.FC = () => {
  const dispatch = useDispatch();

  const isDarkTheme = useSelector((state: RootState) => state.darkTheme.isDarkTheme);

  const toggleDarkMode = useCallback(() => {
    dispatch(darkThemeActions.toggleDarkTheme());
  }, [dispatch]);

  return (
    <header className="header">
      <div className="header__inner">
        <span>Logo </span>
        <span>Search </span>
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
        <span>profile </span>
      </div>
    </header>
  );
};

export default Header;
