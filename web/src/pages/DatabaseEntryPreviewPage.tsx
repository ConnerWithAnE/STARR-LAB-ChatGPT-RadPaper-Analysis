import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react";
import { useLocation, useNavigate } from "react-router-dom";
import { FullDataType, GPTResponse2 } from "../types/types";
import { useEffect, useState } from "react";
import EntrySliver from "../components/database-entries/entry-sliver";
import { useForm } from "../DataContext";

export default function DatabaseEntryPreviewPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const data = location.state.resp;

  const {
    initialGPTPasses,
    setInitialGPTPasses,
    tableEntries,
    removePass,
    removeEntry,
    redConflicts,
  } = useForm();

  const { onOpenChange } = useDisclosure();
  const [disabled, setDisabled] = useState(false);
  // for the exit modal
  const [isOpen, setIsOpen] = useState(false);
  const [confirmExit, setConfirmExit] = useState(false);
  const [passData, setPassData] = useState(data); // need this hook so that GPTpasses persist between renders
  setInitialGPTPasses(passData);

  const [gptPasses, setGPTPasses] = useState<GPTResponse2[]>(data ?? []);
  const [editedEntries, setEditedEntries] = useState<FullDataType[]>([]);

  const handleSave = (index: number, tableData: FullDataType) => {
    setEditedEntries((prevData) => {
      const updatedData = [...prevData];
      updatedData[index] = tableData;
      return updatedData;
    });
  };

  useEffect(() => {
    console.log("redConflicts", redConflicts);
    if (redConflicts.length > 0) {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  }, [redConflicts]);

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

  async function checkEntries() {
    // console.log("entries", tableEntries);
    // let insertPapers: InsertData[] = [];
    // // Check if all fields are filled out
    // tableEntries.forEach((entry) => {
    //   if (entry.paper_name === undefined || entry.author === undefined
    //       || entry.year === undefined || entry.part_no === undefined
    //       || entry.type === undefined || entry.manufacturer === undefined
    //       || entry.testing_location === undefined || entry.testing_type === undefined
    //       || entry.data_type === undefined) {
    //     alert("Please fill out all fields before submitting.");
    //     return;
    //   }
    //   // If they are filled then convert from UpdateData to InsertData
    //   else {
    //     let newEntry: InsertData = {
    //       paper_name: entry.paper_name,
    //       year: entry.year,
    //       author: entry.author,
    //       part_no: entry.part_no,
    //       type: entry.type,
    //       manufacturer: entry.manufacturer,
    //       testing_location: entry.testing_location,
    //       testing_type: entry.testing_type,
    //       data_type: entry.data_type,
    //     };
    //     insertPapers.push(newEntry);
    //   }
    // });
    // console.log("insertPapers", insertPapers);
    // Send to database
    // const token = localStorage.getItem("jwtToken");
    // try {
    //   const response = await fetch(
    //     "http://localhost:3000/api/adminRequest/insertPapers",
    //     {
    //       method: "POST",
    //       headers: {
    //         Authorization: `Bearer ${token}`,
    //       },
    //       body: JSON.stringify(insertPapers),
    //     }
    //   );
    //   if (response.ok) {
    //     alert("Papers successfully added to database.");
    //   }
    //   else {
    //     console.error(`Failed to insert papers: ${response.status}`);
    //   }
    // } catch (error) {
    //   console.error(`Error inserting papers: ${error}`);
    //   throw error;
    // }
  }

  const [paperAreaHeight, setPaperAreaHeight] = useState<number>(
    window.innerHeight - 200 - 65
  ); //Default? random number choice

  const updateDimensions = () => {
    setPaperAreaHeight(window.innerHeight - 200 - 65); // 200 for header, 65 for navbar
  };

  const onHandleDeleteEntry = (index: number) => {
    console.log("delete", index); // index is ROWID

    const updatePasses = removePass(index);
    setPassData(updatePasses);
    setInitialGPTPasses(passData);
    removeEntry(index);

    console.log("Delete Done!");
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
              {initialGPTPasses.map((entry: GPTResponse2, index: number) => (
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
          isDisabled={disabled}
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
