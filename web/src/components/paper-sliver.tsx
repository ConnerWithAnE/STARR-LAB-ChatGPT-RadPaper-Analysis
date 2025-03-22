import "../App.css";
import { FullDataType } from "../types/types";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
} from "@nextui-org/react";
import EditEntry from "../pages/edit-entry";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// TempPaperData is for testing only
type PaperSliverProp = {
  paper: FullDataType;
  index: number;
};

export default function PaperSliver({ paper, index }: PaperSliverProp) {
  const [open, setIsOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [editedFields, setEditedFields] = useState<string[]>(
    []);
  const [editedPaperData, setEditedPaperData] = useState<FullDataType>(
    paper);
  const [paperData, setPaperData] = useState<FullDataType>(paper);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("paperData", paperData);
  }, []);

  const handleSave = async () => {
    const token = localStorage.getItem("jwtToken");

    // if (!token) {
    //   console.error("No token found. Please log in.");
    //   return;
    // }

    //
    const editedData = editedFields.reduce((acc, path) => {
      const keys = path.split("-");
      let value = editedPaperData;
      for (const key of keys) {
        value = value[key];
      }

      let current = acc;
      for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        if (!current[key]) {
          current[key] = {};
        }
        current = current[key];
      }
      current[keys[keys.length - 1]] = value;

      return acc;
    }, {});

    console.log("editedData", editedData);
    console.log("id", paperData.id);
    console.log("paperData", paperData);

    // setLoading(true);

    // try {
    //   const response = await fetch(
    //     `http://localhost:3000/api/adminRequest/papers/${paperData.id}`,
    //     {
    //       method: "PUT",
    //       headers: {
    //         "Content-Type": "application/json",
    //         Authorization: `Bearer ${token}`,
    //       },
    //       body: JSON.stringify(paperData),
    //     }
    //   );

    //   if (response.ok) {
    //     console.log(
    //       `Successfully modified entry: ${JSON.stringify(paperData)}`
    //     );
    //     navigate("/modify");
    //   } else {
    //     console.error(
    //       `Failed to insert entry: ${JSON.stringify(paperData)}, Status: ${
    //         response.status
    //       }`
    //     );
    //   }
    // } catch (error) {
    //   console.error(
    //     `Error inserting entry: ${JSON.stringify(paperData)}`,
    //     error
    //   );
    //   return { success: false, error };
    // } finally {
    //   setLoading(false);
    //   setIsOpen(false);
    // }
  };

  return (
    <div
      className={`${
        index % 2 ? "bg-[#DADADA]" : "bg-[#EEEEEE]"
      } grid grid-cols-6 justify-between p-[3%]`}
    >
      <div className="col-span-1"></div>
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
                    setValuesEdited={setEditedFields}
                  ></EditEntry>
                </ModalBody>
                <ModalFooter>
                  <Button
                    className="bg-[#ff5353] text-white"
                    disabled={loading}
                    onClick={() => {
                      setIsOpen(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="bg-usask-green text-[#DADADA]"
                    onClick={handleSave}
                    disabled={loading}
                  >
                    {loading ? <Spinner color="white"></Spinner> : "Save"}
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
