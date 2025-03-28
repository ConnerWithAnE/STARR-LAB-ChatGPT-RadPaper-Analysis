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
import { Spinner } from "@nextui-org/react";

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
    removeRedConflict,
    removeConflict,
  } = useForm();

  const { onOpenChange } = useDisclosure();
  const [disabled, setDisabled] = useState(false);
  // for the exit modal
  const [isOpen, setIsOpen] = useState(false);
  const [confirmExit, setConfirmExit] = useState(false);

  const [loading, setLoading] = useState(false);
  const [passData, setPassData] = useState(data); // need this hook so that GPTpasses persist between renders
  setInitialGPTPasses(passData);
  initialGPTPasses.forEach((entry) => {
    const lengths = [entry.pass_1.parts?.length, entry.pass_2.parts?.length, entry.pass_3.parts?.length];
    const minLength = Math.min(...lengths.filter(length => length !== undefined && length !== null));
    entry.pass_1.parts = entry.pass_1.parts?.slice(0, minLength);
    entry.pass_2.parts = entry.pass_2.parts?.slice(0, minLength);
    entry.pass_3.parts = entry.pass_3.parts?.slice(0, minLength);
  });

  useEffect(() => {
    let disabled = false;
    redConflicts.map((value) => {
      if (value.fields.length > 0) {
        disabled = true;
        return;
      }
    });
    if (disabled) {
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

  async function submitToDatabase() {
    const token = localStorage.getItem("jwtToken");

    // if (!token) {
    //   console.error("No token found. Please log in.");
    //   return;
    // }

    // console.log("tableEntries", tableEntries);

    // const test = JSON.stringify(tableEntries);
    // console.log("stringified tableEntries", test);
    setLoading(true);
    try {
      const response = await fetch(
        "/api/adminRequest/papers/full",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(tableEntries),
        }
      );

      if (response.ok) {
        console.log(`Successfully added entries`);
        alert("Successfully added entries");
        navigate("/upload");
        return;
      } else {
        console.error(`Failed to insert entries: ${response.body}`);
        return;
      }
    } catch (error) {
      console.error(`Error inserting entries, `, error);
      return;
    } finally {
      setLoading(false);
    }
  }

  const [paperAreaHeight, setPaperAreaHeight] = useState<number>(
    window.innerHeight - 200 - 30
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
    removeRedConflict(index);
    removeConflict(index);

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
    <div className="flex flex-col items-center bg">
      <div className="bg-[#F4F4F4] w-[70%]">
        <div>
          <div className="py-[4%] text-4xl text-slate-900">
            Modify Paper Data
          </div>
          <div className="w-full h-8 bg-[#D4D4D4] drop-shadow-md"></div>
        </div>
        <div className="">
          <div
            className="overflow-y-scroll h-[90%] max-h-full grow"
            style={{
              height: paperAreaHeight,
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
      {/* footer */}
      <div className="fixed bottom-0 end-0 bg-[#F4F4F4] flex flex-row-reverse z-40 w-full  gap-2 p-3">
        <Button
          className="bg-usask-green text-white rounded-md"
          isDisabled={disabled || loading}
          onClick={submitToDatabase}
        >
          {loading ? <Spinner color="white" /> : "Submit"}
        </Button>
        <Button
          className="bg-[#ff5353] text-white rounded-md"
          type="submit"
          isDisabled={loading}
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
