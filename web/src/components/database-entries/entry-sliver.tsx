import {
  Severity,
  Conflict,
  GPTResponse2,
  FullDataType,
  AuthorData,
} from "../../types/types";
import {
  Modal,
  ModalContent,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Button,
  ModalHeader,
} from "@nextui-org/react";
import EditEntry from "../../pages/edit-entry";
import { useEffect, useRef, useState } from "react";
import { useForm } from "../../DataContext";
import { HiCheckCircle } from "react-icons/hi2";
import { HiExclamationTriangle } from "react-icons/hi2";
import { HiExclamationCircle } from "react-icons/hi2";
import { createPartEntries } from "../../compare-passes/compare-passes";

type EntrySliverProp = {
  gptPass: GPTResponse2;
  index: number;
  onHandleDeleteChange: (index: number) => void;
};

export default function EntrySliver({
  gptPass,
  index,
  onHandleDeleteChange,
}: EntrySliverProp) {
  // for the edit-entry modal
  const { onOpenChange } = useDisclosure();
  const [open, setOpen] = useState(false);

  // for the cancel edit entry modal
  const [openCancelModal, setOpenCancelModal] = useState(false);

  // for modifying entries
  const { addEntry, updateEntry, tableEntries, setRedConflict } = useForm();

  // this state prop is to handle modifying the individual entry before updating the overall form
  const [editedEntry, setEditedEntry] = useState<FullDataType>(() => {
    const savedEntry = tableEntries[index];
    if (savedEntry) {
      return savedEntry;
    } else {
      return { id: index } as FullDataType;
    }
  });
  const [authors, setAuthors] = useState<AuthorData[]>(
    tableEntries[index]?.authors ?? []
  );

  useEffect(() => {
    // To reset editedEntries if a paper was deleted from /upload/edit
    const newentry = tableEntries[index];
    if (newentry) {
      return setEditedEntry(newentry);
    } else {
      setEditedEntry({ id: index } as FullDataType);
    }
  }, [tableEntries]);

  // React's strict mode makes every callback run twice. This is to prevent that
  const hasRun = useRef(false);

  //   const [papers] = useState<PaperData[]>(paperData ?? []); will be expanded upon when we get to editing existing database entries
  const [passes] = useState<GPTResponse2>(gptPass ?? ({} as GPTResponse2));
  const [unresolvedConflicts, setUnresolvedConflicts] = useState<Conflict>({
    yellowSeverity: [],
    redSeverity: [],
  });

  useEffect(() => {
    if (hasRun.current) return; // Prevent duplicate execution
    hasRun.current = true;
    let updatedEntry = { ...editedEntry };
    const updatedConflicts = {
      yellowSeverity: [...unresolvedConflicts.yellowSeverity],
      redSeverity: [...unresolvedConflicts.redSeverity],
    };

    const addConflict2 = (
      currentConflicts: Conflict,
      dataType: string,
      severity: Severity
    ) => {
      switch (severity) {
        case 1:
          currentConflicts.yellowSeverity.push(dataType);
          break;
        case 2:
          currentConflicts.redSeverity.push(dataType);
          break;
      }
    };

    //console.log("passes", passes);

    Object.entries(passes.pass_1).map(([key]) => {
      type fullDataTypeKey = keyof typeof passes.pass_1;
      const typesafeKey = key as fullDataTypeKey;
      let pass_1 = passes.pass_1[typesafeKey];
      let pass_2 = passes.pass_2[typesafeKey];
      let pass_3 = passes.pass_3[typesafeKey];

      // if the entry has already been edited, it should bypass this process completely
      if (editedEntry[typesafeKey] !== undefined) {
        return;
      }

      if (typesafeKey === "authors") {
        pass_1 = JSON.stringify(pass_1);
        pass_2 = JSON.stringify(pass_2);
        pass_3 = JSON.stringify(pass_3);
      }
      if (typesafeKey === "parts") {
        if (
          Array.isArray(pass_1) &&
          Array.isArray(pass_2) &&
          Array.isArray(pass_3)
        ) {
          const updatedParts = createPartEntries(
            updatedEntry.parts ?? [],
            pass_1,
            pass_2,
            pass_3
          );
          updatedEntry = {
            ...updatedEntry,
            parts: updatedParts,
          };
          return;
        }
      }

      // if all 3 entries are equal, enter the first one since it doesn't matter which one is set
      if (pass_1 === pass_2 && pass_1 === pass_3 && pass_2 === pass_3) {
        updatedEntry = {
          ...updatedEntry,
          [typesafeKey]: passes.pass_1[typesafeKey],
        };
        console.log("updatedEntry", updatedEntry);
      }
      // if only 2 out of 3 entries are equal
      else if (pass_1 === pass_2 || pass_1 === pass_3) {
        updatedEntry = {
          ...updatedEntry,
          [typesafeKey]: passes.pass_1[typesafeKey],
        };
        addConflict2(updatedConflicts, key, 1);
      } else if (pass_2 === pass_3) {
        updatedEntry = {
          ...updatedEntry,
          [typesafeKey]: passes.pass_2[typesafeKey],
        };
        addConflict2(updatedConflicts, key, 1);
      } else {
        addConflict2(updatedConflicts, key, 2);
      }
    });

    console.log("updatedEntry", updatedEntry);

    setEditedEntry(updatedEntry);
    setAuthors(() => [...(updatedEntry.authors ?? [])]);
    addEntry(updatedEntry);
    setUnresolvedConflicts(updatedConflicts);
    if (updatedConflicts.redSeverity.length > 0) {
      setRedConflict(index, updatedConflicts.redSeverity);
    }

    // this is to handle cases where an entry has not been added to the overall list of edited entries
    // if (!hasEmptyProperty(editedEntry)) {
    //   addEntry(updatedEntry);
    // }
  }, []);

  const handleCancel = () => {
    setEditedEntry({
      paper_name: editedEntry.name,
      author: editedEntry.authors ?? [],
    } as FullDataType);
    setOpen(false);
    setOpenCancelModal(false);
  };

  const handleOpenCancelModal = () => {
    setOpenCancelModal(true);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleSave = () => {
    updateEntry(index, editedEntry);
    setAuthors((prev) =>
      prev.map((author, i) => ({
        ...author,
        name: editedEntry?.authors?.[i]?.name ?? author.name,
      }))
    );

    console.log("editedEntry in handleSave", editedEntry);
    const updatedConflicts: Conflict = {
      yellowSeverity: [],
      redSeverity: [],
    };
    Object.entries(editedEntry).forEach(([key, value]) => {
      if (typeof value === "string") {
        if (value.toString() === "") {
          updatedConflicts.redSeverity.push(key);
        }
      } else if (typeof value === "number") {
        if (isNaN(value)) {
          updatedConflicts.redSeverity.push(key);
        }
      } else {
        if (value.length === 0) {
          updatedConflicts.redSeverity.push(key);
        }
      }
    });
    console.log("updatedConflicts", updatedConflicts);
    setRedConflict(index, updatedConflicts.redSeverity);
    setUnresolvedConflicts(updatedConflicts);

    setOpen(false);
  };

  return (
    <div
      className={`${
        index % 2 ? "bg-[#DADADA]" : "bg-[#EEEEEE]"
      } grid grid-cols-6 justify-between p-[3%]`}
    >
      <div className="col-span-1">
        <div className="text-md text-slate-900">{index}.</div>
      </div>
      <div className="col-span-3">
        <div className="text-left text-lg text-slate-900">
          {editedEntry.name}
        </div>
        <div className="text-xs text-left text-slate-900">
          {authors?.map((author) => (author.name ? author.name + ", " : ""))}
        </div>
      </div>
      <div className="col-span-2 flex flex-col gap-2">
        <div>
          <div>
            {unresolvedConflicts.redSeverity.length > 0 ? (
              <>
                <div className="text-left text-slate-900">
                  <div className="flex flex-row gap-2">
                    <HiExclamationCircle color="#FF4542" size="1.5em" /> Review
                    Required
                  </div>
                </div>
              </>
            ) : (
              <></>
            )}
          </div>
          <div>
            {unresolvedConflicts.redSeverity.length === 0 &&
            unresolvedConflicts.yellowSeverity.length > 0 ? (
              <>
                <div className="text-left text-slate-900">
                  <div className="flex flex-row gap-2">
                    <HiExclamationTriangle color="#fdc700" size="1.5em" />
                    Review Recommended
                  </div>
                </div>
              </>
            ) : (
              <></>
            )}
          </div>
          <div>
            {unresolvedConflicts.redSeverity.length === 0 &&
            unresolvedConflicts.yellowSeverity.length === 0 ? (
              <>
                <div className="text-left text-slate-900">
                  <div className="flex flex-row gap-2">
                    <HiCheckCircle color="green" size="1.5em" /> No Problems
                  </div>
                </div>
              </>
            ) : (
              <></>
            )}
          </div>
        </div>
        <div className="flex flex-row justify-end gap-2">
          <Button
            className="bg-[#ff5353] text-white rounded-md"
            size="md"
            onClick={() => onHandleDeleteChange(index)}
          >
            Delete
          </Button>
          <Button
            className="bg-usask-green text-[#DADADA] rounded-md"
            size="md"
            onClick={handleOpen}
          >
            Review
          </Button>
        </div>
      </div>

      {/* edit-entry modal */}
      <Modal
        isOpen={open}
        onOpenChange={onOpenChange}
        size="full"
        scrollBehavior="inside"
        hideCloseButton={true}
      >
        <ModalContent>
          {() => {
            return (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  {editedEntry?.name ?? ""}
                </ModalHeader>
                <ModalBody>
                  <EditEntry
                    entryData={gptPass ?? {}}
                    editedEntry={editedEntry}
                    setEditedEntry={setEditedEntry}
                    unresolvedConflicts={unresolvedConflicts}
                  ></EditEntry>
                </ModalBody>
                <ModalFooter>
                  <Button
                    className="bg-[#ff5353] text-white rounded-md"
                    onPress={handleOpenCancelModal}
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

      {/* cancel edit modal */}
      <Modal isOpen={openCancelModal} hideCloseButton={true}>
        <ModalContent>
          {() => (
            <>
              <ModalBody>
                <div className="flex flex-col gap-4 text-center p-4">
                  <h2>Discard changes?</h2>
                  <p>All changes to this entry will be discarded.</p>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button
                  className="bg-[#ff5353] text-white"
                  onPress={handleCancel}
                >
                  Yes
                </Button>
                <Button
                  className="bg-usask-green text-[#DADADA]"
                  onPress={() => setOpenCancelModal(false)}
                >
                  No
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
