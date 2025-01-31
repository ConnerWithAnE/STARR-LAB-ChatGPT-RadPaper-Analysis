import { Accordion, AccordionItem, Input, Textarea } from "@nextui-org/react";
import { useState } from "react";
import { PaperData, UpdateData, validationFunc } from "../types/types";
import { GPTResponse } from "../types/types";
import { MdWarningAmber } from "react-icons/md";
import { Severity } from "../types/types";

type PaperProps = {
  paperData?: PaperData;
  entryData?: GPTResponse;
  editedEntry: UpdateData;
  setEditedEntry: React.Dispatch<React.SetStateAction<UpdateData>>;
  unresolvedConflicts: Conflict[];
};

export type Conflict = {
  severity: Severity;
  dataType: string;
};

export default function EditEntry({
  entryData,
  editedEntry,
  setEditedEntry,
  unresolvedConflicts,
}: PaperProps) {
  //   const [papers] = useState<PaperData[]>(paperData ?? []); will be expanded upon when we get to editing existing database entries
  const [passes] = useState<GPTResponse>(entryData ?? ({} as GPTResponse));

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
                <AccordionItem title={key} key={key}>
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
