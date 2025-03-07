import { DDData, PartData, SEEData, TIDData } from "../types/types";

export function createPartEntries(
  currentParts: PartData[],
  pass_1: PartData[],
  pass_2: PartData[],
  pass_3: PartData[]
): PartData[] {
  const updatedParts = [...(currentParts ?? [])];
  pass_1.forEach((part, i) => {
    Object.entries(part).map(([key]) => {
      type PartDataKey = keyof PartData;
      const typesafeKey = key as PartDataKey;
      const parts_1 = pass_1[i][typesafeKey];
      const parts_2 = pass_2[i][typesafeKey];
      const parts_3 = pass_3[i][typesafeKey];

      if (key === "id") {
        return;
      }
      if (key === "sees") {
        const updatedSEETests = createSEEEntries(
          currentParts[i]?.sees ?? [],
          parts_1 as SEEData[],
          parts_2 as SEEData[],
          parts_3 as SEEData[]
        );
        updatedParts[i] = {
          ...updatedParts[i],
          [typesafeKey]: updatedSEETests,
        };
        return;
      }
      if (key === "tids") {
        const updatedTIDTests = createTIDEntries(
          currentParts[i]?.tids ?? [],
          parts_1 as TIDData[],
          parts_2 as TIDData[],
          parts_3 as TIDData[]
        );
        updatedParts[i] = {
          ...updatedParts[i],
          [typesafeKey]: updatedTIDTests,
        };
        return;
      }
      if (key === "dds") {
        const updatedDDTests = createDDEntries(
          currentParts[i]?.dds ?? [],
          parts_1 as DDData[],
          parts_2 as DDData[],
          parts_3 as DDData[]
        );
        updatedParts[i] = {
          ...updatedParts[i],
          [typesafeKey]: updatedDDTests,
        };
        return;
      }

      if (parts_1 === parts_2 && parts_1 === parts_3 && parts_2 === parts_3) {
        updatedParts[i] = {
          ...updatedParts[i],
          [typesafeKey]: parts_1,
        };
      } else if (parts_1 === parts_2 || parts_1 === parts_3) {
        updatedParts[i] = {
          ...updatedParts[i],
          [typesafeKey]: parts_1,
        };
      } else if (parts_2 === parts_3) {
        updatedParts[i] = {
          ...updatedParts[i],
          [typesafeKey]: parts_2,
        };
      }
    });
  });
  console.log("updatedParts", updatedParts);
  return updatedParts;
}

export function createSEEEntries(
  currentTests: SEEData[],
  pass_1: SEEData[],
  pass_2: SEEData[],
  pass_3: SEEData[]
): SEEData[] {
  const updatedTests = [...(currentTests ?? [])];
  pass_1.forEach((test, i) => {
    Object.entries(test).map(([key]) => {
      if (key === "id") {
        return;
      }
      type SEEDataKey = keyof SEEData;
      const typesafeKey = key as SEEDataKey;
      const testProp1 = pass_1[i][typesafeKey];
      const testProp2 = pass_2[i][typesafeKey];
      const testProp3 = pass_3[i][typesafeKey];

      if (!updatedTests[i]) {
        updatedTests.push({});
      }

      if (
        testProp1 === testProp2 &&
        testProp1 === testProp3 &&
        testProp2 === testProp3
      ) {
        updatedTests[i] = {
          ...updatedTests[i],
          [typesafeKey]: testProp1,
        };
      } else if (testProp1 === testProp2 || testProp1 === testProp3) {
        updatedTests[i] = {
          ...updatedTests[i],
          [typesafeKey]: testProp1,
        };
      } else if (testProp2 === testProp3) {
        updatedTests[i] = {
          ...updatedTests[i],
          [typesafeKey]: testProp2,
        };
      } else {
        updatedTests[i] = {
          ...updatedTests[i],
          [typesafeKey]: null,
        };
      }
    });
  });
  return updatedTests;
}

