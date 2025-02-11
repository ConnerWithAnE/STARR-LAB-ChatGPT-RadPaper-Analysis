import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react";
import { useLocation, useNavigate } from "react-router-dom";
import { GPTResponse } from "../types/types";
import { useEffect, useState } from "react";
import EntrySliver from "../components/database-entries/entry-sliver";
import { useForm } from "../DataContext";

export default function DatabaseEntryPreviewPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const data = location.state.resp;

  const { initialGPTPasses, setInitialGPTPasses, tableEntries, removeEntry, removePass } = useForm();

  const { onOpenChange } = useDisclosure();
  // for the exit modal
  const [isOpen, setIsOpen] = useState(false);
  const [confirmExit, setConfirmExit] = useState(false);
  const [passData, setPassData] = useState(data);
  console.log("Setting data...")
  setInitialGPTPasses(passData);
  console.log("SetData: ", passData);

  //const [gptPasses, setGPTPasses] = useState<GPTResponse[]>(data ?? []);
  //const [editedEntries, setEditedEntries] = useState<UpdateData[]>([]);

  // const handleSave = (index: number, tableData: UpdateData) => {
  //   // setEditedEntries((prevData) => {
  //   //   const updatedData = [...prevData];
  //   //   updatedData[index] = tableData;
  //   //   return updatedData;
  //   // });
  // };

  useEffect(() => {
    if (confirmExit) {
      navigate("/upload");
    }
  }, [confirmExit]);

  const handleExit = () => {
    setIsOpen(true);
  };

  const stayOnPage = () => {
    setIsOpen(false);
  };

  const exit = () => {
    setConfirmExit(true);
  };

  const checkEntries = () => {
    console.log("entries", tableEntries);
  };

  const [paperAreaHeight, setPaperAreaHeight] = useState<number>(
    window.innerHeight - 200 - 65
  ); //Default? random number choice

  const updateDimensions = () => {
    setPaperAreaHeight(window.innerHeight - 200 - 65); // 200 for header, 65 for navbar
  };

  // const hasRun = useRef(false);

  // useEffect(() => {
  //   if (hasRun.current) return; // Prevent duplicate execution
  // });

  const onHandleDeleteEntry = (index: number) => {
    console.log("delete", index);     // index is ROWID
    console.log("Data: ", passData)
    
    setPassData(removePass(index));
    setInitialGPTPasses(passData)
    removeEntry(index);
    // let data2 = location.state.resp;

    console.log("Updated data: ", passData)
    // console.log("Updated GPT passes: ", initialGPTPasses);
    console.log("Delete Done!")
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
          onClick={handleExit}
        >
          Cancel
        </Button>
      </div>

      <div>
        <Modal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          hideCloseButton={true}
        >
          <ModalContent>
            {() => (
              <>
                <ModalBody>
                  <div className="flex flex-col gap-4 text-center p-4">
                    <h2>Discard changes?</h2>
                    <p>All entries will be discarded.</p>
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button className="bg-[#ff5353] text-white" onPress={exit}>
                    Yes
                  </Button>
                  <Button
                    className="bg-usask-green text-[#DADADA]"
                    onPress={stayOnPage}
                  >
                    No
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
    </div>
  );
}
