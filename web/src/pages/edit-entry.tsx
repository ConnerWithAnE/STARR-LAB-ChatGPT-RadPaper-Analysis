import { HiArrowLeft } from "react-icons/hi";
import { Accordion, AccordionItem, Button, Textarea } from "@nextui-org/react";
import { ChangeEvent, useEffect, useState } from "react";
import {
  GPTData,
  PaperData,
  TableData,
  UpdateData,
  validationFunc,
} from "../types/types";
import { GPTResponse } from "../types/types";
import { useLocation, useNavigate } from "react-router-dom";
//import AIResponsePass from "../components/ai-response-pass";
import { useRef } from "react";
import { useData } from "../DataContext";

type PaperProps = {
  paperData?: PaperData[];
  entryData?: GPTResponse[];
};

export type Conflict = {
  severity: number;
  dataType: string;
};

export default function EditEntry() {
  // React's strict mode makes every callback run twice. This is to prevent that
  const location = useLocation();
  const hasRun = useRef(false);
  const navigate = useNavigate();

  //   const [papers] = useState<PaperData[]>(paperData ?? []); will be expanded upon when we get to editing existing database entries
  const [passes] = useState<GPTResponse>(location.state.entryData ?? []);
  const [unresolvedConflicts, setUnresolvedConflicts] = useState<Conflict[]>(
    []
  );
  const { setData } = useData();
  const { tableData, setTableData } = useData();

  const [tempTableData, setTempTableData] = useState<UpdateData>({
    ROWID: location.state.index,
    paper_name: "",
    year: 0,
    author: [],
    part_no: "",
    type: "",
    manufacturer: "",
    testing_location: "Flight",
    testing_type: "DD",
    data_type: 0,
  });

  console.log(tempTableData);

  const handleChange = (event: any) => {
    const { name, value } = event.target;
    let newValue = value;
    if (name === "year" || name === "data_type") {
      newValue = parseInt(value);
    } else if (name === "author") {
      newValue = value.split(/[ ,]+/); // removes commas and possible whitespace
    }
    setTempTableData((prevState) => ({
      ...prevState,
      [name]: newValue,
    }));
  };

  const handleSave = () => {
    console.log(tempTableData);
    const temp = tempTableData as UpdateData;
    const index = tableData.findIndex(
      (obj) => obj.ROWID === location.state.index
    );
    const dataToSubmit = [...tableData];
    if (index !== -1) {
      dataToSubmit[index] = { ...temp };
    } else {
      dataToSubmit.push(temp);
    }

    setTableData(dataToSubmit);
    navigate("/upload/edit");
  };

  const navigateToDatabasePreview = () => {
    navigate("/upload/edit");
  };

  useEffect(() => {
    if (hasRun.current) return; // Prevent duplicate execution
    hasRun.current = true;

    const handleConflictAnalysis = (conflict: Conflict) => {
      setUnresolvedConflicts((prevUnresolvedConflicts) => {
        return [...prevUnresolvedConflicts, conflict];
      });
    };

    Object.entries(passes.pass_1).map(([key, _]) => {
      type GPTDataKey = keyof typeof passes.pass_1;
      const typesafeKey = key as GPTDataKey;
      let pass_1 = passes.pass_1[typesafeKey];
      let pass_2 = passes.pass_2[typesafeKey];
      let pass_3 = passes.pass_3[typesafeKey];

      // join strings together in case of comparing authors
      if (
        Array.isArray(pass_1) &&
        Array.isArray(pass_2) &&
        Array.isArray(pass_3)
      ) {
        pass_1 = pass_1.join();
        pass_2 = pass_2.join();
        pass_3 = pass_3.join();
      }

      // if all 3 entries are equal, enter the first one since it doesn't matter which one is set
      if (pass_1 === pass_2 && pass_1 === pass_3 && pass_2 === pass_3) {
        setTempTableData((prevState) => ({
          ...prevState, // Retain the previous state
          [typesafeKey]: passes.pass_1[typesafeKey],
        }));
        return;
      }
      // if only 2 out of 3 entries are equal
      else if (pass_1 === pass_2 || pass_1 === pass_3) {
        const conflict: Conflict = {
          severity: 2,
          dataType: key,
        };
        setTempTableData((prevState) => ({
          ...prevState, // Retain the previous state
          [typesafeKey]: passes.pass_1[typesafeKey],
        }));
        console.log(tempTableData);
        handleConflictAnalysis(conflict);
      } else if (pass_2 === pass_3) {
        const conflict: Conflict = {
          severity: 2,
          dataType: key,
        };
        setTempTableData((prevState) => ({
          ...prevState, // Retain the previous state
          [typesafeKey]: passes.pass_1[typesafeKey],
        }));
        handleConflictAnalysis(conflict);
      } else {
        const conflict: Conflict = {
          severity: 3,
          dataType: key,
        };
        handleConflictAnalysis(conflict);
      }
    });
  }, [passes]);

  return (
    <div className="flex flex-col gap-2 p-4">
      <div className="flex flex-row gap-4">
        <Button
          className="bg-usask-green"
          variant="flat"
          onClick={navigateToDatabasePreview}
        >
          <HiArrowLeft color="white" />
        </Button>
        <span> {tempTableData.paper_name ?? ""} </span>
      </div>
      <div className="flex flex-row justify-between gap-3">
        <div className="grow basis-1/3">
          <Accordion variant="light" isCompact selectionMode="multiple">
            {Object.entries(passes.pass_1).map(([key, index]) => {
              if (key === "id") {
                return <span></span>;
              }
              type GPTDataKey = keyof typeof passes.pass_1;
              type updateDataKey = keyof typeof tempTableData;
              const typesafeKey = key as GPTDataKey;
              const typesafeUpdateKey = key as updateDataKey;
              return (
                <AccordionItem title={key} key={index}>
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
                    <div className="flex flex-col grow basis-1/3 items-center bg-gray-400 p-1">
                      <span className="text-slate-800">Final Result</span>
                      {key === "author" ? (
                        <Textarea
                          name={key}
                          className="max-w-xs"
                          placeholder="Enter your description"
                          value={tempTableData[typesafeUpdateKey]?.toString()}
                          onChange={handleChange}
                          description="Please enter each author's name separated by quotes."
                        />
                      ) : (
                        <Textarea
                          name={key}
                          className="max-w-xs"
                          placeholder="Enter your description"
                          value={tempTableData[typesafeUpdateKey]?.toString()}
                          onChange={handleChange}
                        />
                      )}
                    </div>
                  </div>
                </AccordionItem>
              );
            })}
          </Accordion>
        </div>
        <div className="border-solid border-2 border-slate-900 rounded grow">
          <p>Unresolved Conflicts</p>
          {unresolvedConflicts.map((conflict) => {
            return (
              <div>
                <br></br>
                Severity: {conflict.severity}
                <br></br>
                Data Type: {conflict.dataType}
              </div>
            );
          })}
        </div>
      </div>
      {/* footer */}
      <div className="fixed bottom-0 end-0 bg-[#F4F4F4] flex flex-row-reverse z-40 w-full h-auto gap-2 p-3">
        <Button
          className="bg-usask-green text-white rounded-md"
          onClick={handleSave}
        >
          Save
        </Button>
        <Button
          className="bg-[#ff5353] text-white rounded-md"
          onClick={navigateToDatabasePreview}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}
