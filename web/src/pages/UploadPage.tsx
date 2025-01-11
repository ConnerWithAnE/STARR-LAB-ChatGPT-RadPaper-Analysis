import { ChangeEvent, useState } from "react";
import "../App.css";
import { Button, Input } from "@nextui-org/react";

export default function UploadPage() {
  const [files, setFiles] = useState<File[]>([]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files ?? []); // Convert FileList to an array
    const validFiles = selectedFiles.filter(
      (file) => file?.type === "application/pdf"
    );

    if (validFiles.length === 0) {
      console.log("not valid files");
      return;
    } else {
      setFiles((prevFiles) => [...prevFiles, ...validFiles]);
    }
  };

  async function submitPapers() {
    const token = localStorage.getItem("jwtToken");

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append(files[i].name, files[i]);
    }
  
    try {
      const response = await fetch(
        "http://localhost:3000/api/adminRequest/parseRequest",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );
      if (response.ok) {
        const result = await response.json();
        console.log(result);
      } else {
        console.error(`Failed to fetch papers: ${response.status}`);
      }
    } catch (error) {
      console.error(`Error fetching papers: ${error}`);
      throw error;
    }
  }

  return (
    <div>
      <div>Upload Page</div>
      <Input
        type="file"
        accept="application/pdf"
        multiple
        onChange={handleFileChange}
      />
      <Button
        className="bg-usask-green text-[#DADADA]"
        type="submit"
        onClick={submitPapers}
      >
        Upload
      </Button>
    </div>
  );
}
