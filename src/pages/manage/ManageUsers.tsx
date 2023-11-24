import { Button, Table, Tooltip } from "antd";
import Search from "antd/es/input/Search";
import { ColumnType } from "antd/es/table";
import {
  DocumentData,
  and,
  collection,
  documentId,
  getDocs,
  or,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { IoIosAddCircle } from "react-icons/io";
import { database } from "../../configs/firebaseConfig";
import { toast } from "react-toastify";
import { MdEdit, MdRefresh } from "react-icons/md";
import { FaUser, FaUserSlash } from "react-icons/fa6";
import { User } from "../../types/user.types";
import { SortOrder } from "antd/es/table/interface";

const tableColumns: ColumnType<User>[] = [
  {
    title: "User ID",
    dataIndex: "uid",
    key: "uid",
    width: 300,
  },
  {
    title: "Name",
    dataIndex: "displayName",
    key: "displayName",
    width: 200,
    sorter: (a: User, b: User) => a.displayName.localeCompare(b.displayName),
  },
  {
    title: "Photo",
    dataIndex: "photoURL",
    key: "photoURL",
    width: 100,
    align: "center" as AlignSetting,
    render: (_: any, record: User) => (
      <>
        {record.photoURL ? (
          <img
            className="w-12 h-12 rounded-full mx-auto"
            src={record.photoURL}
          />
        ) : (
          <span>None </span>
        )}
      </>
    ),
  },
  {
    title: "Created at",
    dataIndex: "createdAt",
    key: "createdAt",
    width: 250,
    align: "center" as AlignSetting,
    sorter: (a: User, b: User) => a.createdAt.seconds - b.createdAt.seconds,
    render: (createdAt: { seconds: number; nanoseconds: number }) => (
      <>{new Date(createdAt?.seconds * 1000).toLocaleString()}</>
    ),
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    width: 100,
    align: "center" as AlignSetting,
    defaultSortOrder: "descend" as SortOrder,
    sorter: (a: User, b: User) =>
      String(a.status).localeCompare(String(b.status)),
    render: (status: boolean) => <>{status ? "Enabled" : "Disabled"}</>,
  },
  {
    title: "Action",
    key: "status",
    align: "center" as AlignSetting,
    render: (_: any, record: User) => (
      <div className="flex gap-2 justify-center">
        <Tooltip title="Edit user's info">
          <Button type="text" icon={<MdEdit />} />
        </Tooltip>
        {record.status ? (
          <Tooltip title="Disable user">
            <Button type="text" icon={<FaUserSlash />} />
          </Tooltip>
        ) : (
          <Tooltip title="Enable user">
            <Button type="text" icon={<FaUser />} />
          </Tooltip>
        )}
      </div>
    ),
  },
];

const ManageUsers = () => {
  const [searchInput, setSearchInput] = useState<string>("");
  const [tableData, setTableData] = useState<User[]>([]);
  const [isLoadingTable, setIsLoadingTable] = useState<boolean>(false);

  const getUsersData = async () => {
    try {
      const usersRef = collection(database, "users");
      const usersSnapshot = await getDocs(usersRef);

      if (!usersSnapshot.empty) {
        const result: User[] = [];
        usersSnapshot.forEach((doc) => {
          if (doc.data().role !== "admin")
            result.push({ ...doc.data(), uid: doc.id } as User);
        });
        setTableData(result);
        setIsLoadingTable(false);
      } else {
        setTableData([]);
        setIsLoadingTable(false);
      }
    } catch (error) {
      toast.error(`${error}`, { position: "top-right" });
      setIsLoadingTable(false);
    }
  };

  const searchUsers = async (input: string) => {
    try {
      const usersRef = collection(database, "users");
      const qDisplayName = query(
        usersRef,
        where("displayName", ">=", input),
        where("displayName", "<=", input + "\uf8ff"),
        orderBy("displayName")
      );

      const qUid = query(
        usersRef,
        where(documentId(), ">=", input),
        where(documentId(), "<=", input + "\uf8ff"),
        orderBy(documentId())
      );

      // Combine results if needed
      const result = await Promise.all([getDocs(qDisplayName), getDocs(qUid)]);
      const combinedResults = result[0].docs.concat(result[1].docs);
      const resultData: User[] = [];
      combinedResults.forEach((doc) => {
        if (doc.data().role !== "admin")
          resultData.push({ ...doc.data(), uid: doc.id } as User);
      });

      setTableData(resultData);
      setIsLoadingTable(false);
    } catch (error) {
      toast.error(`${error}`, { position: "top-right" });
      console.log(error);

      setIsLoadingTable(false);
    }
  };

  useEffect(() => {
    setIsLoadingTable(true);
    getUsersData();
  }, []);

  return (
    <div className="bg-stone-100 m-4 pt-4 shadow-sm h-full">
      <div className="content mx-auto mt-4 w-11/12 flex flex-col gap-4">
        <h1 className="text-2xl font-semibold">Manage users</h1>
        <div className="flex justify-between">
          <Search
            placeholder="Enter user's name or user ID..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onSearch={() => {
              setIsLoadingTable(true);
              searchUsers(searchInput);
            }}
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
                getUsersData();
              }}
            />
            <Button type="default" icon={<IoIosAddCircle />} size="large">
              Add user
            </Button>
          </div>
        </div>
      </div>
      <Table
        columns={tableColumns}
        dataSource={tableData}
        scroll={{ y: 420 }}
        rowKey={"id"}
        loading={isLoadingTable}
        pagination={false}
        className="w-11/12 mx-auto mt-4"
      />
    </div>
  );
};

export default ManageUsers;
