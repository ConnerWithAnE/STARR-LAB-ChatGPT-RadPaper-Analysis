import { GPTResponse, UpdateData } from "../../types/types";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Button,
} from "@nextui-org/react";
import EditEntry from "../../pages/edit-entry";
import { useState } from "react";

// TempPaperData is for testing only
type EntrySliverProp = {
  entry: GPTResponse;
  index: number;
  onHandleDeleteChange: (entry: GPTResponse) => void;
};

export default function EntrySliver({
  entry,
  index,
  onHandleDeleteChange,
}: EntrySliverProp) {
  const { onOpenChange } = useDisclosure();
  const [open, setOpen] = useState(false);
  const [editedEntry, setEditedEntry] = useState<UpdateData>({
    paper_name: entry.pass_1.paper_name,
  } as UpdateData);

  const handleCancel = () => {
    setEditedEntry({
      paper_name: entry.pass_1.paper_name,
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
          {entry.pass_1.paper_name}
        </div>
        <div className="text-xs text-left text-slate-900">
          {entry.pass_1.author}
        </div>
      </div>
      <div className="col-span-2 flex items-center justify-center">
        <button
          className="bg-usask-green text-[#DADADA]"
          onClick={() => onHandleDeleteChange(entry)}
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
                    entryData={entry}
                    editedEntry={editedEntry}
                    setEditedEntry={setEditedEntry}
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
