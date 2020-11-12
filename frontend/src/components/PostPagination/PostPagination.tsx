import React, { useCallback, useMemo, useState } from "react";

import { FaAngleDoubleLeft, FaAngleDoubleRight, FaAngleLeft, FaAngleRight } from "react-icons/fa";

import "./PostPagination.scss";

interface IPostPaginationProps {
  currentPage: number;
  lastPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}

const PostPagination: React.FC<IPostPaginationProps> = ({
  currentPage,
  lastPage,
  setCurrentPage
}) => {
  const [firstPageNumberFromSelector, setFirstPageNumberFromSelector] = useState(1);

  const amountOfPagesToSelect = useMemo(() => {
    let amountOfPagesToSelect = 3;
    if (lastPage < amountOfPagesToSelect) {
      amountOfPagesToSelect = lastPage;
    }
    return amountOfPagesToSelect;
  }, [lastPage]);

  const pagesArray = useMemo(() => {
    let pagesArray: number[] = [];
    let pageNumber = firstPageNumberFromSelector;
    for (let index = 1; index <= amountOfPagesToSelect; index++) {
      pagesArray.push(pageNumber);
      pageNumber += 1;
    }
    return pagesArray;
  }, [firstPageNumberFromSelector, amountOfPagesToSelect]);

  const goToFirstPage = useCallback(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
      setFirstPageNumberFromSelector(1);
    }
  }, [currentPage, setCurrentPage]);

  const goToPrevPage = useCallback(() => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
      if (firstPageNumberFromSelector > 1) {
        setFirstPageNumberFromSelector((prevPage) => prevPage - 1);
      } else {
        setFirstPageNumberFromSelector(1);
      }
    }
  }, [currentPage, firstPageNumberFromSelector, setCurrentPage]);

  const goToNextPage = useCallback(() => {
    if (currentPage < lastPage) {
      setCurrentPage((prevPage) => prevPage + 1);
      if (firstPageNumberFromSelector < lastPage - (amountOfPagesToSelect - 1)) {
        setFirstPageNumberFromSelector((prevPage) => prevPage + 1);
      } else {
        setFirstPageNumberFromSelector(lastPage - (amountOfPagesToSelect - 1));
      }
    }
  }, [amountOfPagesToSelect, currentPage, firstPageNumberFromSelector, lastPage, setCurrentPage]);

  const goToLastPage = useCallback(() => {
    if (currentPage !== lastPage) {
      setCurrentPage(lastPage);
      setFirstPageNumberFromSelector(lastPage - (amountOfPagesToSelect - 1));
    }
  }, [currentPage, lastPage, amountOfPagesToSelect, setCurrentPage]);

  const setPage = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const page = parseInt(e.currentTarget.getAttribute("data-page")!, 10);
      setCurrentPage(page);
    },
    [setCurrentPage]
  );

  return (
    <div className="post-pagination">
      <div className="post-pagination__to-first-page" onClick={goToFirstPage} title="to first page">
        <FaAngleDoubleLeft />
      </div>
      <div
        className="post-pagination__to-prev-page"
        onClick={goToPrevPage}
        title="to previous page"
      >
        <FaAngleLeft />
      </div>
      <div className="post-pagination__pages">
        {pagesArray.map((page) => {
          return (
            <div
              key={page}
              className={
                "post-pagination__page" +
                (page === currentPage ? " post-pagination__page_selected" : "")
              }
              data-page={page}
              onClick={setPage}
            >
              {page}
            </div>
          );
        })}
      </div>
      <div className="post-pagination__to-next-page" onClick={goToNextPage} title="to next page">
        <FaAngleRight />
      </div>
      <div className="post-pagination__to-last-page" onClick={goToLastPage} title="to last page">
        <FaAngleDoubleRight />
      </div>
    </div>
  );
};

export default PostPagination;
