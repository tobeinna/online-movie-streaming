import React, { useEffect, useLayoutEffect, useState } from "react";
import { Modal, Button } from "antd";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { collection, doc, getDocs, setDoc } from "firebase/firestore";
import makeAnimated from "react-select/animated";
import Select, { MultiValue } from "react-select";
import { ImageListType } from "react-images-uploading";

import { Category, Movie } from "../../types/movie.types";
import { database } from "../../configs/firebaseConfig";
import {
  convertYearMonthDayToUTCDate,
  formatDateToYearMonthDay,
} from "../../utils/timeUtils";
import ImageUploader from "../ImageUploader/ImageUploader";
import { deleteImage, handleUploadImage } from "../../services/upload.services";

interface IEditMovieModalProps {
  open: boolean;
  setOpen: (value: React.SetStateAction<boolean>) => void;
  record?: Movie;
}

const animatedComponents = makeAnimated();

interface ISelectItem {
  value: string;
  label: string;
}

const EditMovieModal: React.FC<IEditMovieModalProps> = ({
  open,
  setOpen,
  record,
}) => {
  const [currentRecord, setCurrentRecord] = useState<Movie>();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [categoriesSelectItem, setCategoriesSelectItem] = useState<
    ISelectItem[]
  >([]);
  const [categoriesSelectOptions, setCategoriesSelectOptions] = useState<
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
    setValue,
    getValues,
  } = useForm(
    currentRecord && {
      defaultValues: {
        title: "",
        poster: "",
        description: "",
        duration: 1,
        release_date: new Date().toISOString().split("T")[0],
        video: "",
        status: true,
      },
    }
  );

  const getCategories = async () => {
    const categoriesRef = collection(database, "categories");
    const catagoriesSnapshot = await getDocs(categoriesRef);

    try {
      let result: Category[] = [];
      catagoriesSnapshot.forEach((doc) =>
        result.push({ id: doc.id, name: doc.data().name })
      );
      setCategories(result);

      const tempCategoryOptions = result.map((item) => {
        return { value: item.id, label: item.name };
      });

      setCategoriesSelectOptions(tempCategoryOptions);
    } catch (error) {
      toast("Error while get category list!", { type: "error" });
    }
  };

  useLayoutEffect(() => {
    setCategoriesError("");
    setCategoriesSelectItem([]);
    setImages([]);
    if (open) {
      getCategories();
      setIsLoading(false);
    }
  }, [open]);

  useEffect(() => {
    if (record) {
      setCurrentRecord(record);
    }
  }, [record]);

  useLayoutEffect(() => {
    if (currentRecord && categories) {
      setValue("title", currentRecord.title);
      setValue("poster", currentRecord.poster);
      setValue("description", currentRecord.description);
      setValue("duration", currentRecord.duration);
      setValue(
        "release_date",
        formatDateToYearMonthDay(
          new Date(currentRecord.release_date.seconds * 1000)
        )
      );
      setValue("video", currentRecord.video);
      setValue("status", currentRecord.status);
      setSelectedCategories(currentRecord.categoriesId || []);
      setCategoriesSelectItem(currentRecord.categoriesSelectItem || []);
    }
  }, [record, categories]);

  const handleEditMovie = async (data: {
    title: string;
    poster: string;
    description: string;
    duration: number;
    release_date: string;
    video: string;
    status: boolean;
  }) => {
    if (!currentRecord) {
      setIsLoading(false);
      return;
    }

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

    const movieRef = doc(database, `movies/${currentRecord.id}`);

    try {
      if (images[0]) {
        const uploadResult = await handleUploadImage(images[0], "poster");

        if (uploadResult) {
          await setDoc(movieRef, {
            title: data.title,
            search_title: data.title.toLowerCase(),
            poster: uploadResult.url,
            poster_path: uploadResult.imagePath,
            description: data.description,
            duration: data.duration,
            release_date: convertYearMonthDayToUTCDate(data.release_date),
            video: data.video,
            votes: currentRecord?.votes || [],
            categoriesId: sortedCategories,
            status: String(data.status) === "true" ? true : false,
          });

          if (
            currentRecord.poster_path &&
            uploadResult.imagePath !== currentRecord.poster_path
          ) {
            await deleteImage(currentRecord.poster_path);
          }
        } else {
          toast.error("Could not upload image.");
        }
      } else {
        await setDoc(movieRef, {
          title: data.title,
          search_title: data.title.toLowerCase(),
          poster: currentRecord.poster,
          poster_path: currentRecord.poster_path && currentRecord.poster_path,
          description: data.description,
          duration: data.duration,
          release_date: convertYearMonthDayToUTCDate(data.release_date),
          video: data.video,
          votes: currentRecord?.votes || [],
          categoriesId: sortedCategories,
          status: String(data.status) === "true" ? true : false,
        });
      }

      toast.success("Movie's info saved");
      setOpen(false);
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
    handleEditMovie(data);
  };

  if (open && currentRecord) {
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
        title="Edit movie's info"
        destroyOnClose
        width={"60%"}
        maskClosable={!isLoading}
      >
        <form
          className="flex w-full mx-auto flex-col gap-4"
          onSubmit={handleSubmit(onSubmit)}
          id="edit-movie"
        >
          <div className="flex justify-between">
            <div className="form-left w-[48%]">
              <div className="flex flex-col gap-2">
                <p className="">
                  Movie ID:{" "}
                  <span className="font-semibold">{currentRecord?.id}</span>
                </p>
              </div>
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
              <div className="flex flex-col gap-2 w-full">
                <span className="text-[#28262D] pb-0">Poster</span>
                <div className="image-upload-container flex justify-between w-full h-fit z-50">
                  <ImageUploader
                    images={images}
                    setImages={setImages}
                    defaultImageURL={getValues("poster")}
                    type="poster"
                  />
                </div>
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
                <div className="category-list w-full flex flex-wrap gap-2">
                  <Select
                    closeMenuOnSelect={false}
                    components={animatedComponents}
                    isMulti
                    value={categoriesSelectItem}
                    defaultValue={categoriesSelectItem}
                    options={categoriesSelectOptions}
                    className="w-full z-20"
                    placeholder=""
                    backspaceRemovesValue={false}
                    controlShouldRenderValue
                    onChange={(
                      newValue: MultiValue<unknown> | ISelectItem[]
                    ) => {
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
                <p className="error-message text-[#dd2b0e]">
                  {categoriesError}
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
              disabled={isLoading}
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
  }
};

export default EditMovieModal;
