import React, { useCallback } from "react";

import { FaSearch } from "react-icons/fa";

import "./SearchForm.scss";

const SearchForm: React.FC = () => {
  const searchHandler = useCallback((e) => {
    e.preventDefault();
    console.log("in progress");
  }, []);

  return (
    <form className="search-form" onSubmit={searchHandler}>
      <input className="search-form__input" placeholder="Search" />
      <button type="submit" className="search-form__btn">
        <FaSearch className="search-form__icon" />
      </button>
    </form>
  );
};

export default SearchForm;
