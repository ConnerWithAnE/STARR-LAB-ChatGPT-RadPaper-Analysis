import { Accordion, AccordionItem } from "@nextui-org/react";
import { useState } from "react";
import { UpdateData, Conflict } from "../types/types";
import { GPTResponse } from "../types/types";
import { MdWarningAmber } from "react-icons/md";
import RenderPass from "../components/render-pass";

type PaperProps = {
  entryData?: GPTResponse;
  editedEntry: UpdateData;
  setEditedEntry: React.Dispatch<React.SetStateAction<UpdateData>>;
  unresolvedConflicts: Conflict;
};

export default function EditEntry({
  entryData,
  editedEntry,
  setEditedEntry,
  unresolvedConflicts,
}: PaperProps) {
  //   const [papers] = useState<PaperData[]>(paperData ?? []); will be expanded upon when we get to editing existing database entries
  const [passes] = useState<GPTResponse>(entryData ?? ({} as GPTResponse));

  const handleChange = (name: string, value: string | number) => {
    setEditedEntry((prevState) => ({
      ...prevState,
      [name]: value,
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
              const typesafeKey = key as GPTDataKey;
              return (
                <AccordionItem title={key} key={key}>
                  <RenderPass
                    passes={{
                      pass_1: passes.pass_1[typesafeKey],
                      pass_2: passes.pass_2[typesafeKey],
                      pass_3: passes.pass_3[typesafeKey],
                    }}
                    handleChange={handleChange}
                    key={key}
                  ></RenderPass>
                </AccordionItem>
              );
            })}
          </Accordion>
        </div>
        <div className="border-solid border-2 border-slate-900 rounded grow flex flex-col p-4 align-center">
          <div className="text-center">Unresolved Conflicts</div>
          {unresolvedConflicts.redSeverity.map((conflict) => {
            return (
              <div className="flex flex-row gap-2">
                <MdWarningAmber color="red" size="1.5em" />
                <div>{conflict}</div>
              </div>
            );
          })}
          {unresolvedConflicts.yellowSeverity.map((conflict) => {
            return (
              <div key={conflict} className="flex flex-row gap-2">
                <MdWarningAmber color="yellow" size="1.5em" />
                <div>{conflict}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
