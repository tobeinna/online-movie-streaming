import { Button } from "antd";
import clsx from "clsx";
import ReactImageUploading, { ImageListType } from "react-images-uploading";

interface IImageUploaderProps {
  images: ImageListType;
  setImages: React.Dispatch<React.SetStateAction<ImageListType>>;
  defaultImageURL?: string;
  type: "poster" | "photo";
}

const ImageUploader: React.FC<IImageUploaderProps> = ({
  images,
  setImages,
  defaultImageURL,
  type,
}) => {
  return (
    <ReactImageUploading
      multiple={true}
      value={images}
      onChange={(imageList) => {
        setImages([imageList[imageList.length - 1]] as ImageListType);
      }}
    >
      {({ imageList, errors, onImageUpload, isDragging, dragProps }) => (
        // write your building UI
        <div className="w-full">
          {type === "poster" && (
            <div className="upload__image-wrapper flex justify-between gap-4 w-full h-48 my-auto">
              <div
                className={clsx(
                  isDragging ? "border-blue-600" : "border-blue-300",
                  "border-2 border-dashed m-max h-11/12 text-center cursor-pointer"
                )}
                onClick={onImageUpload}
              >
                <div className="h-full flex flex-col justify-center">
                  <span
                    className={clsx(
                      isDragging ? "text-blue-600" : "text-blue-300",
                      "h-full flex items-center justify-center"
                    )}
                    {...dragProps}
                  >
                    Click or Drop image here
                  </span>
                </div>
              </div>
              <div className="w-1/2">
                {imageList.length ? (
                  <>
                    {imageList.map((image, index) => (
                      <div key={index} className="m-auto overflow-hidden">
                        <img
                          className="m-auto h-40 w-auto rounded-md"
                          src={image.dataURL}
                          alt=""
                          width="100"
                        />
                      </div>
                    ))}
                    <div className="w-full flex justify-center">
                      <Button
                        className="mx-auto mt-2"
                        type="default"
                        title="Remove"
                        onClick={() => {
                          setImages([]);
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  </>
                ) : (
                  defaultImageURL && (
                    <div className="m-auto overflow-hidden">
                      <img
                        className="m-auto h-48 w-auto rounded-md"
                        src={defaultImageURL}
                      />
                    </div>
                  )
                )}
              </div>
            </div>
          )}
          {type === "photo" && (
            <div className="upload__image-wrapper flex justify-between gap-4 w-full h-fit min-h-[3rem] my-auto">
              <div
                className={clsx(
                  isDragging ? "border-blue-600" : "border-blue-300",
                  "border-2 border-dashed w-full h-11/12 text-center cursor-pointer"
                )}
                onClick={onImageUpload}
              >
                <div className="h-full flex flex-col justify-center">
                  <span
                    className={clsx(
                      isDragging ? "text-blue-600" : "text-blue-300",
                      "h-full flex items-center justify-center"
                    )}
                    {...dragProps}
                  >
                    Click or Drop image here
                  </span>
                </div>
              </div>
              <div className="w-1/2">
                {imageList.length ? (
                  <>
                    {imageList.map((image, index) => (
                      <div key={index} className="m-auto overflow-hidden">
                        <img
                          className="w-12 h-12 rounded-full mx-auto border-2 border-slate-300"
                          src={image.dataURL}
                        />
                      </div>
                    ))}
                    <div className="w-full flex justify-center">
                      <Button
                        className="mx-auto mt-2"
                        type="default"
                        title="Remove"
                        onClick={() => {
                          setImages([]);
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  </>
                ) : (
                  defaultImageURL && (
                    <div className="m-auto overflow-hidden">
                      <img
                        className="w-12 h-12 rounded-full mx-auto border-2 border-slate-300"
                        src={defaultImageURL}
                      />
                    </div>
                  )
                )}
              </div>
            </div>
          )}
          {errors && (
            <div className="text-[#dd2b0e]">
              {errors.maxNumber && (
                <span>Number of selected images exceed maxNumber</span>
              )}
              {errors.acceptType && (
                <span>Your selected file type is not allow</span>
              )}
              {errors.maxFileSize && (
                <span>Selected file size exceed maxFileSize</span>
              )}
              {errors.resolution && (
                <span>Selected file is not match your desired resolution</span>
              )}
            </div>
          )}
        </div>
      )}
    </ReactImageUploading>
  );
};

export default ImageUploader;
