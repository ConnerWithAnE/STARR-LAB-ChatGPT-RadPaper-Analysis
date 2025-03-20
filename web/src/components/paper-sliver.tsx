import "../App.css";
import { FullDataType } from "../types/types";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import EditEntry from "../pages/edit-entry";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// TempPaperData is for testing only
type PaperSliverProp = {
  paper: FullDataType;
  index: number;
};

export default function PaperSliver({ paper, index }: PaperSliverProp) {
  const [open, setIsOpen] = useState<boolean>(false);
  const [paperData, setPaperData] = useState<FullDataType>(paper);
  const navigate = useNavigate();

  const handleSave = async () => {
    const token = localStorage.getItem("jwtToken");

    // if (!token) {
    //   console.error("No token found. Please log in.");
    //   return;
    // }

    try {
      const response = await fetch(
        "http://localhost:3000/api/adminRequest/papers/full",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(paperData),
        }
      );

      if (response.ok) {
        console.log(`Successfully modified entry: ${JSON.stringify(paperData)}`);
        setIsOpen(false);
        navigate("/modify");
      } else {
        console.error(
          `Failed to insert entry: ${JSON.stringify(paperData)}, Status: ${
            response.status
          }`
        );
      }
    } catch (error) {
      console.error(
        `Error inserting entry: ${JSON.stringify(paperData)}`,
        error
      );
      return { success: false, error };
    }
  };

  return (
    <div
      className={`${
        index % 2 ? "bg-[#DADADA]" : "bg-[#EEEEEE]"
      } grid grid-cols-6 justify-between p-[3%]`}
    >
      <div className="col-span-1">
        <div className="text-md">{index}.</div>
      </div>
      <div className="col-span-3">
        <div className="text-left text-lg">{paper.name}</div>
        <div className="text-xs text-left">
          {paper.authors?.map((author) =>
            author?.name ? author.name + ", " : ""
          )}
        </div>
      </div>
      <div className="col-span-2 flex items-center justify-center">
        <button
          className="bg-usask-green text-[#DADADA]"
          onClick={() => {
            setIsOpen(true);
          }}
        >
          Modify Entry
        </button>
      </div>

      {/* edit-entry modal */}
      <Modal
        isOpen={open}
        size="full"
        scrollBehavior="inside"
        hideCloseButton={true}
      >
        <ModalContent>
          {() => {
            return (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  {paper?.name ?? ""}
                </ModalHeader>
                <ModalBody>
                  <EditEntry
                    editedEntry={paper}
                    setEditedEntry={setPaperData}
                  ></EditEntry>
                </ModalBody>
                <ModalFooter>
                  <Button
                    className="bg-[#ff5353] text-white rounded-md"
                    onPress={() => {
                      setIsOpen(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="bg-usask-green text-[#DADADA]"
                    onPress={handleSave}
                  >
                    Save
                  </Button>
                </ModalFooter>
              </>
            );
          }}
        </ModalContent>
      </Modal>
    </div>
  );
}