export function createDDEntries(
  currentTests: DDData[],
  pass_1: DDData[],
  pass_2: DDData[],
  pass_3: DDData[]
): DDData[] {
  const updatedTests = [...(currentTests ?? [])];
  pass_1.forEach((test, i) => {
    Object.entries(test).map(([key]) => {
      if (key === "id") {
        return;
      }
      type DDDataKey = keyof DDData;
      const typesafeKey = key as DDDataKey;
      const testProp1 = pass_1[i][typesafeKey];
      const testProp2 = pass_2[i][typesafeKey];
      const testProp3 = pass_3[i][typesafeKey];

      if (!updatedTests[i]) {
        updatedTests.push({});
      }

      if (
        testProp1 === testProp2 &&
        testProp1 === testProp3 &&
        testProp2 === testProp3
      ) {
        updatedTests[i] = {
          ...updatedTests[i],
          [typesafeKey]: testProp1,
        };
      } else if (testProp1 === testProp2 || testProp1 === testProp3) {
        updatedTests[i] = {
          ...updatedTests[i],
          [typesafeKey]: testProp1,
        };
      } else if (testProp2 === testProp3) {
        updatedTests[i] = {
          ...updatedTests[i],
          [typesafeKey]: testProp2,
        };
      } else {
        updatedTests[i] = {
          ...updatedTests[i],
          [typesafeKey]: null,
        };
      }
    });
  });
  return updatedTests;
}

export function createTIDEntries(
  currentTests: TIDData[],
  pass_1: TIDData[],
  pass_2: TIDData[],
  pass_3: TIDData[]
): TIDData[] {
  const updatedTests: TIDData[] = currentTests ?? [];
  pass_1.forEach((test, i) => {
    Object.entries(test).map(([key]) => {
      if (key === "id") {
        return;
      }
      type TIDDataKey = keyof TIDData;
      const typesafeKey = key as TIDDataKey;
      const tests_1 = pass_1[i][typesafeKey];
      const tests_2 = pass_2[i][typesafeKey];
      const tests_3 = pass_3[i][typesafeKey];

      if (!updatedTests[i]) {
        updatedTests.push({});
      }

      if (tests_1 === tests_2 && tests_1 === tests_3 && tests_2 === tests_3) {
        updatedTests[i] = {
          ...updatedTests[i],
          [typesafeKey]: tests_1,
        };
      } else if (tests_1 === tests_2 || tests_1 === tests_3) {
        updatedTests[i] = {
          ...updatedTests[i],
          [typesafeKey]: tests_1,
        };
      } else if (tests_2 === tests_3) {
        updatedTests[i] = {
          ...updatedTests[i],
          [typesafeKey]: tests_2,
        };
      } else {
        updatedTests[i] = {
          ...updatedTests[i],
          [typesafeKey]: null,
        };
      }
    });
  });
  // console.log("updatedTests", updatedTests);
  return updatedTests;
}

// const compareSEETestPasses = (
//   partIndex: number,
//   testIndex: number,
//   pass_1: SEEData[],
//   pass_2: SEEData[],
//   pass_3: SEEData[]
// ): SEEData[] => {
//   const updatedTests = [...(editedEntry?.parts?.[partIndex]?.sees ?? [])];
//   pass_1.forEach((test, i) => {
//     Object.entries(test).map(([key]) => {
//       if (key === "id") {
//         return;
//       }
//       type SEEDataKey = keyof SEEData;
//       const typesafeKey = key as SEEDataKey;
//       const tests_1 = pass_1[i][typesafeKey];
//       const tests_2 = pass_2[i][typesafeKey];
//       const tests_3 = pass_3[i][typesafeKey];

//       if (!updatedTests[i]) {
//         updatedTests.push({});
//       }

