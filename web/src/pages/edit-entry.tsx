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
  setUnresolvedConflicts: React.Dispatch<React.SetStateAction<Conflict>>;
};

export default function EditEntry({
  entryData,
  editedEntry,
  setEditedEntry,
  unresolvedConflicts,
  setUnresolvedConflicts
}: PaperProps) {
  //   const [papers] = useState<PaperData[]>(paperData ?? []); will be expanded upon when we get to editing existing database entries
  const [passes] = useState<GPTResponse2>(entryData ?? ({} as GPTResponse2));

  useEffect(() => {
    console.log("editedEntry", editedEntry);
  }, [editedEntry]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateNestedProperty = (obj: any, path: string[], value: any): any => {
    if (path.length === 1) {
      return {
        ...obj,
        [path[0]]: value,
      };
    }
    return {
      ...obj,
      [path[0]]: updateNestedProperty(obj[path[0]], path.slice(1), value),
    };
  };

  const handleChange = (path: string[], value: string | number) => {
    console.log("im here?");
    console.log("path", path);
    console.log("value", value);
    console.log('handleChange() unresolvedConflicts', unresolvedConflicts);
    // if(path.length === 1) {
    //   const item: string = path[0];
    //   setUnresolvedConflicts((prevConflicts) => {
    //     if(prevConflicts.redSeverity.length > 0 && prevConflicts.redSeverity.some(conflict => conflict.conflictName === path[0])) {
    //       return {
    //         ...prevConflicts,
    //         redSeverity: prevConflicts.redSeverity.filter(conflict => conflict.conflictName !== path[0])
    //       };
    //     }
    //     return prevConflicts;
    //   });
    // }
    setEditedEntry((prevState) => updateNestedProperty(prevState, path, value));
    // console.log("handlechange", editedEntry);
  };

  const renderAuthors = (authors: AuthorData[]) => {
    return authors.map((author, i) => {
      const pass_2 = passes.pass_2.authors?.[i]?.name ?? {};
      const pass_3 = passes.pass_3.authors?.[i]?.name ?? {};
      return (
        <RenderPass
          passes={{
            pass_1: author?.name ?? {},
            pass_2: pass_2,
            pass_3: pass_3,
          }}
          currentEntry = {editedEntry?.authors?.[i]?.name ?? ""}
          handleChange={(name, value) => {
            handleChange(["authors", i.toString(), name], value);
          }}
          id={`name`}
        ></RenderPass>
      );
    });
  };

  const renderParts = (parts: PartData[]) => {
    return parts.map((part, i) => {
      return Object.entries(part).map(([key, value]) => {
        type PartDataKey = keyof PartData;
        const typesafeSubKey = key as PartDataKey;
        if (typesafeSubKey === "id") {
          return;
        }
        if (typesafeSubKey === "tids") {
          return (
            <div className="bg-slate-200 p-4 flex flex-col gap-2">
              <span className="text-lg">Total Ionizing Dose Effects</span>
              {renderTids(part.tids ?? [], i)}
            </div>
          );
        } else if (typesafeSubKey === "sees") {
          return (
            <div className="bg-slate-200 p-4 flex flex-col gap-2">
              <span className="text-lg">Single Event Effects</span>
              {renderSees(part.sees ?? [], i)}
            </div>
          );
        } else if (typesafeSubKey === "dds") {
          return (
            <div className="bg-slate-200 p-4 flex flex-col gap-2">
              <span className="text-lg">Damage Displacement</span>
              {renderDDs(part.dds ?? [], i)}
            </div>
          );
        }
        return (
          <div>
            <span className="text-lg">{key}</span>
            <RenderPass
              passes={{
                pass_1: value ?? {},
                pass_2: passes.pass_2?.parts?.[i]?.[typesafeSubKey] ?? {},
                pass_3: passes.pass_3?.parts?.[i]?.[typesafeSubKey] ?? {},
              }}
              currentEntry={editedEntry?.parts?.[i]?.[typesafeSubKey] ?? ""}
              handleChange={(name, value) =>
                handleChange(["parts", i.toString(), name], value)
              }
              id={`${key}`}
            ></RenderPass>
          </div>
        );
      });
    });
  };

  const renderTids = (tids: TIDData[], partIndex: number) => {
    return tids.map((tid, i) => {
      return (
        <div>
          <span>Test {i + 1}</span>
          <div className="bg-slate-300 p-4">
            {Object.entries(tid).map(([key, value]) => {
              type TIDDataKey = keyof TIDData;
              const typesafeKey = key as TIDDataKey;
              if (typesafeKey === "id") {
                return;
              }
              return (
                <div>
                  <span>{key}</span>
                  <RenderPass
                    passes={{
                      pass_1: value ?? "",
                      pass_2:
                        passes.pass_2?.parts?.[partIndex]?.tids?.[i]?.[
                          typesafeKey
                        ] ?? "",
                      pass_3:
                        passes.pass_3?.parts?.[partIndex]?.tids?.[i]?.[
                          typesafeKey
                        ] ?? "",
                    }}
                    currentEntry={
                      editedEntry?.parts?.[partIndex]?.tids?.[i]?.[
                        typesafeKey
                      ] ?? ""
                    }
                    handleChange={(name, value) =>
                      handleChange(
                        [
                          "parts",
                          partIndex.toString(),
                          "tids",
                          i.toString(),
                          name,
                        ],
                        value
                      )
                    }
                    id={`${typesafeKey}`}
                  ></RenderPass>
                </div>
              );
            })}
          </div>
          <br></br>
        </div>
      );
    });
  };

  const renderSees = (sees: SEEData[], partIndex: number) => {
    return sees.map((see, i) => {
      return (
        <div>
          <span>Test {i + 1}</span>
          <div className="bg-slate-300 p-4">
            {Object.entries(see).map(([key, value]) => {
              type SEEDataKey = keyof SEEData;
              const typesafeKey = key as SEEDataKey;
              if (typesafeKey === "id") {
                return;
              }
              return (
                <div>
                  <span>{key}</span>
                  <RenderPass
                    passes={{
                      pass_1: value ?? "",
                      pass_2:
                        passes.pass_2?.parts?.[partIndex]?.sees?.[i]?.[
                          typesafeKey
                        ] ?? "",
                      pass_3:
                        passes.pass_3?.parts?.[partIndex]?.sees?.[i]?.[
                          typesafeKey
                        ] ?? "",
                    }}
                    currentEntry={
                      editedEntry?.parts?.[partIndex]?.sees?.[i]?.[
                        typesafeKey
                      ] ?? ""
                    }
                    handleChange={(name, value) =>
                      handleChange(
                        [
                          "parts",
                          partIndex.toString(),
                          "sees",
                          i.toString(),
                          name,
                        ],
                        value
                      )
                    }
                    id={`${typesafeKey}`}
                  ></RenderPass>
                </div>
              );
            })}
          </div>
        </div>
      );
    });
  };

  const renderDDs = (dds: DDData[], partIndex: number) => {
    return dds.map((dd, i) => {
      return (
        <div>
          <span>Test {i + 1}</span>
          <div className="bg-slate-300 p-4">
            {Object.entries(dd).map(([key, value]) => {
              type DDDataKey = keyof DDData;
              const typesafeKey = key as DDDataKey;
              if (typesafeKey === "id") {
                return;
              }
              return (
                <div>
                  <span>{key}</span>
                  <RenderPass
                    passes={{
                      pass_1: value ?? "",
                      pass_2:
                        passes.pass_2?.parts?.[partIndex]?.dds?.[i]?.[
                          typesafeKey
                        ] ?? "",
                      pass_3:
                        passes.pass_3?.parts?.[partIndex]?.dds?.[i]?.[
                          typesafeKey
                        ] ?? "",
                    }}
                    currentEntry={
                      editedEntry?.parts?.[partIndex]?.dds?.[i]?.[
                        typesafeKey
                      ] ?? ""
                    }
                    handleChange={(name, value) =>
                      handleChange(
                        [
                          "parts",
                          partIndex.toString(),
                          "dds",
                          i.toString(),
                          name,
                        ],
                        value
                      )
                    }
                    id={`${typesafeKey}`}
                  ></RenderPass>
                </div>
              );
            })}
          </div>
        </div>
      );
    });
  };

  const renderPartAccordionItems = (): JSX.Element[] => {
    return (
      passes.pass_1.parts?.map((part, i) => (
        <AccordionItem title={`Part ${i + 1}`} key={`part-${i}`}>
          {renderParts([part])}
        </AccordionItem>
      )) ?? []
    );
  };

  useEffect(() => {
    console.log("passes", passes);
  });

  return (
    <div className="flex flex-col gap-2 p-4">
      <div className="flex flex-row justify-between gap-3">
        <div className="grow basis-1/3">
          {Object.entries(passes.pass_1).map(([key]): JSX.Element => {
            type fullDataTypeKey = keyof FullDataType;
            const typesafeKey = key as fullDataTypeKey;

            if (typesafeKey === "id") {
              return <></>;
            }

            if (typesafeKey !== "parts") {
              if (typesafeKey === "authors") {
                return (
                  <Accordion variant="light" isCompact selectionMode="multiple">
                    <AccordionItem title={key} key={key}>
                      {renderAuthors(passes.pass_1.authors ?? [])}
                    </AccordionItem>
                  </Accordion>
                );
              }
              return (
                <Accordion variant="light" isCompact selectionMode="multiple">
                  <AccordionItem title={key} key={key}>
                    <RenderPass
                      passes={{
                        pass_1: passes.pass_1[typesafeKey],
                        pass_2: passes.pass_2[typesafeKey],
                        pass_3: passes.pass_3[typesafeKey],
                      }}
                      currentEntry={editedEntry[typesafeKey] ?? ""}
                      handleChange={(name, value) => {
                        handleChange([typesafeKey], value);
                      }}
                      id={key}
                    ></RenderPass>
                  </AccordionItem>
                </Accordion>
              );
            }
            return <></>;
          })}
          <br></br>
          <Accordion variant="light" isCompact selectionMode="multiple">
            {renderPartAccordionItems()}
          </Accordion>
        </div>
        <div className="border-solid border-2 border-slate-900 rounded grow flex flex-col p-4 align-center">
          <div className="text-center">Unresolved Conflicts</div>
          {unresolvedConflicts.redSeverity.map((conflict) => {
            return (
              <div className="flex flex-row gap-2">
                <MdWarningAmber color="red" size="1.5em" />
                <div>{conflict.conflictName}</div>
              </div>
            );
          })}
          {unresolvedConflicts.yellowSeverity.map((conflict) => {
            return (
              <div key={conflict.conflictName} className="flex flex-row gap-2">
                <MdWarningAmber color="yellow" size="1.5em" />
                <div>{conflict.conflictName}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
