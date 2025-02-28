import { Accordion, AccordionItem } from "@nextui-org/react";
import { useEffect, useState } from "react";
import {
  AuthorData,
  Conflict,
  DDData,
  FullDataType,
  GPTResponse2,
  PartData,
  SEEData,
  TIDData,
} from "../types/types";
import { MdWarningAmber } from "react-icons/md";
import RenderPass from "../components/render-pass";

type PaperProps = {
  entryData?: GPTResponse2;
  editedEntry: FullDataType;
  setEditedEntry: React.Dispatch<React.SetStateAction<FullDataType>>;
  unresolvedConflicts: Conflict;
};

export default function EditEntry({
  entryData,
  editedEntry,
  setEditedEntry,
  unresolvedConflicts,
}: PaperProps) {
  //   const [papers] = useState<PaperData[]>(paperData ?? []); will be expanded upon when we get to editing existing database entries
  const [passes] = useState<GPTResponse2>(entryData ?? ({} as GPTResponse2));

  const handleChange = (name: string, value: string | number) => {
    setEditedEntry((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    console.log("handlechange", editedEntry);
  };

  const renderAuthors = (authors: AuthorData[]) => {
    return authors.map((author, i) => {
      const pass_2 = passes.pass_2.authors?.[i]?.name ?? {};
      const pass_3 = passes.pass_2.authors?.[i]?.name ?? {};
      return (
        <RenderPass
          passes={{
            pass_1: author?.name ?? {},
            pass_2: pass_2,
            pass_3: pass_3,
          }}
          handleChange={handleChange}
          key={`authors-${i}`}
        ></RenderPass>
      );
    });
  };

  const renderParts = (parts: PartData[]) => {
    return parts.map((part, i) => {
      return Object.entries(part).map(([key, value]) => {
        type PartDataKey = keyof PartData;
        const typesafeSubKey = key as PartDataKey;
        if (typesafeSubKey === "tids") {
          return renderTids(part.tids ?? []);
        } else if (typesafeSubKey === "sees") {
          return renderSees(part.sees ?? []);
        } else if (typesafeSubKey === "dds") {
          return renderDDs(part.dds ?? []);
        }
        return (
          <RenderPass
            passes={{
              pass_1: value ?? {},
              pass_2: passes.pass_2?.parts?.[i]?.[typesafeSubKey] ?? {},
              pass_3: passes.pass_3?.parts?.[i]?.[typesafeSubKey] ?? {},
            }}
            handleChange={handleChange}
            key={`${key}-${i}`}
          ></RenderPass>
        );
      });
    });
  };

  const renderTids = (tids: TIDData[]) => {
    return tids.map((tid, i) => {
      Object.entries(tid).map(([key, value], j) => {
        type TIDDataKey = keyof TIDData;
        console.log("tid", tid);
        return (
          <RenderPass
            passes={{
              pass_1: value ?? {},
              pass_2: passes.pass_2?.parts?.[i]?.tids?.[j]?.[key] ?? {},
              pass_3: passes.pass_3?.parts?.[i]?.tids?.[j] ?? {},
            }}
            handleChange={handleChange}
            key={`${tid}-${i}`}
          ></RenderPass>
        );
      });
    });
  };

  const renderSees = (sees: SEEData[]) => {
    return sees.map((see, i) => {
      console.log("see", see);
      return (
        <RenderPass
          passes={{
            pass_1: see ?? {},
            pass_2: passes.pass_2?.parts?.[i]?.sees?.[i] ?? {},
            pass_3: passes.pass_3?.parts?.[i]?.sees?.[i] ?? {},
          }}
          handleChange={handleChange}
          key={`${see}-${i}`}
        ></RenderPass>
      );
    });
  };

  const renderDDs = (dds: DDData[]) => {
    return dds.map((dd, i) => {
      console.log("dd", dd);
      return (
        <RenderPass
          passes={{
            pass_1: dd ?? {},
            pass_2: passes.pass_2?.parts?.[i]?.dds?.[i] ?? {},
            pass_3: passes.pass_3?.parts?.[i]?.dds?.[i] ?? {},
          }}
          handleChange={handleChange}
          key={`${dd}-${i}`}
        ></RenderPass>
      );
    });
  };

  useEffect(() => {
    console.log("passes", passes);
  });

  return (
    <div className="flex flex-col gap-2 p-4">
      <div className="flex flex-row justify-between gap-3">
        <div className="grow basis-1/3">
          <Accordion variant="light" isCompact selectionMode="multiple">
            {Object.entries(passes.pass_1).map(([key]) => {
              type fullDataTypeKey = keyof FullDataType;
              const typesafeKey = key as fullDataTypeKey;

              // authors
              if (typesafeKey === "authors") {
                return (
                  <AccordionItem title={key} key={key}>
                    {renderAuthors(passes.pass_1.authors ?? [])}
                  </AccordionItem>
                );
                // parts
              } else if (typesafeKey === "parts") {
                return (
                  <AccordionItem title={key} key={key}>
                    {renderParts(passes.pass_1.parts ?? [])}
                  </AccordionItem>
                );
              }
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
        {/* <div className="border-solid border-2 border-slate-900 rounded grow flex flex-col p-4 align-center">
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
        </div> */}
      </div>
    </div>
  );
}
