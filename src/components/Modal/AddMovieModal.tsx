import React, { useEffect, useState } from "react";
import { Modal, Button } from "antd";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { addDoc, collection, getDocs } from "firebase/firestore";
import makeAnimated from "react-select/animated";
import Select, { MultiValue } from "react-select";

import { Category } from "../../types/movie.types";
import { database } from "../../configs/firebaseConfig";
import { convertYearMonthDayToUTCDate } from "../../utils/timeUtils";
import { ImageListType } from "react-images-uploading";
import ImageUploader from "../ImageUploader/ImageUploader";
import { handleUploadImage } from "../../services/upload.services";

interface IAddMovieModalProps {
  open: boolean;
  setOpen: (value: React.SetStateAction<boolean>) => void;
}

const animatedComponents = makeAnimated();

interface ISelectItem {
  value: string;
  label: string;
}

const AddMovieModal: React.FC<IAddMovieModalProps> = ({ open, setOpen }) => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [categoriesSelectItem, setCategoriesSelectItem] = useState<
    ISelectItem[]
  >([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesError, setCategoriesError] = useState<string>("");
  const [images, setImages] = useState<ImageListType>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      title: "",
      poster: "",
      description: "",
      duration: 1,
      release_date: new Date().toISOString().split("T")[0],
      video: "",
      status: true,
    },
  });

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
    setImages([]);
    if (open) {
      getCategories();
      setIsLoading(false);
      setCategoriesError("");
      setCategoriesSelectItem([]);
      reset();
    }
  }, [open]);

  const handleAddMovie = async (data: {
    title: string;
    poster: string;
    description: string;
    duration: number;
    release_date: string;
    video: string;
    status: boolean;
  }) => {
    if (!(selectedCategories.length > 0)) {
      setCategoriesError("Movie must belong to at least 1 category.");
      setIsLoading(false);
      return;
    }

    if (selectedCategories.length > 4) {
      setCategoriesError("Maximum amount of category is 4.");
      setIsLoading(false);
      return;
    }

    const sortedCategories = selectedCategories?.sort((a: string, b: string) =>
      a.localeCompare(b)
    );

    const moviesRef = collection(database, "movies");
    try {
      if (images[0]) {
        const uploadResult = await handleUploadImage(images[0], "poster");

        if (uploadResult) {
          await addDoc(moviesRef, {
            title: data.title,
            search_title: data.title.toLowerCase(),
            poster: uploadResult.url,
            poster_path: uploadResult.imagePath,
            description: data.description,
            duration: data.duration,
            release_date: convertYearMonthDayToUTCDate(data.release_date),
            video: data.video,
            categoriesId: sortedCategories,
            status: String(data.status) === "true" ? true : false,
          });
          toast.success("Movie added");
          setOpen(false);
        } else {
          toast.error("Could not upload image.");
        }
      } else {
        toast.error("You must upload movie's poster" );
      }
    } catch (error) {
      toast.error(`${error}`);
    }
    setIsLoading(false);
  };

  const onSubmit = async (data: {
    title: string;
    poster: string;
    description: string;
    duration: number;
    release_date: string;
    video: string;
    status: boolean;
  }) => {
    setIsLoading(true);
    handleAddMovie(data);
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
      title="Add movie"
      destroyOnClose
      width={"60%"}
    >
      <form
        className="flex w-full mx-auto flex-col gap-4"
        onSubmit={handleSubmit(onSubmit)}
        id="add-movie"
      >
        <div className="flex justify-between">
          <div className="form-left w-[48%]">
            <div className="flex flex-col gap-2">
              <label htmlFor="displayName" className="text-[#28262D] pb-0">
                Title
              </label>
              <input
                className="w-full px-3 py-1.5 border-gray-300  border-[0.5px] rounded-md shadow-sm"
                type="text"
                id="title"
                placeholder="Enter movie's display name"
                {...register("title", {
                  required: "Title is required.",
                  maxLength: {
                    value: 100,
                    message: "Title's maximum length is 100 characters",
                  },
                })}
              />
              <p className="error-message text-[#dd2b0e]">
                {errors.title?.message}
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-[#28262D] pb-0">Poster</span>
              <div className="image-upload-container flex justify-between w-full h-fit z-50">
                <ImageUploader
                  images={images}
                  setImages={setImages}
                  type="poster"
                />
              </div>
              <p className="error-message text-[#dd2b0e]">
                {errors.poster?.message}
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="description" className="text-[#28262D] pb-0">
                Description
              </label>
              <textarea
                className="w-full h-max px-3 py-1.5 border-gray-300  border-[0.5px] rounded-md shadow-sm"
                form="edit-movie"
                id="description"
                rows={5}
                placeholder="Enter movie's description"
                {...register("description", {
                  required: "Description is required.",
                })}
              />
              <p className="error-message text-[#dd2b0e]">
                {errors.description?.message}
              </p>
            </div>
          </div>
          <div className="form-right w-[48%]">
            <div className="flex flex-col gap-2">
              <label htmlFor="duration" className="text-[#28262D] pb-0">
                Duration (minutes)
              </label>
              <input
                className="w-full px-3 py-1.5 border-gray-300  border-[0.5px] rounded-md shadow-sm"
                type="number"
                id="duration"
                placeholder="Enter Movie's display name"
                {...register("duration", {
                  required: "Duration is required.",
                  pattern: {
                    value: /^[1-9]\d*$/,
                    message: "Duration must be a positive integer.",
                  },
                })}
              />
              <p className="error-message text-[#dd2b0e]">
                {errors.duration?.message}
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="release_date" className="text-[#28262D] pb-0">
                Release date
              </label>
              <input
                className="w-full px-3 py-1.5 border-gray-300  border-[0.5px] rounded-md shadow-sm"
                type="date"
                id="release_date"
                {...register("release_date", {
                  required: "Release date is required.",
                })}
              />
              <p className="error-message text-[#dd2b0e]">
                {errors.release_date?.message}
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="video" className="text-[#28262D] pb-0">
                Video URL
              </label>
              <input
                className="w-full px-3 py-1.5 border-gray-300  border-[0.5px] rounded-md shadow-sm"
                type="text"
                id="video"
                placeholder="Enter movie's video URL"
                {...register("video", {
                  required: "Video URL is required.",
                })}
              />
              <p className="error-message text-[#dd2b0e]">
                {errors.video?.message}
              </p>
            </div>
            <div className="category-input flex flex-col gap-2">
              <span className="text-[#28262D] pb-0">
                Select movie's category
              </span>
              <div className="category-list flex flex-wrap gap-2">
                <Select
                className="w-full"
                  closeMenuOnSelect={false}
                  components={animatedComponents}
                  isMulti
                  value={categoriesSelectItem}
                  options={categories.map((item) => {
                    return { value: item.id, label: item.name };
                  })}
                  placeholder=""
                  backspaceRemovesValue={false}
                  controlShouldRenderValue
                  onChange={(newValue: MultiValue<unknown> | ISelectItem[]) => {
                    // Ensure that selectedValues is an array
                    const selectedItems = newValue as ISelectItem[];

                    setCategoriesSelectItem(selectedItems);

                    const tempCategories = (
                      newValue as { value: string; label: string }[]
                    ).map((item) => item.value);

                    setSelectedCategories(tempCategories);
                  }}
                />
              </div>
              <p className="error-message text-[#dd2b0e]">{categoriesError}</p>
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
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>
          </div>
        </div>
        <div className="button-container flex gap-2 w-1/2 mx-auto">
          <Button
            className="w-full"
            type="default"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button
            className="w-full"
            type="default"
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

export default AddMovieModal;
