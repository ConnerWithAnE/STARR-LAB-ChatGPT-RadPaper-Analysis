import { GPTResponse } from "../types/types";
import { useState } from "react";
import EntryGallery from "../components/database-entries/entry-gallery";
import { Button } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import { useData } from "../DataContext";

export default function DatabaseEntryPreviewPage() {
  const { data, tableData } = useData();
  console.log(data);
  const navigate = useNavigate();

  const navigateToUpload = () => {
    navigate("/upload");
  };

  const checkEntries = () => {
    console.log("entries", tableData);
  };

  return (
    <div className="flex flex-col items-center h-screen pt-[65px]">
      <div className="bg-[#F4F4F4] w-[70%] h-full">
        <div>
          <div className="py-[4%] text-4xl text-slate-900">
            Modify Paper Data
          </div>
          <div className="w-full h-8 bg-[#D4D4D4] drop-shadow-md"></div>
        </div>
        <div className="">
          <div className="overflow-y-scroll max-h-full">
            <EntryGallery entries={data} />
          </div>
        </div>
      </div>
      {/* footer */}
      <div className="fixed bottom-0 end-0 bg-[#F4F4F4] flex flex-row-reverse z-40 w-full h-auto gap-2 p-3">
        <Button onClick={checkEntries}>Submit</Button>
        <Button onClick={navigateToUpload}>Cancel</Button>
      </div>
    </div>
  );
}
