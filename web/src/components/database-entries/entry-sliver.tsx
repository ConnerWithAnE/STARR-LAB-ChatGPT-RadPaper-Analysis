import { GPTResponse, hasEmptyProperty, UpdateData } from "../../types/types";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Button,
} from "@nextui-org/react";
import EditEntry, { Conflict } from "../../pages/edit-entry";
import { useEffect, useRef, useState } from "react";
import { MdWarningAmber } from "react-icons/md";
import { useForm } from "../../DataContext";

// TempPaperData is for testing only
type EntrySliverProp = {
  gptPass: GPTResponse;
  index: number;
  onHandleDeleteChange: (index: number) => void;
};

export default function EntrySliver({
  gptPass,
  index,
  onHandleDeleteChange,
}: EntrySliverProp) {
  // for the modal
  const { onOpenChange } = useDisclosure();
  const [open, setOpen] = useState(false);

  // for modifying entries
  const { addEntry, tableEntries } = useForm();
  // this state prop is to handle modifying the individual entry before updating the overall form
  const [editedEntry, setEditedEntry] = useState<UpdateData>(() => {
    const savedEntry = tableEntries[index];
    if (savedEntry) {
      return savedEntry;
    } else {
      return {} as UpdateData;
    }
  });
  // React's strict mode makes every callback run twice. This is to prevent that
  const hasRun = useRef(false);

  //   const [papers] = useState<PaperData[]>(paperData ?? []); will be expanded upon when we get to editing existing database entries
  const [passes] = useState<GPTResponse>(gptPass ?? ({} as GPTResponse));
  const [unresolvedConflicts, setUnresolvedConflicts] = useState<Conflict[]>(
    []
  );

  useEffect(() => {
    if (hasRun.current) return; // Prevent duplicate execution
    hasRun.current = true;

    const handleConflictAnalysis = (conflict: Conflict) => {
      setUnresolvedConflicts((prevUnresolvedConflicts) => {
        return [...prevUnresolvedConflicts, conflict];
      });
    };

    Object.entries(passes.pass_1).map(([key, _]) => {
      type GPTDataKey = keyof typeof passes.pass_1;
      const typesafeKey = key as GPTDataKey;
      let pass_1 = passes.pass_1[typesafeKey];
      let pass_2 = passes.pass_2[typesafeKey];
      let pass_3 = passes.pass_3[typesafeKey];

      // if the entry has already been edited, it should bypass this process completely
      if (editedEntry[typesafeKey] !== undefined) {
        return;
      }

      // join strings together in case of comparing authors
      if (
        Array.isArray(pass_1) &&
        Array.isArray(pass_2) &&
        Array.isArray(pass_3)
      ) {
        pass_1 = pass_1.join();
        pass_2 = pass_2.join();
        pass_3 = pass_3.join();
      }

      // if all 3 entries are equal, enter the first one since it doesn't matter which one is set
      if (pass_1 === pass_2 && pass_1 === pass_3 && pass_2 === pass_3) {
        setEditedEntry((prevState) => ({
          ...prevState,
          [typesafeKey]: passes.pass_1[typesafeKey],
        }));
        return;
      }
      // if only 2 out of 3 entries are equal
      else if (pass_1 === pass_2 || pass_1 === pass_3) {
        const conflict: Conflict = {
          severity: 1,
          dataType: key,
        };
        setEditedEntry((prevState) => ({
          ...prevState,
          [typesafeKey]: passes.pass_1[typesafeKey],
        }));
        handleConflictAnalysis(conflict);
      } else if (pass_2 === pass_3) {
        const conflict: Conflict = {
          severity: 1,
          dataType: key,
        };
        setEditedEntry((prevState) => ({
          ...prevState,
          [typesafeKey]: passes.pass_2[typesafeKey],
        }));
        handleConflictAnalysis(conflict);
      } else {
        const conflict: Conflict = {
          severity: 2,
          dataType: key,
        };
        handleConflictAnalysis(conflict);
      }
    });

    // this is to handle cases where an entry has not been added to the overall list of edited entries
    if (!hasEmptyProperty(editedEntry)) {
      addEntry(editedEntry);
    }
  }, [passes]);

  const handleCancel = () => {
    setEditedEntry({
      paper_name: editedEntry.paper_name,
      author: editedEntry.author,
    } as UpdateData);
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleSave = () => {
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
          {editedEntry.paper_name}
        </div>
        <div className="text-xs text-left text-slate-900">
          {editedEntry.author}
        </div>
      </div>
      <div className="col-span-2 flex flex-row items-center justify-center gap-2">
        <div>
          {unresolvedConflicts.map((conflict) => {
            return (
              <div className="text-xs text-left text-slate-900">
                {conflict.severity === 1 ? (
                  <MdWarningAmber color="yellow" size="1.5em" />
                ) : (
                  <MdWarningAmber color="red" size="1.5em" />
                )}
              </div>
            );
          })}
        </div>
        <button
          className="bg-usask-green text-[#DADADA]"
          onClick={() => onHandleDeleteChange(index)}
        >
          Delete Entry
        </button>
        <button className="bg-usask-green text-[#DADADA]" onClick={handleOpen}>
          Modify Entry
        </button>
      </div>

      <Modal
        isOpen={open}
        onOpenChange={onOpenChange}
        size="full"
        scrollBehavior="inside"
      >
        <ModalContent>
          {() => {
            return (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  {editedEntry.paper_name}
                </ModalHeader>
                <ModalBody>
                  <EditEntry
                    entryData={gptPass}
                    editedEntry={editedEntry}
                    setEditedEntry={setEditedEntry}
                    unresolvedConflicts={unresolvedConflicts}
                  ></EditEntry>
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={handleCancel}>
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
