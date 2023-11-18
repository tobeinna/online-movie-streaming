import React, { useEffect, useState } from "react";
import CategoryChip from "../../../components/Chip/CategoryChip";
import { Category, Movie } from "../../../types/movie.types";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { database } from "../../../configs/firebaseConfig";
import { toast } from "react-toastify";
import MainButton from "../../../components/Buttons/MainButton/MainButton";
import { HiOutlineSearch } from "react-icons/hi";
import MovieCard from "../../../components/MovieCard/MovieCard";

const SearchMovie: React.FC = () => {
  const [titleInput, setTitleInput] = useState<string>("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [result, setResult] = useState<Movie[]>([]);
  const [isReset, setIsReset] = useState<boolean>(false);

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
        // Perform a query to get all documents that contain at least one category from the array
        const q = query(
          collection(database, "movies"),
          where("categories", "array-contains-any", selectedCategories),
          where("search_title", ">=", lowercaseSearchTitle),
          where("search_title", "<=", lowercaseSearchTitle + "\uf8ff")
        );

        const querySnapshot = await getDocs(q);
        const allDocuments = querySnapshot.docs.map((doc) => doc.data());

        // Filter the documents on the client side to ensure the exact order of categories
        const result = allDocuments.filter((doc) => {
          const docCategories = doc.categories || [];
          const docCategoryIds = docCategories.map(
            (category: { id: string }) => category.id
          );
          const expectedCategoryIds = selectedCategories.map(
            (category) => category.id
          );

          // Check if the order and IDs match
          return (
            JSON.stringify(docCategoryIds) ===
            JSON.stringify(expectedCategoryIds)
          );
        });

        // Now result contains documents with all specified categories and matching search_title
        console.log(result);
      } else {
        const q = query(
          moviesRef,
          where("search_title", ">=", lowercaseSearchTitle),
          where("search_title", "<=", lowercaseSearchTitle + "\uf8ff"),
          orderBy("search_title")
        );

        const moviesSnapshot = await getDocs(q);

        let result: Movie[] = [];
        moviesSnapshot.forEach((doc) => {
          result.push({ ...(doc.data() as Movie), id: doc.id });
        });
        setResult(result);
      }
    } catch (error) {
      console.log(error);

      toast("Error searching for movies!", { type: "error" });
    }
  };

  useEffect(() => {
    getCategories();
    handleSearch();
  }, []);

  useEffect(() => {
    handleSearch();
  }, [isReset]);

  useEffect(() => {
    console.log(selectedCategories);
    console.log("result: ", result);
  }, [result]);

  return (
    <>
      <div className="nav-temp-overlay fixed bg-black w-full h-[70px] z-30"></div>
      <div className="w-5/6 mx-auto pt-28 flex flex-col gap-4">
        <h3 className="text-white text-center font-semibold text-xl sm:text-2xl lg:text-3xl">
          Search your movies
        </h3>
        <div className="body flex">
          <div className="filter w-1/4 flex flex-col gap-4">
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
                }}
                className="w-full"
              />
              <MainButton
                type="filled"
                text="Search"
                icon={<HiOutlineSearch />}
                onClick={handleSearch}
                className="w-full"
              />
            </div>
          </div>
          <div className="result w-11/12 grid grid-cols-3">
            {result?.map((item, index) => (
              <div className="movie-container w-fit h-fit mx-auto" key={index}>
                <MovieCard movie_data={item} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchMovie;
