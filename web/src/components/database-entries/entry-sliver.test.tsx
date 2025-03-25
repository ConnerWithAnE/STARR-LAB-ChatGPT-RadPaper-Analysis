import { describe, expect, test } from "@jest/globals";
import { FullDataType } from "../../types/types";

// test data
export const mockFullDataTypePasses3: FullDataType[] = [
  {
    name: "",
    year: 1998,
    authors: [{ name: "big gamer" }, { name: "small gamer" }],
    parts: [
      {
        name: "DKJFKLSD-23",
        type: "transistor",
        manufacturer: "Texas Instruments",
        preliminary_test_types: ["SEE", "DD"],
        sees: [
          {
            source: "Heavy ions",
            amplitude: 100,
            duration: 0,
            cross_section_saturation: 0,
            cross_section_type: "string",
          },
        ],
        dds: [
          {
            source: "Protons",
            environmental_conditions: "pretty good actually",
            max_fluence: 94,
          },
        ],
      },
    ],
  },
  {
    name: "oh yippee",
    year: 1998,
    authors: [{ name: "big gamer" }, { name: "small gamer" }],
    parts: [
      {
        name: "DKJFKLSD-23",
        type: "microchip",
        manufacturer: "Texas Instruments",
        preliminary_test_types: ["SEE", "DD"],
        sees: [
          {
            source: "Heavy ions",
            amplitude: 100,
            duration: 0,
            cross_section_saturation: 0,
            cross_section_type: "string",
          },
        ],
        dds: [
          {
            source: "Protons",
            environmental_conditions: "pretty good actually",
            max_fluence: 94,
          },
        ],
      },
    ],
  },
  {
    name: "oh yippee",
    year: 1998,
    authors: [{ name: "big gamer" }, { name: "small gamer" }],
    parts: [
      {
        name: "DKJFKLSD-23",
        type: "transistor",
        manufacturer: "Texas Instruments",
        preliminary_test_types: ["SEE", "DD"],
        sees: [
          {
            source: "Heavy ions",
            amplitude: 100,
            duration: 0,
            cross_section_saturation: 0,
            cross_section_type: "string",
          },
        ],
        dds: [
          {
            source: "Protons",
            environmental_conditions: "pretty good actually",
            max_fluence: 94,
          },
        ],
      },
    ],
  },
];

describe("entry sliver component", () => {
  test("should render", () => {
    expect(true).toBe(true);
  });
});
