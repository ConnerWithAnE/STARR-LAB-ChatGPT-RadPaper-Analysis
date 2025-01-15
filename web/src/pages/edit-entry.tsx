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
  const defaultContent =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";

  const location = useLocation();

  //   const [papers] = useState<PaperData[]>(paperData ?? []); will be expanded upon when we get to editing existing database entries
  const [passes] = useState<GPTResponse>(location.state.entryData ?? []);
  const unresolvedConflicts: string[] = [];

  console.log("passes", passes);
  console.log("passes keys", Object.keys(passes.pass_1));

  // if (papers.length > 1) {
  //     // if all 3 outputs are the same, add nothing to the unresolved conflicts
  //     // if any of 3 outputs are not the same, go through each property
  //     if (JSON.stringify(papers[0]) === JSON.stringify(papers[1]) &&
  //         JSON.stringify(papers[0]) === JSON.stringify(papers[2]) &&
  //         JSON.stringify(papers[1]) === JSON.stringify(papers[2])) {
  //             console.log('hello')
  //         }
  // }

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
            {Object.keys(passes.pass_1).map((key, i) => (
              <AccordionItem key={i} title={key}>
                <AIResponsePass
                  pass_1={passes.pass_1[i]}
                  pass_2={passes.pass_2[i]}
                  pass_3={passes.pass_3[i]}
                ></AIResponsePass>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
        {/* <div className="border-solid border-2 border-slate-900 rounded grow">
          <p>Unresolved Conflicts</p>

          {entries.length > 1 ? (
            <span>{unresolvedConflicts.map((conflict) => conflict)}</span>
          ) : (
            <span></span>
          )}
        </div> */}
      </div>
    </div>
  );
}
