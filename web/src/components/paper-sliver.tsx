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
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

// TempPaperData is for testing only
type PaperSliverProp = {
  paper: FullDataType;
  index: number;
  refreshPapers: () => void;
};

export default function PaperSliver({
  paper,
  index,
  refreshPapers,
}: PaperSliverProp) {
  const [open, setIsOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [editedFields, setEditedFields] = useState<FullDataType>({});
  const [paperData, setPaperData] = useState<FullDataType>(paper);

  // React's strict mode makes every callback run twice. This is to prevent that
  const hasRun = useRef(false);

  useEffect(() => {
    console.log("paperData", paperData);
    console.log("editedFields", editedFields);
    if (hasRun.current) return; // Prevent duplicate execution
    hasRun.current = true;
  }, []);

  useEffect(() => {
    console.log("Recomputing editedFields...");
    const edited = getEditedFields(paper, paperData);
    setEditedFields(edited);
  }, [paperData, paper]);

  const getEditedFields = (
    original: FullDataType,
    updated: FullDataType
  ): FullDataType => {
    const edited: FullDataType = { id: original.id };

    Object.entries(updated).forEach(([key, value]) => {
      const originalValue = original[key as keyof FullDataType];

      // Handle nested arrays (e.g., authors, parts)
      if (key === "authors" || key === "parts") {
        if (Array.isArray(value) && Array.isArray(originalValue)) {
          const editedArray = value
            .map((item, index) => {
              const originalItem = originalValue[index];

              // Compare individual fields in the object
              const editedItem: Partial<typeof item> = {};
              Object.entries(item).forEach(([fieldKey, fieldValue]) => {
                if (
                  JSON.stringify(fieldValue) !==
                  JSON.stringify(originalItem?.[fieldKey as keyof typeof item])
                ) {
                  // Handle nested arrays in parts (e.g., sees, dds, tids)
                  if (
                    fieldKey === "sees" ||
                    fieldKey === "dds" ||
                    fieldKey === "tids"
                  ) {
                    if (
                      Array.isArray(fieldValue) &&
                      Array.isArray(originalItem?.[fieldKey])
                    ) {
                      const nestedEditedArray = fieldValue
                        .map((nestedItem, nestedIndex) => {
                          const originalNestedItem =
                            originalItem[fieldKey][nestedIndex];

                          // Compare individual fields in the nested array
                          const nestedEditedItem: Partial<typeof nestedItem> =
                            {};
                          Object.entries(nestedItem).forEach(
                            ([nestedKey, nestedValue]) => {
                              if (
                                JSON.stringify(nestedValue) !==
                                JSON.stringify(
                                  originalNestedItem?.[
                                    nestedKey as keyof typeof nestedItem
                                  ]
                                )
                              ) {
                                nestedEditedItem[
                                  nestedKey as keyof typeof nestedItem
                                ] = nestedValue;
                              }
                            }
                          );

                          // Only include the nested item if it has changes
                          return Object.keys(nestedEditedItem).length > 0
                            ? { id: nestedItem.id, ...nestedEditedItem }
                            : null;
                        })
                        .filter((nestedItem) => nestedItem !== null); // Remove null values

                      if (nestedEditedArray.length > 0) {
                        editedItem[fieldKey as keyof typeof item] =
                          nestedEditedArray;
                      }
                    }
                  } else {
                    // Handle non-nested fields
                    editedItem[fieldKey as keyof typeof item] = fieldValue;
                  }
                }
              });

              // Only include the item if it has changes
              return Object.keys(editedItem).length > 0
                ? { id: item.id, ...editedItem }
                : null;
            })
            .filter((item) => item !== null); // Remove null values

          if (editedArray.length > 0) {
            edited[key as keyof FullDataType] = editedArray;
          }
        }
      }
      // Handle primitive values or objects
      else if (JSON.stringify(value) !== JSON.stringify(originalValue)) {
        edited[key as keyof FullDataType] = value;
      }
    });

    return edited;
  };

  const fetchPaperData = async () => {
    const token = localStorage.getItem("jwtToken");

    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:3000/api/adminRequest/papers/full/${paperData.id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data: FullDataType = await response.json();
        console.log("Fetched Data:", data);
        setPaperData(data); // Store the fetched data
        setIsOpen(true); // Open the modal
      } else {
        console.error(`Failed to fetch paper data: ${response.status}`);
      }
    } catch (error) {
      console.error("Error fetching paper data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    const token = localStorage.getItem("jwtToken");

    // if (!token) {
    //   console.error("No token found. Please log in.");
    //   return;
    // }

    console.log("editedFields", editedFields);
    console.log("id", paperData.id);
    console.log("paperData", paperData);

    setLoading(true);

    try {
      const response = await fetch(
        `http://localhost:3000/api/adminRequest/papers/full/${paperData.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(editedFields),
        }
      );

      if (response.ok) {
        console.log(
          `Successfully modified entry: ${JSON.stringify(editedFields)}`
        );
        alert("Successfully modified entry");

        setIsOpen(false);
        refreshPapers();
      } else {
        console.error(
          `Failed to insert entry: ${JSON.stringify(editedFields)}, Status: ${
            response.status
          }`
        );
      }
    } catch (error) {
      console.error(
        `Error inserting entry: ${JSON.stringify(editedFields)}`,
        error
      );
      return { success: false, error };
    } finally {
      setEditedFields(() => ({}));
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    const token = localStorage.getItem("jwtToken");

    // if (!token) {
    //   console.error("No token found. Please log in.");
    //   return;
    // }

    setLoading(true);

    try {
      const response = await fetch(
        `http://localhost:3000/api/adminRequest/papers/${paperData.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        console.log(`Successfully deleted entry with ID: ${paperData.id}`);
        alert("Successfully deleted entry with ID: " + paperData.id);
        setIsOpen(false);
        refreshPapers();
      } else {
        console.error(
          `Failed to insert entry: ${JSON.stringify(editedFields)}, Status: ${
            response.status
          }`
        );
      }
    } catch (error) {
      console.error(
        `Error inserting entry: ${JSON.stringify(editedFields)}`,
        error
      );
      return { success: false, error };
    } finally {
      setEditedFields(() => ({}));
      setLoading(false);
    }
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
      <div className="col-span-2 flex items-center justify-center gap-2">
        <Button
          className="bg-[#ff5353] text-white"
          size="lg"
          onClick={handleDelete}
        >
          Delete Entry
        </Button>
        <Button
          className="bg-usask-green text-white"
          size="lg"
          onClick={fetchPaperData}
        >
          Modify Entry
        </Button>
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
                    editedEntry={paperData}
                    setEditedEntry={setPaperData}
                    showPasses={false}
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
