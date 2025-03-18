import { useEffect, useState } from "react";
import { FullDataType } from "../types/types";
import PaperSliver from "./paper-sliver";

type PaperGalleryProps = {
  papers: FullDataType[];
};

export default function PaperGallery({ papers }: PaperGalleryProps) {
  const [paperAreaHeight, setPaperAreaHeight] = useState<number>(
    window.innerHeight - 200 - 65
  ); //Default? random number choice

  const updateDimensions = () => {
    setPaperAreaHeight(window.innerHeight - 200 - 65); // 200 for header, 65 for navbar
  };

  useEffect(() => {
    // Set initial height and listen for resize events
    updateDimensions();
    window.addEventListener("resize", updateDimensions);

    return () => {
      // Cleanup event listener on unmount
      window.removeEventListener("resize", updateDimensions);
    };
  }, []);

  return (
    <div
      className="overflow-y-scroll "
      style={{
        height: paperAreaHeight - 30,
      }}
    >
      {papers.map((paper: FullDataType, index: number) => (
        <PaperSliver paper={paper} index={index} key={index} />
      ))}
    </div>
  );
}
