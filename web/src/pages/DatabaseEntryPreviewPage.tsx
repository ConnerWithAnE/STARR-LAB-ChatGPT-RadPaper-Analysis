import { Button } from "@nextui-org/react";
import { useLocation, useNavigate } from "react-router-dom";
import { GPTResponse, UpdateData } from "../types/types";
import { useEffect, useState } from "react";
import EntrySliver from "../components/database-entries/entry-sliver";
import { useForm } from "../DataContext";

export default function DatabaseEntryPreviewPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const data = location.state.resp;

  const { initialGPTPasses, setInitialGPTPasses } = useForm();
  setInitialGPTPasses(data);

  //const [gptPasses, setGPTPasses] = useState<GPTResponse[]>(data ?? []);
  const [editedEntries, setEditedEntries] = useState<UpdateData[]>([]);

  const handleSave = (index: number, tableData: UpdateData) => {
    // setEditedEntries((prevData) => {
    //   const updatedData = [...prevData];
    //   updatedData[index] = tableData;
    //   return updatedData;
    // });
  };

  const navigateToUpload = () => {
    navigate("/upload");
  };

  const checkEntries = () => {
    console.log("entries", editedEntries);
  };

  const [paperAreaHeight, setPaperAreaHeight] = useState<number>(
    window.innerHeight - 200 - 65
  ); //Default? random number choice

  const updateDimensions = () => {
    setPaperAreaHeight(window.innerHeight - 200 - 65); // 200 for header, 65 for navbar
  };

  const onHandleDeleteEntry = (index: number) => {
    // console.log("delete", index);
    // const entryToDelete = gptPasses[index];
    // const newData = gptPasses.filter((item) => item !== entryToDelete);
    // console.log("newData", newData);
    // setGPTPasses(newData);
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
            <div
              className="overflow-y-scroll"
              style={{
                height: paperAreaHeight - 30,
              }}
            >
              {initialGPTPasses.map((entry: GPTResponse, index: number) => (
                <EntrySliver
                  gptPass={entry}
                  index={index}
                  onHandleDeleteChange={onHandleDeleteEntry}
                />
              ))}
            </div>
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
