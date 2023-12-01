import { Button, Popconfirm, Table, Tooltip } from "antd";
import Search from "antd/es/input/Search";
import { ColumnType } from "antd/es/table";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { IoIosAddCircle } from "react-icons/io";
import { toast } from "react-toastify";
import { MdDelete, MdEdit, MdRefresh } from "react-icons/md";
import { FaEye, FaEyeSlash } from "react-icons/fa";

import { Category, Movie } from "../../types/movie.types";
import EditMovieModal from "../../components/Modal/EditMovieModal";
import {
  minutesToHoursAndMinutes,
  timestampToDate,
} from "../../utils/timeUtils";
import { database } from "../../configs/firebaseConfig";
import AddMovieModal from "../../components/Modal/AddMovieModal";

const ManageMovies = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchInput, setSearchInput] = useState<string>("");
  const [tableData, setTableData] = useState<Movie[]>([]);
  const [isLoadingTable, setIsLoadingTable] = useState<boolean>(false);
  const [isLoadingSearchInput, setIsLoadingSearchInput] =
    useState<boolean>(false);
  const [isDisplayEditModal, setIsDisplayEditModal] = useState<boolean>(false);
  const [isDisplayAddModal, setIsDisplayAddModal] = useState<boolean>(false);
  const [editedMovie, setEditedMovie] = useState<Movie | undefined>();

  const getMoviesData = async () => {
    try {
      const moviesRef = collection(database, "movies");
      const moviesSnapshot = await getDocs(moviesRef);

      if (!moviesSnapshot.empty) {
        const result: Movie[] = [];
        moviesSnapshot.forEach((doc) => {
          result.push({ ...doc.data(), id: doc.id } as Movie);
        });

        const movies = result.map((movie: Movie) => {
          if (
            movie?.categoriesId &&
            movie?.categoriesId?.length > 0 &&
            categories.length > 0
          ) {
            const movieCategories = movie?.categoriesId?.map((id) =>
              categories.find((category) => category.id === id)
            ) as Category[];

            if (movieCategories.length > 0) {
              return {
                ...movie,
                categoriesSelectItem: movieCategories.map((item) => {
                  return { value: item.id, label: item.name };
                }),
              };
            }
          }
        }) as Movie[];

        setTableData(movies);
      } else {
        setTableData([]);
      }
      setIsLoadingTable(false);
    } catch (error) {
      toast.error(`${error}`);
      setIsLoadingTable(false);
    }
  };

  const searchMovies = async (input: string) => {
    try {
      const moviesRef = collection(database, "movies");
      const q = query(
        moviesRef,
        where("search_title", ">=", input.toLowerCase()),
        where("search_title", "<=", input.toLowerCase() + "\uf8ff"),
        orderBy("search_title")
      );
      const moviesSnapshot = await getDocs(q);
      if (!moviesSnapshot.empty) {
        const result: Movie[] = [];
        moviesSnapshot.forEach((doc) => {
          result.push({ ...doc.data(), id: doc.id } as Movie);
        });
        setTableData(result);
      } else {
        setTableData([]);
      }
      setIsLoadingTable(false);
      setIsLoadingSearchInput(false);
    } catch (error) {
      toast.error(`${error}`);
      // console.log(error);

      setIsLoadingTable(false);
      setIsLoadingSearchInput(false);
    }
  };

  const changeMovieStatus = async (record: Movie, newStatusValue: boolean) => {
    setIsLoadingTable(true);
    const movieRef = doc(database, `movies/${record.id}`);
    try {
      await setDoc(movieRef, {
        categoriesId: record.categoriesId,
        description: record.description,
        duration: record.duration,
        poster: record.poster,
        release_date: record.release_date,
        search_title: record.search_title,
        title: record.title,
        video: record.video,
        votes: record.votes,
        status: newStatusValue,
      });

      toast.success("Movie's status changed successfully!");
    } catch (error) {
      toast.error(`${error}`);
    }
    getMoviesData();
  };

  const deleteMovie = async (movieId: string) => {
    setIsLoadingTable(true);
    const movieRef = doc(database, `movies/${movieId}`);
    try {
      await deleteDoc(movieRef);

      toast.success("Movie deleted successfully!");
    } catch (error) {
      toast.error(`${error}`);
    }
    getMoviesData();
  };

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

  useEffect(() => {
    getCategories();
  }, []);

  useEffect(() => {
    if (categories) {
      setIsLoadingTable(true);
      getMoviesData();
    }
  }, [categories]);

  useEffect(() => {
    if (!isDisplayEditModal || !isDisplayAddModal) {
      setEditedMovie(undefined);
      setIsLoadingTable(true);
      getMoviesData();
    }
  }, [isDisplayEditModal, isDisplayAddModal]);

  const tableColumns: ColumnType<Movie>[] = [
    {
      title: "",
      dataIndex: "id",
      key: "id",
      width: 100,
      align: "center" as AlignSetting,
      render: (_: any, __: any, index) => {
        ++index;
        return index;
      },
    },
    {
      title: "Title",
      dataIndex: "title",
      width: 200,
      sorter: (a: Movie, b: Movie) => a?.title.localeCompare(b?.title),
    },
    {
      title: "Poster",
      dataIndex: "poster",
      width: 150,
      align: "center" as AlignSetting,
      render: (_: any, record: Movie) => (
        <img
          className={`poster mx-auto rounded-md`}
          src={record?.poster || ""}
        />
      ),
    },
    {
      title: "Duration",
      dataIndex: "duration",
      width: 100,
      align: "center" as AlignSetting,
      sorter: (a: Movie, b: Movie) => a?.duration - b?.duration,
      render: (_: any, record: Movie) => (
        <span>{minutesToHoursAndMinutes(record?.duration || 0)}</span>
      ),
    },
    {
      title: "Release date",
      dataIndex: "release_date",
      width: 120,
      align: "center" as AlignSetting,
      sorter: (a: Movie, b: Movie) =>
        a?.release_date?.seconds - b?.release_date?.seconds,
      render: (_: any, record: Movie) => (
        <span>{timestampToDate(record?.release_date?.seconds)}</span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      width: 100,
      align: "center" as AlignSetting,
      sorter: (a: Movie, b: Movie) =>
        String(a?.status).localeCompare(String(b?.status)),
      render: (status: boolean) => (
        <>
          {status ? (
            <span className="text-green-600 font-semibold">Active</span>
          ) : (
            <span className="text-gray-600 font-semibold">Inactive</span>
          )}
        </>
      ),
    },
    {
      title: "Action",
      align: "center" as AlignSetting,
      render: (_: any, record: Movie) => (
        <div className="flex gap-2 justify-center">
          <Tooltip trigger={"hover"} title="Edit movie's info">
            <Button
              type="text"
              icon={<MdEdit />}
              onClick={() => {
                setEditedMovie(record);
                setIsDisplayEditModal(true);
              }}
            />
          </Tooltip>
          {record?.status ? (
            <Tooltip title="Hide movie">
              <Popconfirm
                title="Hide movie"
                description={`Are you sure to change this movie's status to "Inactive"?`}
                onConfirm={() => changeMovieStatus(record, false)}
                okText="Yes"
                cancelText="No"
                okButtonProps={{ type: "default" }}
              >
                <Button
                  type="text"
                  icon={<FaEyeSlash className="text-gray-600" />}
                />
              </Popconfirm>
            </Tooltip>
          ) : (
            <Tooltip title="Show movie">
              <Popconfirm
                title="Show movie"
                description={`Are you sure to change this movie's status to "Active"?`}
                onConfirm={() => changeMovieStatus(record, true)}
                okText="Yes"
                cancelText="No"
                okButtonProps={{ type: "default" }}
              >
                <Button
                  type="text"
                  icon={<FaEye className="text-green-600" />}
                />
              </Popconfirm>
            </Tooltip>
          )}
          <Tooltip title="Delete movie">
            <Popconfirm
              title="Delete movie"
              description={`Are you sure to delete this movie?`}
              onConfirm={() => deleteMovie(record?.id)}
              okText="Yes"
              cancelText="No"
              okButtonProps={{ type: "default" }}
            >
              <Button
                type="text"
                icon={<MdDelete className="text-red-600" />}
              />
            </Popconfirm>
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <div className="bg-stone-100 m-4 pt-4 shadow-sm h-full">
      <div className="content mx-auto mt-4 w-11/12 flex flex-col gap-4">
        <h1 className="text-2xl font-semibold">Manage movies</h1>
        <div className="flex justify-between">
          <Search
            placeholder="Enter movie's title..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onSearch={() => {
              setIsLoadingTable(true);
              setIsLoadingSearchInput(true);
              searchMovies(searchInput);
            }}
            loading={isLoadingSearchInput}
            className="w-1/3"
          />
          <div className="flex gap-2">
            <Button
              type="default"
              size="large"
              icon={<MdRefresh />}
              onClick={() => {
                setIsLoadingTable(true);
                setSearchInput("");
                getMoviesData();
              }}
            />
            <Button
              type="default"
              icon={<IoIosAddCircle />}
              size="large"
              onClick={() => setIsDisplayAddModal(true)}
            >
              Add movie
            </Button>
          </div>
        </div>
      </div>
      {tableData && (
        <Table
          columns={tableData ? tableColumns : []}
          dataSource={tableData}
          scroll={{ y: 420 }}
          rowKey={(record) => record?.id}
          loading={isLoadingTable}
          pagination={false}
          className="w-11/12 mx-auto mt-4"
        />
      )}
      <EditMovieModal
        open={isDisplayEditModal}
        setOpen={setIsDisplayEditModal}
        record={editedMovie}
        key={"key"}
      />
      <AddMovieModal open={isDisplayAddModal} setOpen={setIsDisplayAddModal} />
    </div>
  );
};

export default ManageMovies;
