import { Accordion, AccordionItem, Input, Textarea } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { PaperData, UpdateData, validationFunc } from "../types/types";
import { GPTResponse } from "../types/types";
import { useRef } from "react";
import { MdWarningAmber } from "react-icons/md";
import { Severity } from "../types/types";

type PaperProps = {
  paperData?: PaperData;
  entryData?: GPTResponse;
  editedEntry: UpdateData;
  setEditedEntry: React.Dispatch<React.SetStateAction<UpdateData>>;
};

export type Conflict = {
  severity: Severity;
  dataType: string;
};

export default function EditEntry({
  entryData,
  editedEntry,
  setEditedEntry,
}: PaperProps) {
  // React's strict mode makes every callback run twice. This is to prevent that
  const hasRun = useRef(false);

  //   const [papers] = useState<PaperData[]>(paperData ?? []); will be expanded upon when we get to editing existing database entries
  const [passes] = useState<GPTResponse>(entryData ?? ({} as GPTResponse));
  const [unresolvedConflicts, setUnresolvedConflicts] = useState<Conflict[]>(
    []
  );

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    let newValue: number | string = value;
    if (name === "year" || name === "data_type") {
      newValue = parseInt(value);
    }

    setEditedEntry((prevState) => ({
      ...prevState,
      [name]: newValue,
    }));
    console.log("handlechange", editedEntry);
  };

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
  }, [passes]);

  return (
    <div className="flex flex-col gap-2 p-4">
      <div className="flex flex-row justify-between gap-3">
        <div className="grow basis-1/3">
          <Accordion variant="light" isCompact selectionMode="multiple">
            {Object.entries(passes.pass_1).map(([key]) => {
              if (key === "id") {
                return <span></span>;
              }
              type GPTDataKey = keyof typeof passes.pass_1;
              type updateDataKey = keyof typeof editedEntry;
              const typesafeKey = key as GPTDataKey;
              const typesafeUpdateKey = key as updateDataKey;
              return (
                <AccordionItem title={key}>
                  <div className="flex flex-row justify-evenly">
                    <div className="flex flex-col items-center basis-1/4 p-1">
                      <span className="text-slate-800">First Pass</span>
                      <span className="text-slate-800">
                        {validationFunc(passes.pass_1[typesafeKey])}
                      </span>
                    </div>
                    <div className="flex flex-col items-center basis-1/4 p-1">
                      <span className="text-slate-800">Second Pass</span>
                      <span className="text-slate-800">
                        {validationFunc(passes.pass_2[typesafeKey])}
                      </span>
                    </div>
                    <div className="flex flex-col items-center basis-1/4 p-1">
                      <span className="text-slate-800">Third Pass</span>
                      <span className="text-slate-800">
                        {validationFunc(passes.pass_3[typesafeKey])}
                      </span>
                    </div>
                    <div className="flex flex-col grow basis-1/3 items-center p-1">
                      <span className="text-slate-800">Final Result</span>
                      {(() => {
                        switch (key) {
                          case "author":
                            return (
                              <Textarea
                                name={key}
                                className="max-w-xs"
                                placeholder="Enter your description"
                                value={editedEntry[
                                  typesafeUpdateKey
                                ]?.toString()}
                                onChange={handleChange}
                                description="Please enter each author's name separated by quotes."
                                validate={(value) => {
                                  if (value === "") {
                                    return "Please enter a value";
                                  }
                                }}
                              />
                            );
                          case "year":
                          case "data_type":
                            return (
                              <Input
                                name={key}
                                type="number"
                                className="max-w-xs"
                                placeholder="Enter your description"
                                value={editedEntry[
                                  typesafeUpdateKey
                                ]?.toString()}
                                onChange={handleChange}
                                validate={(value) => {
                                  if (value === "") {
                                    return "Please enter a value";
                                  }
                                }}
                              />
                            );
                          default:
                            return (
                              <Textarea
                                name={key}
                                className="max-w-xs"
                                placeholder="Enter your description"
                                value={editedEntry[
                                  typesafeUpdateKey
                                ]?.toString()}
                                onChange={handleChange}
                                validate={(value) => {
                                  if (value === "") {
                                    return "Please enter a value";
                                  }
                                }}
                              />
                            );
                        }
                      })()}
                    </div>
                  </div>
                </AccordionItem>
              );
            })}
          </Accordion>
        </div>
        <div className="border-solid border-2 border-slate-900 rounded grow flex flex-col p-4 align-center">
          <div className="text-center">Unresolved Conflicts</div>
          {unresolvedConflicts.map((conflict) => {
            return (
              <div className="flex flex-row gap-2 align-center justify-center">
                <br></br>
                {conflict.severity === 1 ? (
                  <MdWarningAmber color="yellow" size="1.5em" />
                ) : (
                  <MdWarningAmber color="red" size="1.5em" />
                )}
                {conflict.dataType}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
