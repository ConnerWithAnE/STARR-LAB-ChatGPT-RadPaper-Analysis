import EntryGallery from "../components/database-entries/entry-gallery";
import { Button } from "@nextui-org/react";
import { useLocation, useNavigate } from "react-router-dom";
import { UpdateData } from "../types/types";
import { useState } from "react";

export default function DatabaseEntryPreviewPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const data = location.state.resp;

  const [tableEntries, setTableEntries] = useState<UpdateData[]>([]);

  const navigateToUpload = () => {
    navigate("/upload");
  };

  const checkEntries = () => {
    console.log("entries", data);
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
        <Button
          className="bg-usask-green text-white rounded-md"
          onClick={checkEntries}
        >
          Submit
        </Button>
        <Button
          className="bg-[#ff5353] text-white rounded-md"
          type="submit"
          onClick={navigateToUpload}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}
