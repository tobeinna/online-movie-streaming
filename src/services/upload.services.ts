import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadString,
} from "firebase/storage";
import { ImageType } from "react-images-uploading";
import { nanoid } from "nanoid";

import { storage } from "../configs/firebaseConfig";

export const handleUploadImage = async (
  image: ImageType,
  parentPath: string
) => {
  if (!image || !image.dataURL || !image.file) return {};

  // Generate a random ID using nanoid lib
  const randomId = nanoid();

  const storageRef = ref(
    storage,
    `${parentPath && parentPath + "/"}${randomId}`
  );
  const splittedData = image.dataURL.split(";base64,", 2)[1];

  const uploadTask = uploadString(storageRef, splittedData, "base64");

  try {
    const result = await uploadTask;
    const url = await getDownloadURL(result.ref);

    return {
      url: url,
      imagePath: `${parentPath && parentPath + "/"}${randomId}`,
    };
  } catch (error) {
    // console.log(error);
  }
};

export const deleteImage = async (imagePath: string) => {
  const imageRef = ref(storage, imagePath);
  try {
    await deleteObject(imageRef);
  } catch (error) {
    // console.log(error);
  }
};
