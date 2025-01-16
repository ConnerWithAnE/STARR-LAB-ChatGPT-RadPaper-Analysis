import { useEffect, useState } from "react";
import { Textarea } from "@nextui-org/react";
import { validationFunc } from "../types/types";

type DataPoints = {
  pass_1: unknown;
  pass_2: unknown;
  pass_3: unknown;
};

export default function AIResponsePass({ pass_1, pass_2, pass_3 }: DataPoints) {
  const [submission, setSubmission] = useState<string>("");
  console.log(pass_1);
  console.log(pass_2);
  console.log(pass_3);

  useEffect(() => {
    // if all 3 entries are equal, enter the first one since it doesn't matter which one is set
    if (pass_1 === pass_2 && pass_1 === pass_3 && pass_2 === pass_3) {
      setSubmission(validationFunc(pass_1));
    }
    // if only 2 out of 3 entries are equal
    else if (pass_1 === pass_2 || pass_1 === pass_3) {
      setSubmission(validationFunc(pass_1));
    } else if (pass_2 === pass_3) {
      setSubmission(validationFunc(pass_2));
    }
  }, [pass_1, pass_2, pass_3]);

  return (
    <div className="flex flex-row">
      <div className="flex flex-col">
        <span>First Pass</span>
        <span className="text-slate-50">{validationFunc(pass_1)}</span>
      </div>
      <div className="flex flex-col">
        <span>Second Pass</span>
        <span className="text-slate-50">{validationFunc(pass_2)}</span>
      </div>
      <div className="flex flex-col">
        <span>Third Pass</span>
        {validationFunc(pass_3)}
      </div>
      <div className="flex flex-col">
        <span>Final Result</span>
        <Textarea
          className="max-w-xs"
          placeholder="Enter your description"
          value={submission}
        />
      </div>
    </div>
  );
}
