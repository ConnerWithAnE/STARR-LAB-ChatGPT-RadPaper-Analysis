import { HiArrowLeft } from "react-icons/hi";
import {Accordion, AccordionItem} from "@nextui-org/react";

export default function EditEntry() {
    const defaultContent =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";

    return (
        <div className="flex flex-col">
            <div>
                <HiArrowLeft />
                {/* TODO: get data of paper */}
            </div>
            <div className="flex flex-row justify-between">
                <div>
                    <Accordion>
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
                <div className="border-solid border-2 border-slate-900 rounded">
                    <p> this is some test content for the page</p>
                </div>
            </div>
        </div>
    )
}