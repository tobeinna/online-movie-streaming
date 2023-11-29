import React, { useEffect, useState } from "react";
import { Modal, Button } from "antd";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { addDoc, collection } from "firebase/firestore";

import { database } from "../../configs/firebaseConfig";
import { Category } from "../../types/movie.types";

interface IAddCategoryModalProps {
  open: boolean;
  setOpen: (value: React.SetStateAction<boolean>) => void;
  record?: Category;
}

const AddCategoryModal: React.FC<IAddCategoryModalProps> = ({
  open,
  setOpen,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm(
    {
      defaultValues: {
        name: "",
      },
    }
  );

  useEffect(() => {
    if (open) {
      setIsLoading(false);
    }
  }, [open]);

  const handleAddCategory = async (data: {
    name: string;
  }) => {
    const categoryRef = collection(database, "categories");

    try {
      await addDoc(categoryRef, {
        name: data.name,
      });

      toast.success("Category added");
      setOpen(false);
    } catch (error) {
      toast.error(`${error}`);
    }
    setIsLoading(false);
  };

  const onSubmit = async (data: {
    name: string;
  }) => {
    setIsLoading(true);
    handleAddCategory(data);
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
      title="Add category"
      destroyOnClose
    >
      <form
        className="flex w-full mx-auto flex-col gap-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex flex-col gap-2">
          <label htmlFor="displayName" className="text-[#28262D] pb-0">
            Name
          </label>
          <input
            className="w-full px-3 py-1.5 border-gray-300  border-[0.5px] rounded-md shadow-sm"
            type="text"
            id="displayName"
            placeholder="Enter user's display name"
            {...register("name", {
              required: "Name is required.",
            })}
          />
          <p className="error-message text-[#dd2b0e]">
            {errors.name?.message}
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

export default AddCategoryModal;
