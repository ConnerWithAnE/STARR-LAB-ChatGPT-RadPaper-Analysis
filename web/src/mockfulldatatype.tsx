import { FullDataType, GPTResponse2, PartData } from "./types/types";

// export type FullDataType = {
//   id: number;
//   name: string;
//   year: number;
//   authors: AuthorData[];
//   parts: PartData[];
// };

export const mockFullDataTypePasses: FullDataType[] = [
  {
    id: 0,
    paper_name: "This is a test name",
    year: 2024,
    authors: [
      {
        id: 0,
        name: "Mickey McKafee",
      },
      {
        id: 1,
        name: "Andrew Yang",
      },
    ],
    parts: [
      {
        id: 0,
        device_name: "A1308KUA-2-S",
        component_type: "Hall Effect Sensor",
        manufacturer: "Allegro Microsystems",
        other_details: "other",
        preliminary_test_types: ['TID', 'DD'
        ],
        tids: [
          {
            id: 0,
            source: "Co60",
            max_tid: 0,
            dose_rate: 1.6934,
            eldrs: true,
            dose_to_failure: 55.4,
            increased_power_usage: false,
            power_usage_description: "string",
            special_notes:
              "This is a test to make sure that the rendering works",
          },
          {
            id: 0,
            source: "Co60",
            max_tid: 0,
            dose_rate: 1.6934,
            eldrs: true,
            dose_to_failure: 55.4,
            increased_power_usage: false,
            power_usage_description: "string",
            special_notes:
              "This is a test to make sure that the rendering works",
          },
        ],
        sees: [
          {
            id: 0,
            source: "Protons",
            amplitude: 490,
            duration: 0,
            cross_section_saturation: 0,
            cross_section_type: "string",
            special_notes:
              "This is to test a different type of test showing up",
          },
        ],
      } as PartData,
    ],
  },
  {
    id: 0,
    paper_name: "This is a test name",
    year: 2024,
    authors: [
      {
        id: 0,
        name: "Mickey McKane",
      },
      {
        id: 1,
        name: "Andrew Yu",
      },
    ],
    parts: [
      {
        id: 0,
        device_name: "A1308KUA-2-S",
        component_type: "Hall Effect Sensor",
        manufacturer: "Allegro Microsystems",
        other_details: "other",
        preliminary_test_types: ['TID', 'DD'
        ],
        tids: [
          {
            id: 0,
            source: "Co60",
            max_tid: 0,
            dose_rate: 1.6934,
            eldrs: true,
            dose_to_failure: 55.4,
            increased_power_usage: false,
            power_usage_description: "string",
            special_notes:
              "This is a test to make sure that the rendering works",
          },
          {
            id: 0,
            source: "Co60",
            max_tid: 0,
            dose_rate: 1.6934,
            eldrs: true,
            dose_to_failure: 55.4,
            increased_power_usage: false,
            power_usage_description: "string",
            special_notes:
              "This is a test to make sure that the rendering works",
          },
        ],
        sees: [
          {
            id: 0,
            source: "Protons",
            amplitude: 490,
            duration: 0,
            cross_section_saturation: 0,
            cross_section_type: "string",
            special_notes:
              "This is to test a different type of test showing up",
          },
        ],
      } as PartData,
    ],
  },
  {
    id: 0,
    paper_name: "This is a test name",
    year: 2024,
    authors: [
      {
        id: 0,
        name: "Mickey McKay",
      },
      {
        id: 1,
        name: "Andrew Yu",
      },
    ],
    parts: [
      {
        id: 0,
        device_name: "A1308KUA-2-S",
        component_type: "Hall Effect Sensor",
        manufacturer: "Allegro Microsystems",
        other_details: "other",
        preliminary_test_types: ['TID', 'DD'
        ],
        tids: [
          {
            id: 0,
            source: "Co60",
            max_tid: 0,
            dose_rate: 1.6934,
            eldrs: true,
            dose_to_failure: 55.4,
            increased_power_usage: false,
            power_usage_description: "string",
            special_notes:
              "This is a test to make sure that the rendering works",
          },
          {
            id: 0,
            source: "Co60",
            max_tid: 0,
            dose_rate: 1.6934,
            eldrs: true,
            dose_to_failure: 55.4,
            increased_power_usage: false,
            power_usage_description: "string",
            special_notes:
              "This is a test to make sure that the rendering works",
          },
        ],
        sees: [
          {
            id: 0,
            source: "Protons",
            amplitude: 490,
            duration: 0,
            cross_section_saturation: 0,
            cross_section_type: "string",
            special_notes:
              "This is to test a different type of test showing up",
          },
        ],
      } as PartData,
    ],
  },
];

export const mockGPTPasses: GPTResponse2[] = [
  {
    pass_1: mockFullDataTypePasses[0],
    pass_2: mockFullDataTypePasses[1],
    pass_3: mockFullDataTypePasses[2],
  },
];

export const mockFullDataType: FullDataType = {
  id: 0,
  paper_name: "This is a test name",
  year: 2024,
  authors: [
    {
      id: 0,
      name: "Mickey McKay",
    },
    {
      id: 1,
      name: "Andrew Yu",
    },
  ],
  parts: 
    [
      {
        id: 0,
        device_name: "A1308KUA-2-S",
        component_type: "Hall Effect Sensor",
        manufacturer: "Allegro Microsystems",
        other_details: "other",
        preliminary_test_types: ['TID', 'DD'],
        tids: [
          {
            id: 0,
            source: "Co60",
            max_tid: 0,
            dose_rate: 1.6934,
            eldrs: true,
            dose_to_failure: 55.4,
            increased_power_usage: false,
            power_usage_description: "string",
            special_notes:
              "This is a test to make sure that the rendering works",
          },
          {
            id: 0,
            source: "Co60",
            max_tid: 0,
            dose_rate: 1.6934,
            eldrs: true,
            dose_to_failure: 55.4,
            increased_power_usage: false,
            power_usage_description: "string",
            special_notes:
              "This is a test to make sure that the rendering works",
          },
        ],
        sees: [
          {
            id: 0,
            source: "Protons",
            amplitude: 490,
            duration: 0,
            cross_section_saturation: 0,
            cross_section_type: "string",
            special_notes:
              "This is to test a different type of test showing up",
          },
        ],
      } as PartData,
  ],
};

// id?: number;
//   source?: "Heavy ions" | "Protons" | "Laser" | "Neutron" | "Electron";
//   type?:
//     | "Single Event Upset"
//     | "Single Event Transient"
//     | "Single Event Functional Interrupt"
//     | "Single Event Latch-up"
//     | "Single Event Burnout"
//     | "Single Event Gate Rupture";
//   max_fluence?: number;
//   energy?: number;
//   facility?: string;
//   environment?: string;
//   terrestrial?: boolean;
//   flight?: boolean;
//   amplitude?: number;
//   duration?: number;
//   cross_section?: number;
//   cross_section_type?: string;
//   special_notes?: string;
