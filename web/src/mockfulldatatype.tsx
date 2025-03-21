import { FullDataType, GPTResponse, PartData } from "./types/types";

// export type FullDataType = {
//   id: number;
//   name: string;
//   year: number;
//   authors: AuthorData[];
//   parts: PartData[];
// };

export const mockFullDataTypePasses: FullDataType[] = [
  {
    name: "This is a test name",
    year: 2024,
    objective: "test",
    authors: [
      {
        name: "Mickey McKafee",
      },
      {
        name: "Andrew Yang",
      },
    ],
    parts: [
      {
        name: "A1308KUA-2-S",
        type: "Hall Effect Sensor",
        manufacturer: "Allegro Microsystems",
        other_details: "other",
        preliminary_test_types: ["TID", "DD"],
        tids: [
          {
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
    name: "This is a test name",
    year: 2024,
    objective: "test",
    authors: [
      {
        name: "Mickey McKane",
      },
      {
        name: "Andrew Yu",
      },
    ],
    parts: [
      {
        name: "A1308KUA-2-S",
        type: "Hall Effect Sensor",
        manufacturer: "Allegro Microsystems",
        other_details: "other",
        preliminary_test_types: ["TID", "DD"],
        tids: [
          {
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
    name: "This is a test name",
    year: 2024,
    objective: "test",
    authors: [
      {
        name: "Mickey McKay",
      },
      {
        name: "Andrew Yu",
      },
    ],
    parts: [
      {
        name: "A1308KUA-2-S",
        type: "Hall Effect Sensor",
        manufacturer: "Allegro Microsystems",
        other_details: "other",
        preliminary_test_types: ["TID", "DD"],
        tids: [
          {
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

export const mockFullDataTypePasses2: FullDataType[] = [
  {
    name: "a second test name",
    year: 2024,
    objective: "test",
    authors: [
      {
        name: "whee",
      },
      {
        name: "Andrew Yang",
      },
    ],
    parts: [
      {
        name: "A1308KUA-2-1",
        type: "Hall Effect Sensor",
        manufacturer: "Allegro Microsystems",
        other_details: "other",
        preliminary_test_types: ["TID", "DD"],
        tids: [
          {
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
      {
        name: "SLDFJKLSD-332",
        type: "Hall Effect Sensor",
        manufacturer: "Allegro Microsystems",
        other_details: "other",
        preliminary_test_types: ["TID", "DD"],
        tids: [
          {
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
      {
        name: "AADKDJKLE-22",
        type: "Hall Effect Sensor",
        manufacturer: "Allegro Microsystems",
        other_details: "other",
        preliminary_test_types: ["TID", "DD"],
        tids: [
          {
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
    name: "a second test name",
    year: 2024,
    objective: "test",
    authors: [
      {
        name: "whee",
      },
      {
        name: "Andrew Yu",
      },
    ],
    parts: [
      {
        name: "A1308KUA-2-1",
        type: "Hall Effect Sensor",
        manufacturer: "Allegro Microsystems",
        other_details: "other",
        preliminary_test_types: ["TID", "DD"],
        tids: [
          {
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
      {
        name: "SLDFJKLSD-332",
        type: "Hall Effect Sensor",
        manufacturer: "Allegro Microsystems",
        other_details: "other",
        preliminary_test_types: ["TID", "DD"],
        tids: [
          {
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
      {
        name: "AADKDJKLE-22",
        type: "Hall Effect Sensor",
        manufacturer: "Allegro Microsystems",
        other_details: "other",
        preliminary_test_types: ["TID", "DD"],
        tids: [
          {
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
    name: "a second test name",
    year: 2024,
    objective: "test",
    authors: [
      {
        name: "whee",
      },
      {
        name: "Andrew Yu",
      },
    ],
    parts: [
      {
        name: "A1308KUA-2-1",
        type: "Hall Effect Sensor",
        manufacturer: "Allegro Microsystems",
        other_details: "other",
        preliminary_test_types: ["TID", "DD"],
        tids: [
          {
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
      {
        name: "SLDFJKLSD-332",
        type: "Hall Effect Sensor",
        manufacturer: "Allegro Microsystems",
        other_details: "other",
        preliminary_test_types: ["TID", "DD"],
        tids: [
          {
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
      {
        name: "AADKDJKLE-22",
        type: "Hall Effect Sensor",
        manufacturer: "Allegro Microsystems",
        other_details: "other",
        preliminary_test_types: ["TID", "DD"],
        tids: [
          {
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

export const mockGPTPasses: GPTResponse[] = [
  {
    pass_1: mockFullDataTypePasses[0],
    pass_2: mockFullDataTypePasses[1],
    pass_3: mockFullDataTypePasses[2],
  },
  {
    pass_1: mockFullDataTypePasses2[0],
    pass_2: mockFullDataTypePasses2[1],
    pass_3: mockFullDataTypePasses2[2],
  },
];

export const mockPaperDataType: FullDataType[] = [
  {
    name: "This is a test name",
    year: 2024,
    objective: "test",
    authors: [
      {
        name: "Mickey McKay",
      },
      {
        name: "Andrew Yu",
      },
    ],
    parts: [
      {
        name: "A1308KUA-2-S",
        type: "Hall Effect Sensor",
        manufacturer: "Allegro Microsystems",
        other_details: "other",
        preliminary_test_types: ["TID", "DD"],
        tids: [
          {
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

export const mockPaperDataType2: FullDataType[] = [
  mockPaperDataType[0],
  mockPaperDataType[0],
  mockPaperDataType[0],
  mockPaperDataType[0],
  mockPaperDataType[0],
  mockPaperDataType[0],
  mockPaperDataType[0],
];

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
