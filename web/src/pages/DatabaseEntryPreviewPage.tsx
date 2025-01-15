import { GPTResponse } from "../types/types";
import { useState } from "react";
import EntryGallery from "../components/database-entries/entry-gallery";
import { Button } from "@nextui-org/react";
import { useLocation, useNavigate } from "react-router-dom";

export default function DatabaseEntryPreviewPage() {
  // console.log(resp);
  const navigate = useNavigate();
  const location = useLocation();
  console.log(location.state.resp);
  const [databaseEntries] = useState<GPTResponse[]>(location.state.resp ?? []);

  const navigateToUpload = () => {
    navigate("/upload");
  };

  return (
    <div className="flex flex-col items-center h-full">
      <div className="bg-[#F4F4F4] w-[70%]">
        <div>
          <div className="py-[4%] text-4xl text-slate-900">
            Modify Paper Data
          </div>
          <div className="w-full h-8 bg-[#D4D4D4] drop-shadow-md"></div>
        </div>
        <div className="">
          <div className="overflow-y-scroll max-h-screen">
            <EntryGallery entries={databaseEntries} />
          </div>
        </div>
      </div>
      {/* footer */}
      <div className="sticky end-0 bg-[#F4F4F4] flex flex-row-reverse z-40 w-full h-auto gap-2 p-3">
        <Button>Submit</Button>
        <Button onClick={navigateToUpload}>Cancel</Button>
      </div>
    </div>
  );
}
