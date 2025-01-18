import { HiArrowLeft } from "react-icons/hi";
import { Accordion, AccordionItem, Button } from "@nextui-org/react";
import { useState } from "react";
import { PaperData } from "../types/types";
import { GPTResponse } from "../types/types";
import { useLocation } from "react-router-dom";
import AIResponsePass from "../components/ai-response-pass";

type PaperProps = {
  paperData?: PaperData[];
  entryData?: GPTResponse[];
};

export default function EditEntry() {
  const location = useLocation();

  //   const [papers] = useState<PaperData[]>(paperData ?? []); will be expanded upon when we get to editing existing database entries
  const [passes] = useState<GPTResponse>(location.state.entryData ?? []);
  const unresolvedConflicts: string[] = [];

  return (
    <div className="flex flex-col gap-2 p-4">
      <div className="flex flex-row gap-4">
        <Button className="bg-usask-green" variant="flat">
          <HiArrowLeft color="white" />
        </Button>
        <span> paper name placeholder </span>
      </div>
      <div className="flex flex-row justify-between gap-3">
        <div className="grow basis-1/3">
          <Accordion variant="light" isCompact selectionMode="multiple">
            {Object.entries(passes.pass_1).map(([key, _]) => {
              type GPTDataKey = keyof typeof passes.pass_1;
              const typesafeKey = key as GPTDataKey;
              return (
                <AccordionItem title={key}>
                  <AIResponsePass
                    pass_1={passes.pass_1[typesafeKey]}
                    pass_2={passes.pass_2[typesafeKey]}
                    pass_3={passes.pass_3[typesafeKey]}
                  ></AIResponsePass>
                </AccordionItem>
              );
            })}
          </Accordion>
        </div>
        <div className="border-solid border-2 border-slate-900 rounded grow">
          <p>Unresolved Conflicts</p>

          {/* {entries.length > 1 ? (
            <span>{unresolvedConflicts.map((conflict) => conflict)}</span>
          ) : (
            <span></span>
          )} */}
        </div>
      </div>
    </div>
  );
}