//       if (
//         tests_1 === tests_2 &&
//         tests_1 === tests_3 &&
//         tests_2 === tests_3
//       ) {
//         updatedTests[testIndex] = {
//           ...updatedTests[testIndex],
//           [typesafeKey]: tests_1,
//         };
//       } else if (tests_1 === tests_2 || tests_1 === tests_3) {
//         updatedTests[testIndex] = {
//           ...updatedTests[testIndex],
//           [typesafeKey]: tests_1,
//         };
//         addConflict2(
//           updatedConflicts,
//           `${partIndex}-${testIndex}-${key}`,
//           1
//         );
//       } else if (tests_2 === tests_3) {
//         updatedTests[testIndex] = {
//           ...updatedTests[testIndex],
//           [typesafeKey]: tests_2,
//         };
//         addConflict2(
//           updatedConflicts,
//           `${partIndex}-${testIndex}-${key}`,
//           1
//         );
//       } else {
//         addConflict2(
//           updatedConflicts,
//           `${partIndex}-${testIndex}-${key}`,
//           2
//         );
//       }
//     });
//   });
//   return updatedTests;
// };

// const compareDDTestPasses = (
//   partIndex: number,
//   testIndex: number,
//   pass_1: DDData[],
//   pass_2: DDData[],
//   pass_3: DDData[]
// ): DDData[] => {
//   const updatedTests = [...(editedEntry?.parts?.[partIndex]?.dds ?? [])];
//   pass_1.forEach((test, i) => {
//     Object.entries(test).map(([key]) => {
//       if (key === "id") {
//         return;
//       }
//       type DDDataKey = keyof DDData;
//       const typesafeKey = key as DDDataKey;
//       const tests_1 = pass_1[i][typesafeKey];
//       const tests_2 = pass_2[i][typesafeKey];
//       const tests_3 = pass_3[i][typesafeKey];

//       if (!updatedTests[i]) {
//         updatedTests.push({});
//       }

//       if (
//         tests_1 === tests_2 &&
//         tests_1 === tests_3 &&
//         tests_2 === tests_3
//       ) {
//         updatedTests[testIndex] = {
//           ...updatedTests[testIndex],
//           [typesafeKey]: tests_1,
//         };
//       } else if (tests_1 === tests_2 || tests_1 === tests_3) {
//         updatedTests[testIndex] = {
//           ...updatedTests[testIndex],
//           [typesafeKey]: tests_1,
//         };
//         addConflict2(
//           updatedConflicts,
//           `${partIndex}-${testIndex}-${key}`,
//           1
//         );
//       } else if (tests_2 === tests_3) {
//         updatedTests[testIndex] = {
//           ...updatedTests[testIndex],
//           [typesafeKey]: tests_2,
//         };
//         addConflict2(
//           updatedConflicts,
//           `${partIndex}-${testIndex}-${key}`,
//           1
//         );
//       } else {
//         addConflict2(
//           updatedConflicts,
//           `${partIndex}-${testIndex}-${key}`,
//           2
//         );
//       }
//     });
//   });
//   return updatedTests;
// };

// const compareTIDTestPasses = (
//   partIndex: number,
//   testIndex: number,
//   pass_1: TIDData[],
//   pass_2: TIDData[],
//   pass_3: TIDData[]
// ): TIDData[] => {
//   const updatedTests: TIDData[] =
//     editedEntry?.parts?.[partIndex]?.tids ?? [];
//   pass_1.forEach((test, i) => {
//     Object.entries(test).map(([key]) => {
//       if (key === "id") {
//         return;
//       }
//       type TIDDataKey = keyof TIDData;
//       const typesafeKey = key as TIDDataKey;
//       const tests_1 = pass_1[i][typesafeKey];
//       const tests_2 = pass_2[i][typesafeKey];
//       const tests_3 = pass_3[i][typesafeKey];

//       if (!updatedTests[i]) {
//         updatedTests.push({});
//       }

