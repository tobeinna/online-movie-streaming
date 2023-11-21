import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  DocumentData,
  and,
  collection,
  endAt,
  endBefore,
  getCountFromServer,
  getDocs,
  limit,
  limitToLast,
  or,
  orderBy,
  query,
  startAfter,
  startAt,
  where,
} from "firebase/firestore";
import { toast } from "react-toastify";
import { HiOutlineSearch } from "react-icons/hi";
import { MdNavigateNext, MdNavigateBefore } from "react-icons/md";
import { Pagination } from "antd";
import Select, { MultiValue } from "react-select";
import makeAnimated from "react-select/animated";

import MovieCard from "../../../components/MovieCard/MovieCard";
import MainButton from "../../../components/Buttons/MainButton/MainButton";
import { database } from "../../../configs/firebaseConfig";
import { Category, Movie } from "../../../types/movie.types";
import CategoryChip from "../../../components/Chip/CategoryChip";
import MovieCardSkeleton from "../../../components/Skeleton/MovieCardSkeleton";
import { useSearchParams } from "react-router-dom";

const animatedComponents = makeAnimated();

interface ISelectItem {
  value: string;
  label: string;
}

const SearchMovie: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams({
    title: "",
    categories: [],
  });
  const titleInput = searchParams.get("title");
  const selectedCategories =
    JSON.parse(searchParams.get("categories") as string) || [];

  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesSelectItem, setCategoriesSelectItem] = useState<
    ISelectItem[]
  >([]);
  const [result, setResult] = useState<Movie[]>([]);
  const [isReset, setIsReset] = useState<boolean>(false);
  const [isQuerrying, setIsQuerrying] = useState<boolean>(false);
  // Pagination states
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [previousPage, setPreviousPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(2);
  const [resultCount, setResultCount] = useState<number>(0);
  const [firstDoc, setFirstDoc] = useState<DocumentData>();
  const [lastDoc, setLastDoc] = useState<DocumentData>();

  const getCategories = async () => {
    const categoriesRef = collection(database, "categories");
    const catagoriesSnapshot = await getDocs(categoriesRef);

    try {
      let result: Category[] = [];
      catagoriesSnapshot.forEach((doc) =>
        result.push({ id: doc.id, name: doc.data().name })
      );
      setCategories(result);
    } catch (error) {
      toast("Error while get category list!", { type: "error" });
    }
  };

  const handleSearch = async () => {
    try {
      let moviesRef = collection(database, "movies");

      const lowercaseSearchTitle = titleInput?.toLowerCase().trim();
      const sortedCategories = selectedCategories?.sort(
        (a: string, b: string) => a.localeCompare(b)
      );

      let q = query(moviesRef);
      let allMoviesQuery = query(moviesRef);

      // let q = query(
      //   moviesRef,
      //   and(
      //     where("search_title", ">=", lowercaseSearchTitle),
      //     where("search_title", "<=", lowercaseSearchTitle + "\uf8ff"),
      //     sortedCategories.length > 0
      //       ? or(
      //           where("categoriesId", "array-contains", sortedCategories[0]),
      //           where("categoriesId", "==", sortedCategories)
      //         )
      //       : or()
      //   ),
      //   currentPage === 1
      //     ? (orderBy("search_title"), limit(pageSize))
      //     : currentPage > previousPage
      //     ? (orderBy("search_title"), startAfter(lastDoc), limit(pageSize))
      //     : currentPage < previousPage
      //     ? (orderBy("search_title"),
      //       limitToLast(pageSize),
      //       endBefore(firstDoc))
      //     : (orderBy("search_title"), limit(pageSize))
      // );
      // let allMoviesQuery = query(
      //   moviesRef,
      //   and(
      //     where("search_title", ">=", lowercaseSearchTitle),
      //     where("search_title", "<=", lowercaseSearchTitle + "\uf8ff"),
      //     sortedCategories.length > 0
      //       ? or(
      //           where("categoriesId", "array-contains", sortedCategories[0]),
      //           where("categoriesId", "==", sortedCategories)
      //         )
      //       : or()
      //   ),
      //   orderBy("search_title")
      // );

      // If first page
      if (currentPage === 1) {
        // If categories filter selected
        if (selectedCategories.length > 0) {
          q = query(
            moviesRef,
            and(
              where("search_title", ">=", lowercaseSearchTitle),
              where("search_title", "<=", lowercaseSearchTitle + "\uf8ff"),
              or(
                where("categoriesId", "array-contains", sortedCategories[0]),
                where("categoriesId", "==", sortedCategories)
              )
            ),
            orderBy("search_title"),
            limit(pageSize)
          );

          allMoviesQuery = query(
            moviesRef,
            and(
              where("search_title", ">=", lowercaseSearchTitle),
              where("search_title", "<=", lowercaseSearchTitle + "\uf8ff"),
              or(
                where("categoriesId", "array-contains", sortedCategories[0]),
                where("categoriesId", "==", sortedCategories)
              )
            ),
            orderBy("search_title")
          );
          // Only text filter
        } else {
          q = query(
            moviesRef,
            where("search_title", ">=", lowercaseSearchTitle),
            where("search_title", "<=", lowercaseSearchTitle + "\uf8ff"),
            orderBy("search_title"),
            limit(pageSize)
          );

          allMoviesQuery = query(
            moviesRef,
            where("search_title", ">=", lowercaseSearchTitle),
            where("search_title", "<=", lowercaseSearchTitle + "\uf8ff"),
            orderBy("search_title")
          );
        }
        // If not first page
      } else {
        // If go to next page
        if (currentPage > previousPage) {
          //If categories filter selected
          if (selectedCategories.length > 0) {
            q = query(
              moviesRef,
              and(
                where("search_title", ">=", lowercaseSearchTitle),
                where("search_title", "<=", lowercaseSearchTitle + "\uf8ff"),
                or(
                  where("categoriesId", "array-contains", sortedCategories[0]),
                  where("categoriesId", "==", sortedCategories)
                )
              ),
              orderBy("search_title"),
              startAfter(lastDoc),
              limit(pageSize)
            );

            allMoviesQuery = query(
              moviesRef,
              and(
                where("search_title", ">=", lowercaseSearchTitle),
                where("search_title", "<=", lowercaseSearchTitle + "\uf8ff"),
                or(
                  where("categoriesId", "array-contains", sortedCategories[0]),
                  where("categoriesId", "==", sortedCategories)
                )
              ),
              orderBy("search_title")
            );
            // Only text filter
          } else {
            q = query(
              moviesRef,
              where("search_title", ">=", lowercaseSearchTitle),
              where("search_title", "<=", lowercaseSearchTitle + "\uf8ff"),
              orderBy("search_title"),
              startAfter(lastDoc),
              limit(pageSize)
            );

            allMoviesQuery = query(
              moviesRef,
              where("search_title", ">=", lowercaseSearchTitle),
              where("search_title", "<=", lowercaseSearchTitle + "\uf8ff"),
              orderBy("search_title")
            );
          }
        }
        // If go to previous page
        if (currentPage < previousPage) {
          // If categories filter selected
          if (selectedCategories.length > 0) {
            q = query(
              moviesRef,
              and(
                where("search_title", ">=", lowercaseSearchTitle),
                where("search_title", "<=", lowercaseSearchTitle + "\uf8ff"),
                or(
                  where("categoriesId", "array-contains", sortedCategories[0]),
                  where("categoriesId", "==", sortedCategories)
                )
              ),
              orderBy("search_title"),
              limitToLast(pageSize),
              endBefore(firstDoc)
            );

            allMoviesQuery = query(
              moviesRef,
              and(
                where("search_title", ">=", lowercaseSearchTitle),
                where("search_title", "<=", lowercaseSearchTitle + "\uf8ff"),
                or(
                  where("categoriesId", "array-contains", sortedCategories[0]),
                  where("categoriesId", "==", sortedCategories)
                )
              ),
              orderBy("search_title")
            );
            // Only text filter
          } else {
            q = query(
              moviesRef,
              where("search_title", ">=", lowercaseSearchTitle),
              where("search_title", "<=", lowercaseSearchTitle + "\uf8ff"),
              orderBy("search_title"),
              limitToLast(pageSize),
              endBefore(firstDoc)
            );

            allMoviesQuery = query(
              moviesRef,
              where("search_title", ">=", lowercaseSearchTitle),
              where("search_title", "<=", lowercaseSearchTitle + "\uf8ff"),
              orderBy("search_title")
            );
          }
        }
      }

      // Set result count
      const count = await getCountFromServer(allMoviesQuery);
      setResultCount(count.data().count);

      const moviesSnapshot = await getDocs(q);

      if (!moviesSnapshot.empty) {
        setFirstDoc(moviesSnapshot.docs[0]);
        setLastDoc(moviesSnapshot.docs[moviesSnapshot.docs.length - 1]);

        let queryResult: Movie[] = [];
        moviesSnapshot.forEach((doc) => {
          queryResult.push({ ...(doc.data() as Movie), id: doc.id });
        });
        setResult(queryResult);
      }
      setIsQuerrying(false);
    } catch (error) {
      console.log(error);

      toast("Error searching for movies!", { type: "error" });
      setIsQuerrying(false);
    }
  };

  // useLayoutEffect(() => {
  //   handleSearch();
  // }, []);

  useEffect(() => {
    getCategories();
  }, [result]);

  useLayoutEffect(() => {
    setIsQuerrying(true);
    handleSearch();
  }, [isReset, currentPage, pageSize]);

  useLayoutEffect(() => {
    setCategoriesSelectItem([]);
  }, [isReset]);

  useLayoutEffect(() => {
    if (result) {
      const calculatedVotesResult: Movie[] = result.map((item) => {
        if (
          Array.isArray(item?.votes) &&
          (item.votes as { uid: string; voted: number }[]).length !== 0 &&
          !item.hasOwnProperty("averageVote")
        ) {
          const sum = item?.votes.reduce((accumulator, currentValue) => {
            return accumulator + Number(currentValue.voted);
          }, 0);

          return {
            ...item,
            averageVote: Number((sum / item.votes.length).toFixed(1)),
          };
        } else {
          return item;
        }
      });

      if (JSON.stringify(calculatedVotesResult) !== JSON.stringify(result)) {
        // setresult(calculatedVotesresult);
        setResult(
          calculatedVotesResult.sort((a, b) => {
            if (!a.averageVote) return 1;
            if (!b.averageVote) return -1;

            return b.averageVote - a.averageVote;
          })
        );
      }
    }
  }, [result]);

  return (
    <>
      <div className="nav-temp-overlay fixed bg-black w-full h-[70px] z-30"></div>
      <div className="w-11/12 lg:w-5/6 mx-auto pt-28 flex flex-col gap-4">
        <h3 className="text-white text-center font-semibold text-xl sm:text-2xl lg:text-3xl">
          Search your movies
        </h3>
        <div className="body flex flex-col lg:flex-row">
          <div className="filter w-full lg:w-1/4 flex flex-col gap-4">
            <div className="title-input flex flex-col gap-2">
              <span className="text-white text-lg">Enter movie's title</span>
              <input
                type="text"
                name="title"
                id="title"
                value={titleInput || ""}
                className="block px-2.5 py-2 w-full text-sm rounded-md border-2 border-[#28262D] transition-colors duration-300 focus:border-gray-300 focus:outline-none"
                placeholder="Title"
                onChange={(e) =>
                  setSearchParams(
                    (prev) => {
                      prev.set("title", e.target.value);
                      return prev;
                    },
                    { replace: true }
                  )
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setIsQuerrying(true);
                    setCurrentPage(1);
                    setPreviousPage(1);
                    handleSearch();
                  }
                }}
              />
            </div>
            <div className="category-input flex flex-col gap-2">
              <span className="text-white text-lg">
                Select movie's category
              </span>
              <div className="category-list mt-2 flex flex-wrap gap-2">
                <Select
                  closeMenuOnSelect={false}
                  components={animatedComponents}
                  isMulti
                  value={categoriesSelectItem}
                  options={categories.map((item) => {
                    return { value: item.id, label: item.name };
                  })}
                  className="w-full z-20"
                  placeholder=""
                  onChange={(newValue: MultiValue<unknown> | ISelectItem[]) => {
                    // Ensure that selectedValues is an array
                    const selectedItems = newValue as ISelectItem[];

                    setCategoriesSelectItem(selectedItems);

                    const tempCategories = (
                      newValue as { value: string; label: string }[]
                    ).map((item) => item.value);

                    setSearchParams(
                      (prev) => {
                        prev.set("categories", JSON.stringify(tempCategories));
                        return prev;
                      },
                      { replace: true }
                    );
                  }}
                />
              </div>
            </div>
            <div className="button-container flex flex-col w-11/12 gap-3 mt-2 mx-auto">
              <MainButton
                type="outlined"
                text="Reset filter"
                onClick={() => {
                  setSearchParams(
                    (prev) => {
                      prev.set("title", "");
                      prev.set("categories", JSON.stringify([]));
                      return prev;
                    },
                    { replace: true }
                  );
                  setIsReset(!isReset);
                  setCurrentPage(1);
                  setPreviousPage(1);
                  setIsQuerrying(true);
                }}
                className="w-full"
                isDisabled={isQuerrying}
              />
              <MainButton
                type="filled"
                text="Search"
                icon={<HiOutlineSearch />}
                onClick={() => {
                  setIsQuerrying(true);
                  setCurrentPage(1);
                  setPreviousPage(1);
                  handleSearch();
                }}
                className="w-full"
                isDisabled={isQuerrying}
              />
            </div>
          </div>
          <div className="w-full body-right flex flex-col">
            <span className="text-center text-lg text-white mb-2">
              Found {resultCount} movie(s)
            </span>
            <div className="result w-11/12 mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-y-6">
              {isQuerrying && result.length > 0
                ? Array.from({ length: pageSize }, (_, index) => (
                    <MovieCardSkeleton key={index} />
                  ))
                : result?.map((item) => (
                    <MovieCard
                      movie_data={item}
                      key={item.id}
                      className={"mx-auto"}
                      categories_data={categories}
                    />
                  ))}
            </div>
            {resultCount > 0 && (
              <div className="text-center w-11/12 mx-auto mt-4 flex justify-end">
                <Pagination
                  simple
                  showQuickJumper={false}
                  // hideOnSinglePage
                  disabled={isQuerrying}
                  current={currentPage}
                  defaultCurrent={1}
                  total={resultCount}
                  pageSize={pageSize}
                  pageSizeOptions={[2, 6, 12, 30]}
                  defaultPageSize={2}
                  showSizeChanger
                  onShowSizeChange={(current, size) => {
                    setPageSize(size);
                    setCurrentPage(1);
                    setPreviousPage(1);
                  }}
                  className="text-slate-500 font-semibold float-right"
                  prevIcon={
                    <MdNavigateBefore className="transition-colors duration-300 rounded-md text-slate-300 h-full w-8 mx-auto hover:text-white hover:bg-white hover:bg-opacity-20 px-1" />
                  }
                  nextIcon={
                    <MdNavigateNext className="transition-colors duration-300 rounded-md text-slate-300 h-full w-8 mx-auto hover:text-white hover:bg-white hover:bg-opacity-20 px-1" />
                  }
                  onChange={(page, size) => {
                    setPreviousPage(currentPage);
                    setCurrentPage(page);
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchMovie;
