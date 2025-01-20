import { useEffect, useState } from "react";
import { GPTResponse } from "../../types/types";
import EntrySliver from "./entry-sliver";
import { useData } from "../../DataContext";

type EntryGalleryProps = {
  entries: GPTResponse[];
};

export default function EntryGallery({ entries }: EntryGalleryProps) {
  const [paperAreaHeight, setPaperAreaHeight] = useState<number>(
    window.innerHeight - 200 - 65
  ); //Default? random number choice
  const [databaseEntries, setDatabaseEntries] = useState<GPTResponse[]>(
    entries ?? []
  );
  const { data, setData } = useData();

  const updateDimensions = () => {
    setPaperAreaHeight(window.innerHeight - 200 - 65); // 200 for header, 65 for navbar
  };

  const onHandleDeleteEntry = (entry: GPTResponse) => {
    const newData = data.filter((item) => item !== entry);
    setData(newData);
  };

  const onHandleSubmitEntry = (index: number, entry: GPTResponse) => {
    setDatabaseEntries((prevItems) => {
      const newEntries = [...prevItems];
      newEntries[index] = entry;
      return newEntries;
    });
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
      {databaseEntries.map((entry: GPTResponse, index: number) => (
        <EntrySliver
          entry={entry}
          index={index}
          key={index}
          onHandleDeleteChange={onHandleDeleteEntry}
        />
      ))}
    </div>
  );
}
