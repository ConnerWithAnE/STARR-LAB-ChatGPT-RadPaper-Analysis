import {
  Severity,
  Conflict,
  GPTResponse,
  FullDataType,
  PartData,
  TIDData,
  SEEData,
  DDData,
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
      return {} as FullDataType;
    }
  });
  const [originalEntry, setOriginalEntry] = useState<FullDataType>(() => {
    const savedEntry = tableEntries[index];
    if (savedEntry) {
      return savedEntry;
    } else {
      return {} as FullDataType;
    }
  });
  const [valuesEdited, setValuesEdited] = useState<string[]>([]); // To keep track of the values edited in the entry
  const [authors, setAuthors] = useState<AuthorData[]>(
    tableEntries[index]?.authors ?? []
  );

  useEffect(() => {
    // To reset editedEntries if a paper was deleted from /upload/edit
    const newentry = tableEntries[index];
    if (newentry) {
      return setEditedEntry(newentry);
    } else {
      setEditedEntry({} as FullDataType);
    }
  }, [tableEntries]);

  // React's strict mode makes every callback run twice. This is to prevent that
  const hasRun = useRef(false);

  const [passes] = useState<GPTResponse>(gptPass ?? ({} as GPTResponse));
  const [unresolvedConflicts, setUnresolvedConflicts] = useState<Conflict>({
    yellowSeverity: [],
    redSeverity: [],
  });

  useEffect(() => {
    if (hasRun.current) return; // Prevent duplicate execution
    hasRun.current = true;

    let updatedEntry = { ...editedEntry };
    if (!updatedEntry) {
      return;
    }

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

    const compareSEETestPasses = (
      partIndex: number,
      testIndex: number,
      pass_1: SEEData[],
      pass_2: SEEData[],
      pass_3: SEEData[]
    ): SEEData[] => {
      const updatedTests: SEEData[] = [];
      pass_1.forEach((test, i) => {
        let updatedTest = {} as SEEData;
        Object.entries(test).map(([key]) => {
          if (key === "id") {
            return;
          }
          type SEEDataKey = keyof SEEData;
          const typesafeKey = key as SEEDataKey;
          if (
            pass_1[i] === undefined ||
            pass_2[i] === undefined ||
            pass_3[i] === undefined
          ) {
            // console.log("SEE passes: \nPass1: ", pass_1[i], "\nPass2:", pass_2[i], "\nPass3:", pass_3[i]);
            return;
          }
          const tests_1 = pass_1[i][typesafeKey];
          const tests_2 = pass_2[i][typesafeKey];
          const tests_3 = pass_3[i][typesafeKey];

          // if the key is special_notes, just fill in one value and return
          // this is a compromise, as special_notes is often one long string and hard to compare
          if (typesafeKey === "special_notes") {
            updatedTest = {
              ...updatedTest,
              [typesafeKey]: tests_1,
            };
            return;
          }

          if (
            tests_1 === tests_2 &&
            tests_1 === tests_3 &&
            tests_2 === tests_3
          ) {
            updatedTest = {
              ...updatedTest,
              [typesafeKey]: tests_1,
            };
          } else if (tests_1 === tests_2 || tests_1 === tests_3) {
            updatedTest = {
              ...updatedTest,
              [typesafeKey]: tests_1,
            };
            addConflict2(
              updatedConflicts,
              `parts-${testIndex}-sees-${i}-${key}`,
              1
            );
          } else if (tests_2 === tests_3) {
            updatedTest = {
              ...updatedTest,
              [typesafeKey]: tests_2,
            };
            addConflict2(
              updatedConflicts,
              `parts-${testIndex}-sees-${i}-${key}`,
              1
            );
          } else {
            addConflict2(
              updatedConflicts,
              `parts-${testIndex}-sees-${i}-${key}`,
              2
            );
          }
        });
        updatedTests.push(updatedTest);
      });
      return updatedTests;
    };

    const compareDDTestPasses = (
      partIndex: number,
      testIndex: number,
      pass_1: DDData[],
      pass_2: DDData[],
      pass_3: DDData[]
    ): DDData[] => {
      const updatedTests: DDData[] = [];
      pass_1.forEach((test, i) => {
        let updatedTest = {} as DDData;
        Object.entries(test).map(([key]) => {
          if (key === "id") {
            return;
          }
          type DDDataKey = keyof DDData;
          const typesafeKey = key as DDDataKey;
          if (
            pass_1[i] === undefined ||
            pass_2[i] === undefined ||
            pass_3[i] === undefined
          ) {
            // console.log("DD passes: \nPass1: ", pass_1[i], "\nPass2:", pass_2[i], "\nPass3:", pass_3[i]);
            return;
          }
          const tests_1 = pass_1[i][typesafeKey];
          const tests_2 = pass_2[i][typesafeKey];
          const tests_3 = pass_3[i][typesafeKey];

          // if the key is special_notes, just fill in one value and return
          // this is a compromise, as special_notes is often one long string and hard to compare
          if (typesafeKey === "special_notes") {
            updatedTest = {
              ...updatedTest,
              [typesafeKey]: tests_1,
            };
            return;
          }

          if (
            tests_1 === tests_2 &&
            tests_1 === tests_3 &&
            tests_2 === tests_3
          ) {
            updatedTest = {
              ...updatedTest,
              [typesafeKey]: tests_1,
            };
          } else if (tests_1 === tests_2 || tests_1 === tests_3) {
            updatedTest = {
              ...updatedTest,
              [typesafeKey]: tests_1,
            };
            addConflict2(
              updatedConflicts,
              `parts-${testIndex}-dds-${i}-${key}`,
              1
            );
          } else if (tests_2 === tests_3) {
            updatedTest = {
              ...updatedTest,
              [typesafeKey]: tests_2,
            };
            addConflict2(
              updatedConflicts,
              `parts-${testIndex}-dds-${i}-${key}`,
              1
            );
          } else {
            addConflict2(
              updatedConflicts,
              `parts-${testIndex}-dds-${i}-${key}`,
              2
            );
          }
        });
        updatedTests.push(updatedTest);
      });
      return updatedTests;
    };

    const compareTIDTestPasses = (
      partIndex: number,
      testIndex: number,
      pass_1: TIDData[],
      pass_2: TIDData[],
      pass_3: TIDData[]
    ): TIDData[] => {
      const updatedTests: TIDData[] = [];
      pass_1.forEach((test, i) => {
        let updatedTest = {} as TIDData;
        Object.entries(test).map(([key]) => {
          if (key === "id" || key === "special_notes") {
            return;
          }
          type TIDDataKey = keyof TIDData;
          const typesafeKey = key as TIDDataKey;
          if (
            pass_1[i] === undefined ||
            pass_2[i] === undefined ||
            pass_3[i] === undefined
          ) {
            // console.log("TID passes: \nPass1: ", pass_1[i], "\nPass2:", pass_2[i], "\nPass3:", pass_3[i]);
            return;
          }
          const tests_1 = pass_1[i][typesafeKey];
          const tests_2 = pass_2[i][typesafeKey];
          const tests_3 = pass_3[i][typesafeKey];

          // if the key is special_notes, just fill in one value and return
          // this is a compromise, as special_notes is often one long string and hard to compare
          if (typesafeKey === "special_notes") {
            updatedTest = {
              ...updatedTest,
              [typesafeKey]: tests_1,
            };
            return;
          }

          if (
            tests_1 === tests_2 &&
            tests_1 === tests_3 &&
            tests_2 === tests_3
          ) {
            updatedTest = {
              ...updatedTest,
              [typesafeKey]: tests_1,
            };
          } else if (tests_1 === tests_2 || tests_1 === tests_3) {
            updatedTest = {
              ...updatedTest,
              [typesafeKey]: tests_1,
            };
            addConflict2(
              updatedConflicts,
              `parts-${testIndex}-tids-${i}-${key}`,
              1
            );
          } else if (tests_2 === tests_3) {
            updatedTest = {
              ...updatedTest,
              [typesafeKey]: tests_2,
            };
            addConflict2(
              updatedConflicts,
              `parts-${testIndex}-tids-${i}-${key}`,
              1
            );
          } else {
            addConflict2(
              updatedConflicts,
              `parts-${testIndex}-tids-${i}-${key}`,
              2
            );
          }
        });
        updatedTests.push(updatedTest);
      });
      // console.log("updatedTests", updatedTests);
      return updatedTests;
    };

    const comparePartPasses = (
      partIndex: number,
      pass_1: PartData[],
      pass_2: PartData[],
      pass_3: PartData[]
    ): PartData[] => {
      const updatedParts = [] as PartData[];
      const undefinedParts: number[] = [];
      pass_1.forEach((part, i) => {
        let updatedPart = {} as PartData;
        Object.entries(part).map(([key]) => {
          type PartDataKey = keyof PartData;
          const typesafeKey = key as PartDataKey;
          // TODO: This is a temporary fix to handle undefined parts in the passes
          if (
            pass_1[i] === undefined ||
            pass_2[i] === undefined ||
            pass_3[i] === undefined
          ) {
            if (!undefinedParts.includes(i)) {
              undefinedParts.push(i);
            }
            // console.log(i, "Part passes: \nPass1: ", pass_1[i], "\nPass2:", pass_2[i], "\nPass3:", pass_3[i]);
            return;
          }
          const parts_1 = pass_1[i][typesafeKey];
          const parts_2 = pass_2[i][typesafeKey];
          const parts_3 = pass_3[i][typesafeKey];

          if (key === "id" || key === "preliminary_test_types") {
            return;
          }

          if (key === "sees") {
            const updatedSEETests = compareSEETestPasses(
              partIndex,
              i,
              parts_1 as SEEData[],
              parts_2 as SEEData[],
              parts_3 as SEEData[]
            );
            updatedPart = {
              ...updatedPart,
              [typesafeKey]: updatedSEETests,
            };
            return;
          }
          if (key === "tids") {
            const updatedTIDTests = compareTIDTestPasses(
              partIndex,
              i,
              parts_1 as TIDData[],
              parts_2 as TIDData[],
              parts_3 as TIDData[]
            );

            updatedPart = {
              ...updatedPart,
              [typesafeKey]: updatedTIDTests,
            };
            return;
          }
          if (key === "dds") {
            const updatedDDTests = compareDDTestPasses(
              partIndex,
              i,
              parts_1 as DDData[],
              parts_2 as DDData[],
              parts_3 as DDData[]
            );
            updatedPart = {
              ...updatedPart,
              [typesafeKey]: updatedDDTests,
            };
            return;
          }
          // if the key is other_details, just fill in one value and return
          // this is a compromise, as other_details is often one long string and hard to compare
          if (typesafeKey === "other_details") {
            updatedPart = {
              ...updatedPart,
              [typesafeKey]: parts_1,
            };
            return;
          }

          if (
            parts_1 === parts_2 &&
            parts_1 === parts_3 &&
            parts_2 === parts_3
          ) {
            updatedPart = {
              ...updatedPart,
              [typesafeKey]: parts_1,
            };
          } else if (parts_1 === parts_2 || parts_1 === parts_3) {
            updatedPart = {
              ...updatedPart,
              [typesafeKey]: parts_1,
            };
            addConflict2(updatedConflicts, `parts-${i}-${key}`, 1);
          } else if (parts_2 === parts_3) {
            updatedPart = {
              ...updatedPart,
              [typesafeKey]: parts_2,
            };
            addConflict2(updatedConflicts, `parts-${i}-${key}`, 1);
          } else {
            addConflict2(updatedConflicts, `parts-${i}-${key}`, 2);
          }
        });
        if (!updatedParts[i]) {
          updatedParts.push(updatedPart);
        } else {
          updatedParts[i] = updatedPart;
        }
      });
      console.log(partIndex, "undefinedParts", undefinedParts);
      return updatedParts;
    };

    const compareAuthorPasses = (
      pass_1: AuthorData[] | undefined,
      pass_2: AuthorData[] | undefined,
      pass_3: AuthorData[] | undefined
    ): AuthorData[] => {
      if (
        Array.isArray(pass_1) &&
        Array.isArray(pass_2) &&
        Array.isArray(pass_3)
      ) {
        const authorsPresent: AuthorData[] = [];
        pass_1.forEach((author, i) => {
          if (pass_2 && pass_3) {
            const authorName1 = author.name;
            const authorName2 = (pass_2 as AuthorData[])[i].name;
            const authorName3 = (pass_3 as AuthorData[])[i].name;
            if (
              authorName1 == authorName2 &&
              authorName1 == authorName3 &&
              authorName2 == authorName3
            ) {
              authorsPresent[i] = (pass_1 as AuthorData[])[i];
            } else if (
              authorName1 == authorName2 ||
              authorName1 == authorName3
            ) {
              authorsPresent[i] = (pass_1 as AuthorData[])[i];
              addConflict2(updatedConflicts, `authors-${i}-name`, 1);
            } else if (authorName2 == authorName3) {
              authorsPresent[i] = (pass_2 as AuthorData[])[i];
              addConflict2(updatedConflicts, `authors-${i}-name`, 1);
            } else {
              addConflict2(updatedConflicts, `authors-${i}-name`, 2);
            }
          }
        });
        return authorsPresent;
      }
      return [];
    };

    Object.entries(passes.pass_1).map(([key]) => {
      type fullDataTypeKey = keyof typeof passes.pass_1;
      const typesafeKey = key as fullDataTypeKey;
      const pass_1 = passes.pass_1[typesafeKey];
      const pass_2 = passes.pass_2[typesafeKey];
      const pass_3 = passes.pass_3[typesafeKey];

      // if the entry has already been edited, it should bypass this process completely
      if (editedEntry[typesafeKey] !== undefined) {
        return;
      }
      // the 'objective' field is a long string and thus cannot be compared via string comparison
      if (typesafeKey === "objective") {
        updatedEntry = {
          ...updatedEntry,
          objective: pass_1,
        };
        return;
      }
      // Compare the part information in the passes
      if (typesafeKey === "parts") {
        if (
          Array.isArray(pass_1) &&
          Array.isArray(pass_2) &&
          Array.isArray(pass_3)
        ) {
          const updatedParts = comparePartPasses(index, pass_1, pass_2, pass_3);
          updatedEntry = {
            ...updatedEntry,
            parts: updatedParts,
          };
          return;
        }
      }

      // If comparing authors, call function to compare and set conflicts
      if (typesafeKey === "authors") {
        const resultAuthors = compareAuthorPasses(
          pass_1 as AuthorData[],
          pass_2 as AuthorData[],
          pass_3 as AuthorData[]
        );
        if (resultAuthors.length > 0) {
          updatedEntry = {
            ...updatedEntry,
            [typesafeKey]: resultAuthors,
          };
        }
      }
      // if all 3 entries are equal, enter the first one since it doesn't matter which one is set
      else if (pass_1 === pass_2 && pass_1 === pass_3 && pass_2 === pass_3) {
        updatedEntry = {
          ...updatedEntry,
          [typesafeKey]: passes.pass_1[typesafeKey],
        };
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

    // update editedEntry
    setEditedEntry(updatedEntry);
    setOriginalEntry(updatedEntry);
    setAuthors(updatedEntry.authors ?? []);
    addEntry(updatedEntry);

    // set unresolvedConflicts for the entry
    setUnresolvedConflicts(updatedConflicts);
    if (updatedConflicts.redSeverity.length > 0) {
      setRedConflict(index, updatedConflicts.redSeverity);
    }
  }, []);

  const handleCancel = () => {
    setEditedEntry(originalEntry);
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
    const updatedAuthors: AuthorData[] = [];
    for (let i = 0; i < authors.length; i++) {
      if (editedEntry.authors?.[i]) {
        updatedAuthors.push(editedEntry.authors[i]);
      } else {
        updatedAuthors.push(authors[i]);
      }
    }
    setAuthors(updatedAuthors);

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
    // console.log("updatedConflicts", updatedConflicts);
    const combinedConflicts: Conflict = {
      yellowSeverity: [
        ...unresolvedConflicts.yellowSeverity.filter(
          (conflict) => !valuesEdited.includes(conflict)
        ),
        ...updatedConflicts.yellowSeverity,
      ],
      redSeverity: [
        ...unresolvedConflicts.redSeverity.filter(
          (conflict) => !valuesEdited.includes(conflict)
        ),
        ...updatedConflicts.redSeverity,
      ],
    };
    // console.log('valuesEdited', valuesEdited);
    // console.log('combinedConflicts', combinedConflicts);
    setRedConflict(index, combinedConflicts.redSeverity);
    setUnresolvedConflicts(combinedConflicts);

    setValuesEdited([]); // Clear the values edited.

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
          {authors?.map((author) => (author?.name ? author.name + ", " : ""))}
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
            className="bg-[#ff5353] text-white"
            size="md"
            onClick={() => onHandleDeleteChange(index)}
          >
            Delete
          </Button>
          <Button
            className="bg-usask-green text-[#DADADA]"
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
                    setValuesEdited={setValuesEdited}
                  ></EditEntry>
                </ModalBody>
                <ModalFooter>
                  <Button
                    className="bg-[#ff5353] text-white"
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
