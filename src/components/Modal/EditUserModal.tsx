import React, { useEffect, useState } from "react";
import { Modal, Button } from "antd";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { ImageListType } from "react-images-uploading";

import { User } from "../../types/user.types";
import { database } from "../../configs/firebaseConfig";
import ImageUploader from "../ImageUploader/ImageUploader";
import { deleteImage, handleUploadImage } from "../../services/upload.services";
import useAuth from "../../hooks/useAuth";

interface IEditUserModalProps {
  open: boolean;
  setOpen: (value: React.SetStateAction<boolean>) => void;
  uid?: string;
}

const EditUserModal: React.FC<IEditUserModalProps> = ({
  open,
  setOpen,
  uid,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [images, setImages] = useState<ImageListType>([]);
  const [currentUser, setCurrentUser] = useState<User>();

  const { setIsRefreshUser } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm(
    currentUser && {
      defaultValues: {
        displayName: "",
        photoURL: "",
        status: true,
      },
    }
  );

  useEffect(() => {
    setImages([]);
    if (open) {
      setIsLoading(false);
    } else {
      reset();
      setCurrentUser(undefined);
    }
  }, [open]);

  useEffect(() => {
    if (open && uid) {
      getUser(uid);
    }
  }, [open]);

  useEffect(() => {
    if (currentUser) {
      setValue("displayName", currentUser.displayName);
      setValue("photoURL", currentUser.photoURL || "");
      setValue("status", currentUser.status);
    }
  }, [currentUser]);

  const getUser = async (uid: string) => {
    try {
      const userRef = doc(database, `users/${uid}`);
      const userSnapshot = await getDoc(userRef);

      if (userSnapshot.exists()) {
        setCurrentUser({ ...userSnapshot.data(), uid: uid } as User);
      }
    } catch (error) {
      toast.error(`${error}`);
    }
    setIsLoading(false);
  };

  const handleEditUser = async (data: {
    displayName: string;
    photoURL: string;
    status: boolean;
  }) => {
    if (!currentUser) {
      setIsLoading(false);
      return;
    }

    const userRef = doc(database, `users/${currentUser?.uid}`);

    try {
      if (images[0]) {
        const uploadResult = await handleUploadImage(images[0], "photo");

        if (uploadResult) {
          // console.log(uploadResult);

          await setDoc(userRef, {
            displayName: data.displayName,
            search_displayName: data.displayName.toLowerCase(),
            createdAt: currentUser?.createdAt,
            photoURL: uploadResult.url,
            photo_path: uploadResult.imagePath,
            role: currentUser?.role,
            status: String(data.status) === "true" ? true : false,
          });

          if (
            currentUser.photo_path &&
            uploadResult.imagePath !== currentUser.photo_path
          ) {
            await deleteImage(currentUser.photo_path);
          }
        } else {
          toast.error("Could not upload image.");
        }
      } else {
        await setDoc(userRef, {
          displayName: data.displayName,
          search_displayName: data.displayName.toLowerCase(),
          createdAt: currentUser?.createdAt,
          photoURL: data.photoURL,
          role: currentUser?.role,
          status: String(data.status) === "true" ? true : false,
        });
      }

      toast.success("User's info saved");
      setIsRefreshUser((prev) => !prev);
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
      title="Edit profile"
      destroyOnClose
    >
      <form
        className="flex w-full mx-auto flex-col gap-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex flex-col gap-2">
          <p className="">
            User ID: <span className="font-semibold">{currentUser?.uid}</span>
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
              {currentUser?.role === "user" ? "User" : "Admin"}
            </span>
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <p className="">
            Created at:{" "}
            <span className="font-semibold">
              {currentUser?.createdAt?.seconds
                ? new Date(
                    currentUser?.createdAt?.seconds * 1000
                  ).toLocaleString()
                : ""}
            </span>
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-[#28262D] pb-0">Photo</span>
          <div className="image-upload-container flex justify-between w-full h-fit z-50">
            <ImageUploader
              images={images}
              setImages={setImages}
              defaultImageURL={currentUser?.photoURL || ""}
              type="photo"
            />
          </div>
        </div>
        <div className="button-container flex gap-2">
          <Button
            className="edit-user-cancel w-full"
            type="default"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button
            className="edit-user-ok w-full text-slate-100 bg-green-600"
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
