import React from "react";
import { useSelector } from "react-redux";

import SearchForm from "../SearchForm/SearchForm";

import { RootState } from "../../redux/store";

import "./MobileSearchForm.scss";

const MobileSearchForm: React.FC = () => {
  const isMobileSearchFormOpen = useSelector((state: RootState) => state.mobileSearchForm.isOpen);

  return (
    <div
      className={"mobile-search-from" + (isMobileSearchFormOpen ? " mobile-search-from_open" : "")}
    >
      <div className="mobile-search-from__inner">
        <SearchForm />
      </div>
    </div>
  );
};

export default MobileSearchForm;
