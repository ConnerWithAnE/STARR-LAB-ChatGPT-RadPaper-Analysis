import { Link } from "react-router-dom";
import "../../App.css";
import { GPTResponse } from "../../types/types";

// TempPaperData is for testing only
type EntrySliverProp = {
  entry: GPTResponse;
  index: number;
};

export default function EntrySliver({ entry, index }: EntrySliverProp) {
  return (
    <div
      className={`${
        index % 2 ? "bg-[#DADADA]" : "bg-[#EEEEEE]"
      } grid grid-cols-6 justify-between p-[3%]`}
    >
      <div className="col-span-1">
        <div className="text-md text-slate-900">{index}.</div>
      </div>
      <div className="col-span-3">
        <div className="text-left text-lg text-slate-900">
          {entry.pass_1.paper_name}
        </div>
        <div className="text-xs text-left text-slate-900">
          {entry.pass_1.author}
        </div>
      </div>
      <div className="col-span-2 flex items-center justify-center">
        <Link to="/edit-entry" state={{ entryData: entry }}>
          <button className="bg-usask-green text-[#DADADA]">
            Modify Entry
          </button>
        </Link>
      </div>
    </div>
  );
}
