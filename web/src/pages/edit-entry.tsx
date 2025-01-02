import { HiArrowLeft } from "react-icons/hi";
import {Accordion, AccordionItem, Button} from "@nextui-org/react";
import { useState } from "react";
import { PaperData } from "../types/types";

type PaperProps = {
 paperData: PaperData[];
}

export default function EditEntry({ paperData }: PaperProps ) {
    const defaultContent =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";

    const [papers] = useState<PaperData[]>(paperData ?? []);
    const unresolvedConflicts: string[] = [];

    if (papers.length > 1) {
        // if all 3 outputs are the same, add nothing to the unresolved conflicts
        // if any of 3 outputs are not the same, go through each property 
        if (JSON.stringify(papers[0]) === JSON.stringify(papers[1]) &&
            JSON.stringify(papers[0]) === JSON.stringify(papers[2]) && 
            JSON.stringify(papers[1]) === JSON.stringify(papers[2])) {
                console.log('hello')
            }
    }

    return (
        <div className="flex flex-col gap-2 p-4">
            <div className="flex flex-row gap-4">
                <Button className="bg-usask-green" variant="flat">
                    <HiArrowLeft color="white"/>
                </Button>
                <span> paper name placeholder </span>
            </div>
            <div className="flex flex-row justify-between gap-3">
                <div className="grow basis-1/3">
                    <Accordion variant="light" isCompact selectionMode="multiple">
                        <AccordionItem key="1" aria-label="Accordion 1" title="hellooooooooooooooooooooooooooooooooooooooooooo">
                            {defaultContent}
                        </AccordionItem>
                        <AccordionItem key="2" aria-label="Accordion 2" title="Accordion 2">
                            {defaultContent}
                        </AccordionItem>
                        <AccordionItem key="3" aria-label="Accordion 3" title="Accordion 3">
                            {defaultContent}
                        </AccordionItem>
                    </Accordion>
                </div>
                <div className="border-solid border-2 border-slate-900 rounded grow">
                    <p>Unresolved Conflicts</p>

                    { papers.length > 1 ? (
                        <span>
                            { unresolvedConflicts.map((conflict) => conflict)}
                        </span>
                    ) : (<span></span>)}
                </div>
            </div>
        </div>
    )
}