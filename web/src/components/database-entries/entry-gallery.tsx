import { useEffect, useState } from "react";
import { GPTResponse } from "../../types/types";
import EntrySliver from "./entry-sliver";

type EntryGalleryProps = {
  entries: GPTResponse[];
};

export default function EntryGallery({ entries }: EntryGalleryProps) {
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
      className="overflow-y-scroll"
      style={{
        height: paperAreaHeight - 30,
      }}
    >
      {entries.map((entry: GPTResponse, index: number) => (
        <EntrySliver entry={entry} index={index} key={index} />
      ))}
    </div>
  );
}
