import "../App.css";
import { HiOutlineX } from "react-icons/hi";

// TempPaperData is for testing only
type UploadSliverProp = {
    file: File;
    index: number;
    cancel: () => void;
};

export default function UploadPageSliver({
    file,
    index,
    cancel,
}: UploadSliverProp) {
    return (
        <div
            className={`${
                index % 2 ? "bg-[#EEEEEE]" : "bg-[#DADADA]"
            } grid grid-cols-6 p-[2%]`}
        >
            {/* File name*/}
            <div className="col-span-5 flex items-center">
                <div className="text-md text-[#343434]">{file.name}</div>
            </div>

            {/* X to remove file alongside hover tooltip */}
            <div className="col-span-1 flex items-center justify-end relative">
                <button
                    onClick={cancel}
                    className="bg-transparent p-0 border-none flex items-center justify-center group"
                >
                    <HiOutlineX className="text-[#343434]" size={30} />

                    
                    <span className="absolute left-0 -translate-x-50 bg-[#444444] text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        Remove File
                    </span>
                </button>
            </div>
        </div>
    );
}
