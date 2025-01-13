import { use } from "framer-motion/client";
import PaperGallery from "../components/paper-gallery";
import { GPTResponse } from "../types/types";
import { useState } from "react";

export type DatabaseEntries = {
  resp: GPTResponse[];
};

export default function DatabaseEntryPreviewPage({ resp }: DatabaseEntries) {
  const [databaseEntries] = useState<GPTResponse[]>(resp);

  return (
    <div className="flex flex-col items-center h-full">
      <div className="bg-[#F4F4F4] w-[70%]">
        <div>
          <div className="py-[4%] text-4xl">Modify Paper Data</div>
          <div className="w-full h-8 bg-[#D4D4D4] drop-shadow-md"></div>
        </div>
        <div className="">
          <div className="overflow-y-scroll max-h-screen">
            <PaperGallery papers={papers} />
          </div>
        </div>
      </div>
    </div>
  );
}
