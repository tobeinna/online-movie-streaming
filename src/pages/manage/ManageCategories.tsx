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
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { MdDelete, MdEdit, MdRefresh } from "react-icons/md";
import { IoIosAddCircle } from "react-icons/io";

import { database } from "../../configs/firebaseConfig";
import { Category, Movie } from "../../types/movie.types";
import EditCategoryModal from "../../components/Modal/EditCategoryModal";
import AddCategoryModal from "../../components/Modal/AddCategoryModal";
import { SortOrder } from "antd/es/table/interface";

const ManageCategories = () => {
  const [searchInput, setSearchInput] = useState<string>("");
  const [tableData, setTableData] = useState<Category[]>([]);
  const [isLoadingTable, setIsLoadingTable] = useState<boolean>(false);
  const [isLoadingSearchInput, setIsLoadingSearchInput] =
    useState<boolean>(false);
  const [isDisplayEditModal, setIsDisplayEditModal] = useState<boolean>(false);
  const [isDisplayAddModal, setIsDisplayAddModal] = useState<boolean>(false);
  const [editedCategory, setEditedCategory] = useState<Category | undefined>();

  const getCategoriesData = async () => {
    try {
      const categoriesRef = collection(database, "categories");
      const categoriesSnapshot = await getDocs(categoriesRef);

      if (!categoriesSnapshot.empty) {
        const result: Category[] = [];
        categoriesSnapshot.forEach((doc) => {
          result.push({ ...doc.data(), id: doc.id } as Category);
        });
        setTableData(result);
      } else {
        setTableData([]);
      }
      setIsLoadingTable(false);
    } catch (error) {
      toast.error(`${error}`);
      setIsLoadingTable(false);
    }
  };

  const searchCategories = async (input: string) => {
    try {
      const categoriesRef = collection(database, "users");
      const q = query(
        categoriesRef,
        where("name", ">=", input.toLowerCase()),
        where("name", "<=", input.toLowerCase() + "\uf8ff"),
        orderBy("name")
      );

      const categoriesSnapshot = await getDocs(q);
      if (!categoriesSnapshot.empty) {
        const resultData: Category[] = [];

        setTableData(resultData);
      } else {
        setTableData([]);
      }
      setIsLoadingTable(false);
      setIsLoadingSearchInput(false);
    } catch (error) {
      toast.error(`${error}`);
      console.log(error);

      setIsLoadingTable(false);
      setIsLoadingSearchInput(false);
    }
  };

  const deleteCategory = async (categoryId: string) => {
    setIsLoadingTable(true);
    const moviesRef = collection(database, "movies");
    const moviesSnapshot = await getDocs(moviesRef);
    let movies: Movie[] = [];
    if (!moviesSnapshot.empty) {
      moviesSnapshot.forEach((doc) => {
        if (doc.data().categoriesId.find((id: string) => id === categoryId)) {
          movies.push({ ...doc.data(), id: doc.id } as Movie);
        }
      });
    }

    if (!movies.length) {
      const categoryRef = doc(database, `categories/${categoryId}`);

      try {
        await deleteDoc(categoryRef);

        toast.success("Category deleted successfully!");
      } catch (error) {
        toast.error(`${error}`);
      }
      getCategoriesData();
    } else {
      toast.error(`Deleted category cannot belongs to any movie.`, {
        autoClose: 4000,
      });
    }
    setIsLoadingTable(false);
  };

  useEffect(() => {
    setIsLoadingTable(true);
    getCategoriesData();
  }, []);

  useEffect(() => {
    if (!isDisplayEditModal || !isDisplayAddModal) {
      setEditedCategory(undefined);
      setIsLoadingTable(true);
      getCategoriesData();
    }
  }, [isDisplayEditModal, isDisplayAddModal]);

  const tableColumns: ColumnType<Category>[] = [
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
      title: "Category ID",
      dataIndex: "id",
      width: 350,
    },
    {
      title: "Name",
      dataIndex: "name",
      width: 350,
      align: "center" as AlignSetting,
      defaultSortOrder: "ascend" as SortOrder,
      sorter: (a: Category, b: Category) => a.name.localeCompare(b.name),
    },
    {
      title: "Action",
      align: "center" as AlignSetting,
      render: (_: any, record: Category) => (
        <div className="flex gap-2 justify-center">
          <Tooltip trigger={"hover"} title="Edit category's info">
            <Button
              type="text"
              icon={<MdEdit />}
              onClick={() => {
                setEditedCategory(record);
                setIsDisplayEditModal(true);
              }}
            />
          </Tooltip>
          <Tooltip title="Delete category">
            <Popconfirm
              title="Delete category"
              description={`Are you sure to delete this category?`}
              onConfirm={() => deleteCategory(record.id)}
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
        <h1 className="text-2xl font-semibold">Manage categories</h1>
        <div className="flex justify-between">
          <Search
            placeholder="Enter category's name..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onSearch={() => {
              setIsLoadingTable(true);
              setIsLoadingSearchInput(true);
              searchCategories(searchInput);
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
                getCategoriesData();
              }}
            />
            <Button
              type="default"
              icon={<IoIosAddCircle />}
              size="large"
              onClick={() => setIsDisplayAddModal(true)}
            >
              Add category
            </Button>
          </div>
        </div>
      </div>
      <Table
        columns={tableColumns}
        dataSource={tableData}
        scroll={{ y: 420 }}
        rowKey={record => record?.id}
        loading={isLoadingTable}
        pagination={false}
        className="w-11/12 mx-auto mt-4"
      />
      <EditCategoryModal
        open={isDisplayEditModal}
        setOpen={setIsDisplayEditModal}
        record={editedCategory}
        key={"key"}
      />
      <AddCategoryModal
        open={isDisplayAddModal}
        setOpen={setIsDisplayAddModal}
      />
    </div>
  );
};

export default ManageCategories;
