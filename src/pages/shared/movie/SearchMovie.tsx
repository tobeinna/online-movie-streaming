import React, { useEffect, useState } from "react";
import CategoryChip from "../../../components/Chip/CategoryChip";
import { Category, Movie } from "../../../types/movie.types";
import { collection, getCountFromServer, getDocs, limit, orderBy, query, where } from "firebase/firestore";
import { database } from "../../../configs/firebaseConfig";
import { toast } from "react-toastify";
import MainButton from "../../../components/Buttons/MainButton/MainButton";
import { HiOutlineSearch } from "react-icons/hi";
import { MdNavigateNext, MdNavigateBefore } from "react-icons/md";
import MovieCard from "../../../components/MovieCard/MovieCard";
import { Pagination } from "antd";

const SearchMovie: React.FC = () => {
  const [titleInput, setTitleInput] = useState<string>("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [result, setResult] = useState<Movie[]>([]);
  const [isReset, setIsReset] = useState<boolean>(false);
  const [isQuerrying, setIsQuerrying] = useState<boolean>(false);
  // Pagination states
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [previousPage, setPreviousPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(2);
  const [resultCount, setResultCount] = useState<number>(0);

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

      const lowercaseSearchTitle = titleInput.toLowerCase().trim();

      if (selectedCategories.length > 0) {
        const sortedCategories = selectedCategories.sort((a, b) =>
          a.id.localeCompare(b.id)
        );

        const queries = sortedCategories.map((category) =>
          query(
            collection(database, "movies"),
            where("categories", "array-contains", category),
            where("search_title", ">=", lowercaseSearchTitle),
            where("search_title", "<=", lowercaseSearchTitle + "\uf8ff"),
          )
        );

        // Perform all queries concurrently
        const querySnapshots = await Promise.all(queries.map(getDocs));

        // Get the documents from each query
        const documentsArray = querySnapshots.map((querySnapshot) =>
          querySnapshot.docs.map((doc) => doc.data())
        );

        // Now filter documentsArray to find documents containing all categories in the correct order
        const result = documentsArray.reduce((accumulator, current) =>
          accumulator.filter((doc) => {
            const docCategories =
              (doc as { categories?: { id: string; name: string }[] })
                .categories || [];
            const categoryIds = sortedCategories.map((category) => category.id);
            const docCategoryIds = docCategories.map((category) => category.id);

            return (
              docCategoryIds.length === categoryIds.length &&
              docCategoryIds.every((id, index) => id === categoryIds[index])
            );
          })
        ) as Movie[];

        // Now result contains documents with all specified categories in the correct order
        setResult(result);
        setIsQuerrying(false);
      } else {
        const q = query(
          moviesRef,
          where("search_title", ">=", lowercaseSearchTitle),
          where("search_title", "<=", lowercaseSearchTitle + "\uf8ff"),
          orderBy("search_title"),
          // limit(pageSize)
        );

        const allMoviesQuery = query(
          moviesRef,
          where("search_title", ">=", lowercaseSearchTitle),
          where("search_title", "<=", lowercaseSearchTitle + "\uf8ff"),
          orderBy("search_title"),
        );
        const count = await getCountFromServer(allMoviesQuery)
        setResultCount(count.data().count);
        

        const moviesSnapshot = await getDocs(q);

        let result: Movie[] = [];
        moviesSnapshot.forEach((doc) => {
          result.push({ ...(doc.data() as Movie), id: doc.id });
        });
        setResult(result);
        setIsQuerrying(false);
      }
    } catch (error) {
      toast("Error searching for movies!", { type: "error" });
      setIsQuerrying(false);
    }
  };

  useEffect(() => {
    getCategories();
    handleSearch();
  }, []);

  useEffect(() => {
    setIsQuerrying(true);
    handleSearch();
  }, [isReset, currentPage, pageSize]);

  useEffect(() => {
    console.log(selectedCategories);
    console.log("result: ", result);
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
                value={titleInput}
                onChange={(e) => setTitleInput(e.target.value)}
              />
            </div>
            <div className="category-input flex flex-col gap-2">
              <span className="text-white text-lg">
                Select movie's category
              </span>
              <div className="category-list mt-2 flex flex-wrap gap-2">
                {categories?.map((item, index) => (
                  <CategoryChip
                    key={index}
                    category={item.name}
                    isSelected={
                      selectedCategories.find(
                        (selectedItem) => selectedItem.id === item.id
                      ) !== undefined
                    }
                    onClick={() => {
                      if (
                        selectedCategories.find(
                          (selectedItem) => selectedItem.id === item.id
                        ) === undefined
                      ) {
                        setSelectedCategories([...selectedCategories, item]);
                      } else {
                        let filtered = selectedCategories.filter(
                          (selectedItem) => selectedItem.id !== item.id
                        );
                        setSelectedCategories(filtered);
                      }
                    }}
                  />
                ))}
              </div>
            </div>
            <div className="button-container flex flex-col w-11/12 gap-3 mt-2 mx-auto">
              <MainButton
                type="outlined"
                text="Reset filter"
                onClick={() => {
                  setTitleInput("");
                  setSelectedCategories([]);
                  setIsReset(!isReset);
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
                  handleSearch();
                }}
                className="w-full"
                isDisabled={isQuerrying}
              />
            </div>
          </div>
          <div className="w-full body-right flex flex-col mt-6">
            <span className="text-center text-lg text-white mb-4">
              Found {resultCount} movie(s)
            </span>
            <div className="result w-11/12 mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-y-6">
              {result?.map((item, index) => (
                <div
                  className="movie-container w-fit h-fit mx-auto"
                  key={index}
                >
                  <MovieCard movie_data={item} />
                </div>
              ))}
            </div>
            <div className="text-center w-11/12 mx-auto mt-4 flex justify-end">
              <Pagination
                // simple
                // hideOnSinglePage
                disabled={isQuerrying}
                current={currentPage}
                defaultCurrent={1}
                pageSize={pageSize}
                total={resultCount}
                className="text-slate-500 font-semibold float-right"
                prevIcon={
                  <MdNavigateBefore className="transition-colors duration-300 rounded-md text-slate-300 h-full w-8 mx-auto hover:text-white hover:bg-white hover:bg-opacity-20 px-1" />
                }
                nextIcon={
                  <MdNavigateNext className="transition-colors duration-300 rounded-md text-slate-300 h-full w-8 mx-auto hover:text-white hover:bg-white hover:bg-opacity-20 px-1" />
                }
                onChange={(page, size) => {
                  setPreviousPage(currentPage)
                  setCurrentPage(page);
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchMovie;
