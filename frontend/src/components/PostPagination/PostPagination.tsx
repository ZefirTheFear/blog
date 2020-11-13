import React, { useCallback, useEffect, useMemo, useState } from "react";

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
  const [isDisabledGoToFirstPage, setIsDisabledGoToFirstPage] = useState(true);
  const [isDisabledGoToPrevPage, setIsDisabledGoToPrevPage] = useState(true);
  const [isDisabledGoToNextPage, setIsDisabledGoToNextPage] = useState(false);
  const [isDisabledGoToLastPage, setIsDisabledGoToLastPage] = useState(false);

  const checkDisabledButtons = useCallback(() => {
    if (currentPage === 1) {
      setIsDisabledGoToFirstPage(true);
      setIsDisabledGoToPrevPage(true);
    } else {
      setIsDisabledGoToFirstPage(false);
      setIsDisabledGoToPrevPage(false);
    }
    if (currentPage === lastPage) {
      setIsDisabledGoToNextPage(true);
      setIsDisabledGoToLastPage(true);
    } else {
      setIsDisabledGoToNextPage(false);
      setIsDisabledGoToLastPage(false);
    }
  }, [currentPage, lastPage]);

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
      setTimeout(() => {
        setFirstPageNumberFromSelector(1);
      });
    }
  }, [currentPage, setCurrentPage]);

  const goToPrevPage = useCallback(() => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
      if (firstPageNumberFromSelector > 1) {
        setTimeout(() => {
          setFirstPageNumberFromSelector((prevPage) => prevPage - 1);
        });
      } else {
        setTimeout(() => {
          setFirstPageNumberFromSelector(1);
        });
      }
    }
  }, [currentPage, firstPageNumberFromSelector, setCurrentPage]);

  const goToNextPage = useCallback(() => {
    if (currentPage < lastPage) {
      setCurrentPage((prevPage) => prevPage + 1);
      if (firstPageNumberFromSelector < lastPage - (amountOfPagesToSelect - 1)) {
        setTimeout(() => {
          setFirstPageNumberFromSelector((prevPage) => prevPage + 1);
        });
      } else {
        setTimeout(() => {
          setFirstPageNumberFromSelector(lastPage - (amountOfPagesToSelect - 1));
        });
      }
    }
  }, [amountOfPagesToSelect, currentPage, firstPageNumberFromSelector, lastPage, setCurrentPage]);

  const goToLastPage = useCallback(() => {
    if (currentPage !== lastPage) {
      setCurrentPage(lastPage);
      setTimeout(() => {
        setFirstPageNumberFromSelector(lastPage - (amountOfPagesToSelect - 1));
      });
    }
  }, [currentPage, lastPage, amountOfPagesToSelect, setCurrentPage]);

  const setPage = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const page = parseInt(e.currentTarget.getAttribute("data-page")!, 10);
      setCurrentPage(page);
    },
    [setCurrentPage]
  );

  useEffect(() => {
    checkDisabledButtons();
  }, [checkDisabledButtons]);

  return (
    <div className="post-pagination">
      <div
        className={
          "post-pagination__to-first-page" +
          (isDisabledGoToFirstPage ? " post-pagination__to-first-page_disabled" : "")
        }
        onClick={goToFirstPage}
        title="to first page"
      >
        <FaAngleDoubleLeft />
      </div>
      <div
        className={
          "post-pagination__to-prev-page" +
          (isDisabledGoToPrevPage ? " post-pagination__to-prev-page_disabled" : "")
        }
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
      <div
        className={
          "post-pagination__to-next-page" +
          (isDisabledGoToNextPage ? " post-pagination__to-next-page_disabled" : "")
        }
        onClick={goToNextPage}
        title="to next page"
      >
        <FaAngleRight />
      </div>
      <div
        className={
          "post-pagination__to-last-page" +
          (isDisabledGoToLastPage ? " post-pagination__to-last-page_disabled" : "")
        }
        onClick={goToLastPage}
        title="to last page"
      >
        <FaAngleDoubleRight />
      </div>
    </div>
  );
};

export default PostPagination;
