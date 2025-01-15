import { Link } from "react-router-dom";
import "../App.css";
import { PaperData } from "../types/types";

// TempPaperData is for testing only
type PaperSliverProp = {
  paper: PaperData;
  index: number;
};

export default function PaperSliver({ paper, index }: PaperSliverProp) {
  return (
    <div
      className={`${
        index % 2 ? "bg-[#DADADA]" : "bg-[#EEEEEE]"
      } grid grid-cols-6 justify-between p-[3%]`}
    >
      <div className="col-span-1">
        <div className="text-md">{paper.id}.</div>
      </div>
      <div className="col-span-3">
        <div className="text-left text-lg">{paper.paper_name}</div>
        <div className="text-xs text-left">{paper.author}</div>
      </div>
      <div className="col-span-2 flex items-center justify-center">
        <Link to="/upload/edit-entry" state={{ paperData: paper }}>
          <button className="bg-usask-green text-[#DADADA]">
            Modify Entry
          </button>
        </Link>
      </div>
    </div>
  );
}