//       if (
//         tests_1 === tests_2 &&
//         tests_1 === tests_3 &&
//         tests_2 === tests_3
//       ) {
//         updatedTests[i] = {
//           ...updatedTests[i],
//           [typesafeKey]: tests_1,
//         };
//       } else if (tests_1 === tests_2 || tests_1 === tests_3) {
//         updatedTests[i] = {
//           ...updatedTests[i],
//           [typesafeKey]: tests_1,
//         };
//         addConflict2(
//           updatedConflicts,
//           `${partIndex}-${testIndex}-${key}`,
//           1
//         );
//       } else if (tests_2 === tests_3) {
//         updatedTests[i] = {
//           ...updatedTests[i],
//           [typesafeKey]: tests_2,
//         };
//         addConflict2(
//           updatedConflicts,
//           `${partIndex}-${testIndex}-${key}`,
//           1
//         );
//       } else {
//         addConflict2(
//           updatedConflicts,
//           `${partIndex}-${testIndex}-${key}`,
//           2
//         );
//       }
//     });
//   });
//   // console.log("updatedTests", updatedTests);
//   return updatedTests;
// };

// const comparePartPasses = (
//   partIndex: number,
//   pass_1: PartData[],
//   pass_2: PartData[],
//   pass_3: PartData[]
// ): PartData[] => {
//   const updatedParts = [...(editedEntry.parts ?? [])];
//   pass_1.forEach((part, i) => {
//     Object.entries(part).map(([key]) => {
//       type PartDataKey = keyof PartData;
//       const typesafeKey = key as PartDataKey;
//       const parts_1 = pass_1[i][typesafeKey];
//       const parts_2 = pass_2[i][typesafeKey];
//       const parts_3 = pass_3[i][typesafeKey];

//       if (key === "id") {
//         return;
//       }
//       if (key === "sees") {
//         const updatedSEETests = compareSEETestPasses(
//           partIndex,
//           i,
//           parts_1 as SEEData[],
//           parts_2 as SEEData[],
//           parts_3 as SEEData[]
//         );
//         updatedParts[i] = {
//           ...updatedParts[i],
//           [typesafeKey]: updatedSEETests,
//         };
//         return;
//       }
//       if (key === "tids") {
//         const updatedTIDTests = compareTIDTestPasses(
//           partIndex,
//           i,
//           parts_1 as TIDData[],
//           parts_2 as TIDData[],
//           parts_3 as TIDData[]
//         );
//         updatedParts[i] = {
//           ...updatedParts[i],
//           [typesafeKey]: updatedTIDTests,
//         };
//         return;
//       }
//       if (key === "dds") {
//         const updatedDDTests = compareDDTestPasses(
//           partIndex,
//           i,
//           parts_1 as DDData[],
//           parts_2 as DDData[],
//           parts_3 as DDData[]
//         );
//         updatedParts[i] = {
//           ...updatedParts[i],
//           [typesafeKey]: updatedDDTests,
//         };
//         return;
//       }

//       if (
//         parts_1 === parts_2 &&
//         parts_1 === parts_3 &&
//         parts_2 === parts_3
//       ) {
//         updatedParts[partIndex] = {
//           ...updatedParts[partIndex],
//           [typesafeKey]: parts_1,
//         };
//       } else if (parts_1 === parts_2 || parts_1 === parts_3) {
//         updatedParts[partIndex] = {
//           ...updatedParts[partIndex],
//           [typesafeKey]: parts_1,
//         };
//         addConflict2(updatedConflicts, `${partIndex}-${key}`, 1);
//       } else if (parts_2 === parts_3) {
//         updatedParts[partIndex] = {
//           ...updatedParts[partIndex],
//           [typesafeKey]: parts_2,
//         };
//         addConflict2(updatedConflicts, `${partIndex}-${key}`, 1);
//       } else {
//         // console.log("parts_1", parts_1);
//         // console.log("parts_2", parts_2);
//         // console.log("parts_3", parts_3);
//         addConflict2(updatedConflicts, `${partIndex}-${key}`, 2);
//       }
//     });
//   });
//   console.log("updatedParts", updatedParts);
//   return updatedParts;
// };
