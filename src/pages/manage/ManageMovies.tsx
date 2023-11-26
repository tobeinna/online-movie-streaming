import { Button, Popconfirm, Table, Tooltip } from "antd";
import Search from "antd/es/input/Search";
import { ColumnType } from "antd/es/table";
import {
  collection,
  doc,
  documentId,
  getDocs,
  orderBy,
  query,
  setDoc,
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
import EditUserModal from "../../components/Modal/EditUserModal";

const ManageMovies = () => {
  const [searchInput, setSearchInput] = useState<string>("");
  const [tableData, setTableData] = useState<User[]>([]);
  const [isLoadingTable, setIsLoadingTable] = useState<boolean>(false);
  const [isLoadingSearchInput, setIsLoadingSearchInput] =
    useState<boolean>(false);
  const [isDisplayEditModal, setIsDisplayEditModal] = useState<boolean>(false);
  const [editedUser, setEditedUser] = useState<User | undefined>();

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
        where("search_displayName", ">=", input.toLowerCase()),
        where("search_displayName", "<=", input.toLowerCase() + "\uf8ff"),
        orderBy("search_displayName")
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
      setIsLoadingSearchInput(false);
    } catch (error) {
      toast.error(`${error}`, { position: "top-right" });
      console.log(error);

      setIsLoadingTable(false);
      setIsLoadingSearchInput(false);
    }
  };

  let changeUserStatus = async (record: User, newStatusValue: boolean) => {
    setIsLoadingTable(true);
    const userRef = doc(database, `users/${record.uid}`);
    try {
      await setDoc(userRef, {
        createdAt: record.createdAt,
        displayName: record.displayName,
        photoURL: record.photoURL ? record.photoURL : null,
        role: record.role,
        search_displayName: record.search_displayName,
        status: newStatusValue,
      });

      toast.success("User's status changed successfully!", {
        position: "top-right",
      });
    } catch (error) {
      toast.error(`${error}`, { position: "top-right" });
    }
    getUsersData();
  };

  useEffect(() => {
    setIsLoadingTable(true);
    getUsersData();
  }, []);

  useEffect(() => {
    if (!isDisplayEditModal) {
      setEditedUser(undefined);
      setIsLoadingTable(true);
      getUsersData();
    }
  }, [isDisplayEditModal]);

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
      render: (status: boolean) => (
        <>
          {status ? (
            <span className="text-green-600 font-semibold">Enabled</span>
          ) : (
            <span className="text-gray-600 font-semibold">Disabled</span>
          )}
        </>
      ),
    },
    {
      title: "Action",
      key: "status",
      align: "center" as AlignSetting,
      render: (_: any, record: User) => (
        <div className="flex gap-2 justify-center">
          <Tooltip trigger={"hover"} title="Edit user's info">
            <Button
              type="text"
              icon={<MdEdit />}
              onClick={() => {
                setEditedUser(record);
                setIsDisplayEditModal(true);
              }}
            />
          </Tooltip>
          {record.status ? (
            <Tooltip title="Disable user">
              <Popconfirm
                title="Disable user"
                description="Are you sure to disable this user?"
                onConfirm={() => changeUserStatus(record, false)}
                okText="Yes"
                cancelText="No"
                okButtonProps={{ type: "default" }}
              >
                <Button
                  type="text"
                  icon={<FaUserSlash className="text-gray-600" />}
                />
              </Popconfirm>
            </Tooltip>
          ) : (
            <Tooltip title="Enable user">
              <Popconfirm
                title="Enable user"
                description="Are you sure to enable this user?"
                onConfirm={() => changeUserStatus(record, true)}
                okText="Yes"
                cancelText="No"
                okButtonProps={{ type: "default" }}
              >
                <Button
                  type="text"
                  icon={<FaUser className="text-green-600" />}
                />
              </Popconfirm>
            </Tooltip>
          )}
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
              searchUsers(searchInput);
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
      <EditUserModal
        open={isDisplayEditModal}
        setOpen={setIsDisplayEditModal}
        record={editedUser}
        key={"key"}
      />
    </div>
  );
};

export default ManageMovies;
