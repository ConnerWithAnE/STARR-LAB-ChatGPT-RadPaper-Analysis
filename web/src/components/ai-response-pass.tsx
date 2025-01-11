import { useEffect, useState } from "react";
import {Textarea} from "@nextui-org/react";


type DataPoints = {
    pass_1: string,
    pass_2: string,
    pass_3: string
}


export default function AIResponsePass({ pass_1, pass_2, pass_3 }: DataPoints ) {

    const [submission, setSubmission] = useState<string>("");

    useEffect(() => {
        // if all 3 entries are equal, enter the first one since it doesn't matter which one is set
        if (pass_1 === pass_2 && pass_1 === pass_3 && pass_2 === pass_3) {
            setSubmission(pass_1)
        }
        // if only 2 out of 3 entries are equal
        else if (pass_1 === pass_2 || pass_1 === pass_3) {
            setSubmission(pass_1)
        }
        else if (pass_2 === pass_3) {
            setSubmission(pass_2)
        }
    }, [pass_1, pass_2, pass_3])

    return (
        <span className="flex-row">
            <div className="flex-col">
                <span>First Pass</span>
                { pass_1 }
            </div>
            <div className="flex-col">
                <span>First Pass</span>
                { pass_2 }
            </div>
            <div className="flex-col">
                <span>First Pass</span>
                { pass_3 }
            </div>
            <div className="flex-col">
                <span>Final Result</span>
                <Textarea className="max-w-xs" placeholder="Enter your description" value={submission} />
            </div>
        </span>
    )
}