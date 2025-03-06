import { useEffect, useState } from "react";
import { validationFunc } from "../types/types";
import { Input, Radio, RadioGroup, Textarea } from "@nextui-org/react";

type RenderPassProps = {
  passes: {
    pass_1: unknown;
    pass_2: unknown;
    pass_3: unknown;
  };
  currentEntry: string | number | boolean;
  handleChange: (name: string, value: string | number) => void;
  id: string;
};

export default function RenderPass({
  passes,
  currentEntry,
  handleChange,
  id,
}: RenderPassProps) {
  const [final_result, setFinalResult] = useState<string | number | boolean>(
    currentEntry ?? ""
  );
  const [type, setType] = useState<string>("");

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFinalResult(value);
    handleChange(name, value);
  };

  useEffect(() => {
    console.log("passes", passes);

    switch (typeof passes.pass_1) {
      case "string":
        setType("string");
        break;
      case "number":
        setType("number");
        break;
      case "boolean":
        setType("boolean");
        break;
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
                  name={id}
                  className="max-w-xs"
                  placeholder="Enter your description"
                  value={String(final_result)}
                  onChange={onChange}
                  description="Enter a value"
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
                  name={id}
                  type="number"
                  className="max-w-xs"
                  placeholder="Enter your description"
                  value={String(final_result)}
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
                  key={id}
                  orientation="horizontal"
                  defaultValue={String(final_result)}
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
