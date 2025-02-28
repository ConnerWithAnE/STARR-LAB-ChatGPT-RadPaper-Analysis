import { useEffect, useState } from "react";
import { validationFunc } from "../types/types";
import { Input, Radio, RadioGroup, Textarea } from "@nextui-org/react";

type RenderPassProps = {
  passes: {
    pass_1: unknown;
    pass_2: unknown;
    pass_3: unknown;
  };
  handleChange: (name: string, value: string | number) => void;
  key: string;
};

export default function RenderPass({
  passes,
  handleChange,
  key,
}: RenderPassProps) {
  const [final_result, setFinalResult] = useState<string>("");
  const [type, setType] = useState<string>("");

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setFinalResult(value);
    handleChange(key, value);
  };

  useEffect(() => {
    console.log("passes", passes);
    switch (typeof passes.pass_1) {
      case "string":
        setType("string");
        if (
          passes.pass_1 === passes.pass_2 &&
          passes.pass_1 === passes.pass_3 &&
          passes.pass_2 === passes.pass_3
        ) {
          setFinalResult(passes.pass_1);
        } else if (
          passes.pass_1 === passes.pass_2 ||
          passes.pass_1 === passes.pass_3
        ) {
          setFinalResult(passes.pass_1);
        } else if (passes.pass_2 === passes.pass_3) {
          setFinalResult(passes.pass_2 as string);
        }
        break;
      case "number":
        setType("number");
        if (
          passes.pass_1 === passes.pass_2 &&
          passes.pass_1 === passes.pass_3 &&
          passes.pass_2 === passes.pass_3
        ) {
          setFinalResult(passes.pass_1.toString());
        } else if (
          passes.pass_1 === passes.pass_2 ||
          passes.pass_1 === passes.pass_3
        ) {
          setFinalResult(passes.pass_1.toString());
        } else if (passes.pass_2 === passes.pass_3) {
          setFinalResult((passes.pass_2 as number).toString());
        }
        break;
      case "boolean":
        setType("boolean");
        if (
          passes.pass_1 === passes.pass_2 &&
          passes.pass_1 === passes.pass_3 &&
          passes.pass_2 === passes.pass_3
        ) {
          setFinalResult(passes.pass_1.toString());
        } else if (
          passes.pass_1 === passes.pass_2 ||
          passes.pass_1 === passes.pass_3
        ) {
          setFinalResult(passes.pass_1.toString());
        } else if (passes.pass_2 === passes.pass_3) {
          setFinalResult((passes.pass_2 as boolean).toString());
        }
    }
  }, []);

  return (
    <div className="flex flex-row justify-evenly">
      <div className="flex flex-col items-center basis-1/4 p-1">
        <span className="text-slate-800">First Pass</span>
        <span className="text-slate-800">{validationFunc(passes.pass_1)}</span>
      </div>
      <div className="flex flex-col items-center basis-1/4 p-1">
        <span className="text-slate-800">Second Pass</span>
        <span className="text-slate-800">{validationFunc(passes.pass_2)}</span>
      </div>
      <div className="flex flex-col items-center basis-1/4 p-1">
        <span className="text-slate-800">Third Pass</span>
        <span className="text-slate-800">{validationFunc(passes.pass_3)}</span>
      </div>
      <div className="flex flex-col grow basis-1/3 items-center p-1">
        <span className="text-slate-800">Final Result</span>
        {(() => {
          switch (type) {
            case "string":
              return (
                <Textarea
                  name={key}
                  className="max-w-xs"
                  placeholder="Enter your description"
                  value={final_result}
                  onChange={onChange}
                  description="Please enter each author's name separated by quotes."
                  validate={(value) => {
                    if (value === "") {
                      return "Please enter a value";
                    }
                  }}
                />
              );
            case "number":
              return (
                <Input
                  name={key}
                  type="number"
                  className="max-w-xs"
                  placeholder="Enter your description"
                  value={final_result}
                  onChange={onChange}
                  validate={(value) => {
                    if (isNaN(parseInt(value))) {
                      return "Please enter a value";
                    }
                  }}
                />
              );
            case "boolean":
              return (
                <RadioGroup
                  label="Select a value"
                  orientation="horizontal"
                  defaultValue={final_result}
                  onChange={onChange}
                >
                  <Radio value="true">True</Radio>
                  <Radio value="false">False</Radio>
                </RadioGroup>
              );
          }
        })()}
      </div>
    </div>
  );
}
