import { useDropzone } from "react-dropzone";
// import { useState } from "react";
import { ImCross } from "react-icons/im";
import ComponentCard from "../../../common/CommonComponentCard";

interface DropzoneComponentProps {
  title?: string;
  name: string;
  control?: any;
  setValue: any;
  currentImage?: File | string | null;
  uploadProgress?: number;
  isUploading?: boolean;
}

const DropzoneComponent: React.FC<DropzoneComponentProps> = ({
  name,
  setValue,
  currentImage,
  isUploading,
  uploadProgress,
}) => {
  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop: (acceptedFiles) => {
      if (acceptedFiles && acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        // setIsUploading(true);
        // setUploadProgress(0);

        // Simulate upload progress
        // const interval = setInterval(() => {
        //   setUploadProgress(prev => {
        //     if (prev >= 100) {
        //       clearInterval(interval);
        //       setIsUploading(false);
        //       setValue(name, file, { shouldValidate: true });
        //       return 100;
        //     }
        //     return prev + 10;
        //   });
        // }, 200);
        // setIsUploading(false);
        setValue(name, file, { shouldValidate: true });
      }
    },
    accept: {
      "image/png": [],
      "image/jpeg": [],
      "image/webp": [],
      "image/svg+xml": [],
    },
    noClick: true, // Manual click handling 12123
    disabled: isUploading, 
  });

  const removeFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setValue(name, null, { shouldValidate: true });
  };

  const renderPreview = () => {
    if (currentImage instanceof File) {
      return (
        <div className="relative w-full mb-4 group">
          <img
            src={URL.createObjectURL(currentImage)}
            alt="Preview"
            className="w-full max-h-28 object-contain rounded-lg"
          />
          {!isUploading && (
            <div
              onClick={(e) => {
                e.stopPropagation();
                removeFile(e);
              }}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
                        cursor-pointer opacity-0 group-hover:opacity-100
                        transition-opacity duration-200"
            >
              <ImCross className="w-8 h-8 text-transparent hover:text-gray-600" />
            </div>
          )}
        </div>
      );
    } else if (typeof currentImage === "string" && currentImage) {
      return (
        <div className="relative w-full mb-4 group">
          <img
            src={currentImage}
            alt="Current"
            className="w-full max-h-28 object-contain rounded-lg"
          />
          <div
            onClick={(e) => {
              e.stopPropagation();
              removeFile(e);
            }}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
                      cursor-pointer opacity-0 group-hover:opacity-100
                      transition-opacity duration-200"
          >
            <ImCross className="w-8 h-8 text-transparent hover:text-gray-600" />
          </div>
        </div>
      );
    }
    return null;
  };
  return (
    <ComponentCard title={"Upload Image"}>
      <div
        {...getRootProps({
          onClick: open, // Your working solution - handle click manually
        })}
        className="transition border border-gray-300 border-dashed cursor-pointer dark:hover:border-primary dark:border-gray-700 rounded-xl hover:border-primary"
      >
        <div
          className={`dropzone rounded-xl border-dashed border-gray-300 p-7 lg:p-10
            ${
              isDragActive
                ? "border-primary bg-gray-100 dark:bg-black"
                : "border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-black"
            }
            ${isUploading ? "opacity-70 cursor-not-allowed" : ""}
          `}
          id="demo-upload"
        >
          {/* Your working solution - simplified input props */}
          <input {...getInputProps()} />

          <div className="dz-message flex flex-col items-center m-0! min-h-[208px]">
            {renderPreview()}

            {isUploading && (
              <div className="w-full max-w-[290px] bg-gray-200 rounded-full h-1.5 mb-4 dark:bg-gray-700">
                <div
                  className="bg-primary h-1.5 rounded-full"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            )}

            {!renderPreview() && (
              <div className="mb-[22px] flex justify-center mt-6">
                <div className="flex h-[68px] w-[68px] items-center justify-center rounded-full bg-gray-200 text-gray-700 dark:bg-black dark:text-gray-400">
                  <svg
                    className="fill-current"
                    width="29"
                    height="28"
                    viewBox="0 0 29 28"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M14.5019 3.91699C14.2852 3.91699 14.0899 4.00891 13.953 4.15589L8.57363 9.53186C8.28065 9.82466 8.2805 10.2995 8.5733 10.5925C8.8661 10.8855 9.34097 10.8857 9.63396 10.5929L13.7519 6.47752V18.667C13.7519 19.0812 14.0877 19.417 14.5019 19.417C14.9161 19.417 15.2519 19.0812 15.2519 18.667V6.48234L19.3653 10.5929C19.6583 10.8857 20.1332 10.8855 20.426 10.5925C20.7188 10.2995 20.7186 9.82463 20.4256 9.53184L15.0838 4.19378C14.9463 4.02488 14.7367 3.91699 14.5019 3.91699ZM5.91626 18.667C5.91626 18.2528 5.58047 17.917 5.16626 17.917C4.75205 17.917 4.41626 18.2528 4.41626 18.667V21.8337C4.41626 23.0763 5.42362 24.0837 6.66626 24.0837H22.3339C23.5766 24.0837 24.5839 23.0763 24.5839 21.8337V18.667C24.5839 18.2528 24.2482 17.917 23.8339 17.917C23.4197 17.917 23.0839 18.2528 23.0839 18.667V21.8337C23.0839 22.2479 22.7482 22.5837 22.3339 22.5837H6.66626C6.25205 22.5837 5.91626 22.2479 5.91626 21.8337V18.667Z"
                    />
                  </svg>
                </div>
              </div>
            )}

            {/* <h4 className="mb-3 font-semibold text-black text-theme-xl dark:text-white/90">
              {isUploading
                ? "Uploading..."
                : isDragActive
                ? "Drop Files Here"
                : "Drag & Drop Files Here"}
            </h4> */}

            <span className="text-center mb-5 block w-full max-w-[290px] text-sm text-gray-700 dark:text-gray-400">
              {isUploading
                ? `${uploadProgress}% complete`
                : "Drag and drop your PNG, JPG, WebP, SVG images here or click to browse"}
            </span>

            {!isUploading && (
              <span className="font-medium underline text-theme-sm text-brand-500">
                Browse File
              </span>
            )}
          </div>
        </div>
      </div>
    </ComponentCard>
  );
};

export default DropzoneComponent;
