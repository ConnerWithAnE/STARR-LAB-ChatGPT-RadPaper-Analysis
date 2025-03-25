import { useState } from "react";
import "../App.css";
import { Button } from "@nextui-org/react";
import UploadPageSliver from "../components/upload-page-sliver";
import { useNavigate } from "react-router-dom";
import { mockGPTPasses, mockfrompaper3 } from "../mockfulldatatype";
import { Spinner } from "@nextui-org/react";

export default function UploadPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const selectedFiles = Array.from(event.target.files ?? []); // Convert FileList to an array
    const validFiles = selectedFiles.filter(
      (file) => file?.type === "application/pdf"
    );

    if (validFiles.length === 0) {
      console.log("not valid files");
      return;
    } else {
      console.log(validFiles);
      setFiles((prevFiles) => [...prevFiles, ...validFiles]);
    }
  };

  const handleRemoveFile = (file: File) => {
    //Since File objects are compared by reference, this will properly remove the file from the array
    setFiles((prevFiles) => prevFiles.filter((f) => f !== file));
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const selectedFiles = Array.from(event.dataTransfer?.files ?? []); // Convert FileList to an array
    const validFiles = selectedFiles.filter(
      (file) => file?.type === "application/pdf"
    );

    if (validFiles.length === 0) {
      console.log("not valid files");
      return;
    } else {
      console.log(validFiles);
      setFiles((prevFiles) => [...prevFiles, ...validFiles]);
    }
  };

  // Handle the click to trigger file input
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleDivClick = (_event: React.MouseEvent<HTMLDivElement>): void => {
    const fileInput = document.getElementById(
      "dropzone-file"
    ) as HTMLInputElement;
    fileInput.click(); // Trigger the file input click
  };

  async function submitPapers() {
    // for testing
    // navigate("/upload/edit", {
    //   state: { resp: mockfrompaper3.concat(mockGPTPasses) },
    // });

    const token = localStorage.getItem("jwtToken");

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("pdfs", files[i]);
    }

    try {
      setLoading(true);
      const response = await fetch(
        "http://localhost:3000/api/adminRequest/parseRequest",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );
      if (response.ok) {
        const result = await response.json();
        console.log(result);
        navigate("/upload/edit", {
          state: { resp: result },
        });
        setFiles([]);
      } else {
        const err_res = await response.json();
        if (err_res.message) {
          console.error(`${err_res.message}`);
        } else {
          console.error(`Failed to fetch papers: ${response.status}`);
        }
      }
    } catch (error) {
      console.error(`Error fetching papers: ${error}`);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center h-full bg-gray-50">
      <div className="w-[70%] h-full flex flex-col">
        <div className="bg-[#F4F4F4]">
          <div className="py-[6%] text-4xl">Upload New Papers</div>

          <div className="w-full h-8 bg-[#D4D4D4] drop-shadow-md"></div>
        </div>
        <div className="bg-white flex-grow flex justify-between items-start py-4 pb-10 overflow-hidden">
          <div className="bg-[#F4F4F4] border border-gray-300 rounded-md flex-grow mx-4 h-full overflow-y-scroll">
            {files.map((file: File, index: number) => (
              <UploadPageSliver
                file={file}
                index={index}
                key={index}
                cancel={() => handleRemoveFile(file)}
              />
            ))}
          </div>
          <div className="flex flex-col w-[30%] h-full mr-4">
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={handleDivClick}
              className="flex flex-col items-center justify-center w-full h-full border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <div className="bg-usask-green text-lg text-gray-100 p-2 rounded-lg">
                  Choose A File
                </div>
                <p className="mt-2 text-md text-gray-500 dark:text-gray-400">
                  or drag and drop
                </p>
              </div>
              <input
                id="dropzone-file"
                type="file"
                multiple
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
            <div className="flex justify-center space-x-4 mt-4">
              <Button
                className="bg-[#ff5353] text-white rounded-md w-full"
                type="button"
                disabled={loading}
                onClick={() => {
                  navigate("/");
                }}
              >
                Cancel
              </Button>
              <Button
                className="bg-usask-green text-white rounded-md w-full"
                type="submit"
                disabled={loading}
                onClick={submitPapers}
              >
                {loading ? <Spinner color="white" /> : "Upload"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
