import React, { useEffect, useState } from "react";
import { Modal, Button } from "antd";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { doc, setDoc } from "firebase/firestore";

import { User } from "../../types/user.types";
import { database } from "../../configs/firebaseConfig";

interface IEditUserModalProps {
  open: boolean;
  setOpen: (value: React.SetStateAction<boolean>) => void;
  record?: User;
}

const EditUserModal: React.FC<IEditUserModalProps> = ({
  open,
  setOpen,
  record,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm(
    record && {
      defaultValues: {
        displayName: "",
        photoURL: "",
        status: true,
      },
    }
  );

  useEffect(() => {
    if (open) {
      setIsLoading(false);
    }
  }, [open]);

  useEffect(() => {
    if (record) {
      setValue("displayName", record.displayName);
      setValue("photoURL", record.photoURL || "");
      setValue("status", record.status);
    }
  }, [record]);

  const handleEditUser = async (data: {
    displayName: string;
    photoURL: string;
    status: boolean;
  }) => {
    const userRef = doc(database, `users/${record?.uid}`);

    try {
      await setDoc(userRef, {
        displayName: data.displayName,
        search_displayName: data.displayName.toLowerCase(),
        createdAt: record?.createdAt,
        photoURL: data.photoURL,
        role: record?.role,
        status: String(data.status) === "true" ? true : false,
      });

      toast.success("User's info saved");
      setOpen(false);
    } catch (error) {
      toast.error(`${error}`);
    }
    setIsLoading(false);
  };

  const onSubmit = async (data: {
    displayName: string;
    photoURL: string;
    status: boolean;
  }) => {
    setIsLoading(true);
    handleEditUser(data);
  };

  return (
    <Modal
      open={open}
      okButtonProps={{
        className: "hidden",
      }}
      cancelButtonProps={{ className: "hidden" }}
      closable={false}
      onCancel={() => {
        setOpen(false);
      }}
      title="Edit user's info"
      destroyOnClose
    >
      <form
        className="flex w-full mx-auto flex-col gap-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex flex-col gap-2">
          <p className="">
            User ID: <span className="font-semibold">{record?.uid}</span>
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="displayName" className="text-[#28262D] pb-0">
            Name
          </label>
          <input
            className="w-full px-3 py-1.5 border-gray-300  border-[0.5px] rounded-md shadow-sm"
            type="text"
            id="displayName"
            placeholder="Enter user's display name"
            {...register("displayName", {
              required: "Name is required.",
            })}
          />
          <p className="error-message text-[#dd2b0e]">
            {errors.displayName?.message}
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <p className="">
            Role:{" "}
            <span className="font-semibold">
              {record?.role === "user" ? "User" : "Admin"}
            </span>
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <p className="">
            Created at:{" "}
            <span className="font-semibold">
              {record?.createdAt?.seconds
                ? new Date(record?.createdAt?.seconds * 1000).toLocaleString()
                : ""}
            </span>
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="status" className="text-[#28262D] pb-0">
            Status
          </label>
          <select
            id="status"
            {...register("status")}
            className="px-3 py-1.5 w-fit border-gray-300  border-[0.5px] rounded-md"
          >
            <option value="true">Enabled</option>
            <option value="false">Disabled</option>
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="photoURL" className="text-[#28262D] pb-0">
            Photo URL
          </label>
          <input
            className="w-full px-3 py-1.5 border-gray-300  border-[0.5px] rounded-md shadow-sm"
            type="text"
            id="photoURL"
            placeholder="Enter user's photo URL"
            {...register("photoURL")}
          />
          <p className="error-message text-[#dd2b0e]">
            {errors.photoURL?.message}
          </p>
        </div>
        <div className="button-container flex gap-2">
          <Button
            className="w-full"
            type="default"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button
            className="w-full bg-blue-600"
            type="primary"
            htmlType="submit"
            loading={isLoading}
          >
            Save changes
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default EditUserModal;
