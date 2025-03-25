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

export const mockFullDataTypePasses3: FullDataType[] = [
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

export const mockFullDataTypePasses4: FullDataType[] = [
  {
    name: "testing 123",
    year: 2000,
    authors: [{ name: "big gamer" }, { name: "small gamer" }],
    parts: [
      {
        name: "SDKJKLFL-23",
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
    name: "testing 123",
    year: 2000,
    authors: [{ name: "big gamer" }, { name: "small gamer" }],
    parts: [
      {
        name: "SDKJKLFL-23",
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
    name: "testing 123",
    year: 2000,
    authors: [{ name: "big gamer" }, { name: "small gamer" }],
    parts: [
      {
        name: "SDKJKLFL-23",
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
            environmental_conditions: "not that great",
            max_fluence: 94,
          },
        ],
      },
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

export const mockGPTPasses2: GPTResponse[] = [
  {
    pass_1: mockFullDataTypePasses3[0],
    pass_2: mockFullDataTypePasses3[1],
    pass_3: mockFullDataTypePasses3[2],
  },
  {
    pass_1: mockFullDataTypePasses4[0],
    pass_2: mockFullDataTypePasses4[1],
    pass_3: mockFullDataTypePasses4[2],
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


export const mockfrompaper3: GPTResponse[] = [
  {
    "pass_1": {
      "name": "Radiation Effects Predicted, Observed, and Compared for Spacecraft Systems",
      "year": 2002,
      "authors": [
        {
          "name": "Bruce E. Pritchard"
        },
        {
          "name": "Gary M. Swift"
        },
        {
          "name": "Allan H. Johnston"
        }
      ],
      "objective": "The main objective of the paper is to document radiation effects observed in selected spacecraft at the system and subsystem levels, relate them to predicted radiation effects in parts, and provide guidance in designs of future spacecraft electronics to have improved tolerance to various radiation effects.",
      "parts": [
        {
          "name": "BlackJack GPS Receiver",
          "type": "GPS Receiver",
          "manufacturer": "Not specified",
          "other_details": "Contains many SEE-sensitive parts; no destructive latchup observed after more than four cumulative years on orbit【8:0†source】.",
          "preliminary_test_types": [
            "SEE"
          ],
          "sees": [
            {
              "max_fluence": 0,
              "energy_levels": "Not specified",
              "facility_name": "Jet Propulsion Laboratory",
              "environmental_conditions": "On-orbit",
              "terrestrial": false,
              "flight": true,
              "source": "Heavy ions",
              "type": "SEU",
              "amplitude": 0,
              "duration": 0,
              "cross_section_saturation": 0,
              "cross_section_threshold": 0,
              "cross_section_type": "Not specified",
              "special_notes": "No destructive latchup observed after more than four cumulative years on orbit【64:1†Radiation_effects_predicted_observed_and_compared_for_spacecraft_systems.pdf】."
            }
          ],
          "tids": [],
          "dds": []
        },
        {
          "name": "CGS74LCT2524",
          "type": "Clock Driver",
          "manufacturer": "Not specified",
          "other_details": "Showed no latchup sensitivity during testing【8:0†source】.",
          "preliminary_test_types": [
            "SEE"
          ],
          "sees": [
            {
              "max_fluence": 0,
              "energy_levels": "Not specified",
              "facility_name": "Jet Propulsion Laboratory",
              "environmental_conditions": "Not specified",
              "terrestrial": true,
              "flight": false,
              "source": "Heavy ions",
              "type": "SEL",
              "amplitude": 0,
              "duration": 0,
              "cross_section_saturation": 0,
              "cross_section_threshold": 0,
              "cross_section_type": "Not specified",
              "special_notes": "Showed no latchup sensitivity during testing【68:0†Radiation_effects_predicted_observed_and_compared_for_spacecraft_systems.pdf】."
            }
          ],
          "tids": [],
          "dds": []
        },
        {
          "name": "LMC6081",
          "type": "Operational Amplifier",
          "manufacturer": "Not specified",
          "other_details": "Showed no latchup sensitivity during testing【8:0†source】.",
          "preliminary_test_types": [
            "SEE"
          ],
          "sees": [
            {
              "max_fluence": 0,
              "energy_levels": "Not specified",
              "facility_name": "Jet Propulsion Laboratory",
              "environmental_conditions": "Not specified",
              "terrestrial": true,
              "flight": false,
              "source": "Heavy ions",
              "type": "SEL",
              "amplitude": 0,
              "duration": 0,
              "cross_section_saturation": 0,
              "cross_section_threshold": 0,
              "cross_section_type": "Not specified",
              "special_notes": "Showed no latchup sensitivity during testing【72:0†Radiation_effects_predicted_observed_and_compared_for_spacecraft_systems.pdf】."
            }
          ],
          "tids": [],
          "dds": []
        },
        {
          "name": "LTC1153",
          "type": "Circuit Breaker",
          "manufacturer": "Not specified",
          "other_details": "Showed no latchup sensitivity during testing【8:0†source】.",
          "preliminary_test_types": [
            "SEE"
          ],
          "sees": [
            {
              "max_fluence": 0,
              "energy_levels": "Not specified",
              "facility_name": "Jet Propulsion Laboratory",
              "environmental_conditions": "Not specified",
              "terrestrial": true,
              "flight": false,
              "source": "Heavy ions",
              "type": "SEL",
              "amplitude": 0,
              "duration": 0,
              "cross_section_saturation": 0,
              "cross_section_threshold": 0,
              "cross_section_type": "Not specified",
              "special_notes": "Showed no latchup sensitivity during testing【76:5†Radiation_effects_predicted_observed_and_compared_for_spacecraft_systems.pdf】."
            }
          ],
          "tids": [],
          "dds": []
        },
        {
          "name": "MAX962",
          "type": "Comparator",
          "manufacturer": "Not specified",
          "other_details": "Showed no latchup sensitivity during testing【8:0†source】.",
          "preliminary_test_types": [
            "SEE"
          ],
          "sees": [
            {
              "max_fluence": 0,
              "energy_levels": "Not specified",
              "facility_name": "Jet Propulsion Laboratory",
              "environmental_conditions": "Not specified",
              "terrestrial": true,
              "flight": false,
              "source": "Heavy ions",
              "type": "SEL",
              "amplitude": 0,
              "duration": 0,
              "cross_section_saturation": 0,
              "cross_section_threshold": 0,
              "cross_section_type": "Not specified",
              "special_notes": "Showed no latchup sensitivity during testing【80:8†Radiation_effects_predicted_observed_and_compared_for_spacecraft_systems.pdf】."
            }
          ],
          "tids": [],
          "dds": []
        },
        {
          "name": "MC74LCX08",
          "type": "AND Gate",
          "manufacturer": "Not specified",
          "other_details": "Showed no latchup sensitivity during testing【8:0†source】.",
          "preliminary_test_types": [
            "SEE"
          ],
          "sees": [
            {
              "max_fluence": 0,
              "energy_levels": "Not specified",
              "facility_name": "Jet Propulsion Laboratory",
              "environmental_conditions": "Not specified",
              "terrestrial": true,
              "flight": false,
              "source": "Heavy ions",
              "type": "SEL",
              "amplitude": 0,
              "duration": 0,
              "cross_section_saturation": 0,
              "cross_section_threshold": 0,
              "cross_section_type": "Not specified",
              "special_notes": "Showed no latchup sensitivity during testing【84:3†Radiation_effects_predicted_observed_and_compared_for_spacecraft_systems.pdf】."
            }
          ],
          "tids": [],
          "dds": []
        },
        {
          "name": "MC74HC4538",
          "type": "Multivibrator",
          "manufacturer": "Not specified",
          "other_details": "Showed no latchup sensitivity during testing【8:0†source】.",
          "preliminary_test_types": [
            "SEE"
          ],
          "sees": [
            {
              "max_fluence": 0,
              "energy_levels": "Not specified",
              "facility_name": "Jet Propulsion Laboratory",
              "environmental_conditions": "Not specified",
              "terrestrial": true,
              "flight": false,
              "source": "Heavy ions",
              "type": "SEL",
              "amplitude": 0,
              "duration": 0,
              "cross_section_saturation": 0,
              "cross_section_threshold": 0,
              "cross_section_type": "Not specified",
              "special_notes": "Showed no latchup sensitivity during testing【88:0†Radiation_effects_predicted_observed_and_compared_for_spacecraft_systems.pdf】."
            }
          ],
          "tids": [],
          "dds": []
        },
        {
          "name": "SN74LVT16244",
          "type": "Buffer/Driver",
          "manufacturer": "Not specified",
          "other_details": "Showed no latchup sensitivity during testing【8:0†source】.",
          "preliminary_test_types": [
            "SEE"
          ],
          "sees": [
            {
              "max_fluence": 0,
              "energy_levels": "Not specified",
              "facility_name": "Jet Propulsion Laboratory",
              "environmental_conditions": "Not specified",
              "terrestrial": true,
              "flight": false,
              "source": "Heavy ions",
              "type": "SEL",
              "amplitude": 0,
              "duration": 0,
              "cross_section_saturation": 0,
              "cross_section_threshold": 0,
              "cross_section_type": "Not specified",
              "special_notes": "Showed no latchup sensitivity during testing【92:0†Radiation_effects_predicted_observed_and_compared_for_spacecraft_systems.pdf】."
            }
          ],
          "tids": [],
          "dds": []
        },
        {
          "name": "AM29LV800",
          "type": "Flash Memory",
          "manufacturer": "Not specified",
          "other_details": "Showed some latchup sensitivity in testing, rated as moderate risk【8:0†source】.",
          "preliminary_test_types": [
            "SEE"
          ],
          "sees": [
            {
              "max_fluence": 0,
              "energy_levels": "Not specified",
              "facility_name": "Jet Propulsion Laboratory",
              "environmental_conditions": "Not specified",
              "terrestrial": true,
              "flight": false,
              "source": "Heavy ions",
              "type": "SEL",
              "amplitude": 0,
              "duration": 0,
              "cross_section_saturation": 0,
              "cross_section_threshold": 0,
              "cross_section_type": "Not specified",
              "special_notes": "Showed some latchup sensitivity in testing, rated as moderate risk【96:3†Radiation_effects_predicted_observed_and_compared_for_spacecraft_systems.pdf】."
            }
          ],
          "tids": [],
          "dds": []
        },
        {
          "name": "DS1670",
          "type": "System Controller",
          "manufacturer": "Not specified",
          "other_details": "Showed some latchup sensitivity in testing, rated as moderate risk【8:0†source】.",
          "preliminary_test_types": [
            "SEE"
          ],
          "sees": [
            {
              "max_fluence": 0,
              "energy_levels": "Not specified",
              "facility_name": "Jet Propulsion Laboratory",
              "environmental_conditions": "Not specified",
              "terrestrial": true,
              "flight": false,
              "source": "Heavy ions",
              "type": "SEL",
              "amplitude": 0,
              "duration": 0,
              "cross_section_saturation": 0,
              "cross_section_threshold": 0,
              "cross_section_type": "Not specified",
              "special_notes": "Showed some latchup sensitivity in testing, rated as moderate risk【100:10†Radiation_effects_predicted_observed_and_compared_for_spacecraft_systems.pdf】."
            }
          ],
          "tids": [],
          "dds": []
        },
        {
          "name": "DS1803",
          "type": "Digital Potentiometer",
          "manufacturer": "Not specified",
          "other_details": "Showed some latchup sensitivity in testing, rated as moderate risk【8:0†source】.",
          "preliminary_test_types": [
            "SEE"
          ],
          "sees": [
            {
              "max_fluence": 0,
              "energy_levels": "Not specified",
              "facility_name": "Jet Propulsion Laboratory",
              "environmental_conditions": "Not specified",
              "terrestrial": true,
              "flight": false,
              "source": "Heavy ions",
              "type": "SEL",
              "amplitude": 0,
              "duration": 0,
              "cross_section_saturation": 0,
              "cross_section_threshold": 0,
              "cross_section_type": "Not specified",
              "special_notes": "Showed some latchup sensitivity in testing, rated as moderate risk【104:11†Radiation_effects_predicted_observed_and_compared_for_spacecraft_systems.pdf】."
            }
          ],
          "tids": [],
          "dds": []
        },
        {
          "name": "MT48LCIN16",
          "type": "SDRAM",
          "manufacturer": "Not specified",
          "other_details": "Showed some latchup sensitivity in testing, rated as moderate risk【8:0†source】.",
          "preliminary_test_types": [
            "SEE"
          ],
          "sees": [
            {
              "max_fluence": 0,
              "energy_levels": "Not specified",
              "facility_name": "Jet Propulsion Laboratory",
              "environmental_conditions": "Not specified",
              "terrestrial": true,
              "flight": false,
              "source": "Heavy ions",
              "type": "SEL",
              "amplitude": 0,
              "duration": 0,
              "cross_section_saturation": 0,
              "cross_section_threshold": 0,
              "cross_section_type": "Not specified",
              "special_notes": "Showed some latchup sensitivity in testing, rated as moderate risk【108:3†Radiation_effects_predicted_observed_and_compared_for_spacecraft_systems.pdf】."
            }
          ],
          "tids": [],
          "dds": []
        },
        {
          "name": "OR2T15A25240",
          "type": "FPGA",
          "manufacturer": "Not specified",
          "other_details": "Showed some latchup sensitivity in testing, rated as moderate risk【8:0†source】.",
          "preliminary_test_types": [
            "SEE"
          ],
          "sees": [
            {
              "max_fluence": 0,
              "energy_levels": "Not specified",
              "facility_name": "Jet Propulsion Laboratory",
              "environmental_conditions": "Not specified",
              "terrestrial": true,
              "flight": false,
              "source": "Heavy ions",
              "type": "SEL",
              "amplitude": 0,
              "duration": 0,
              "cross_section_saturation": 0,
              "cross_section_threshold": 0,
              "cross_section_type": "Not specified",
              "special_notes": "Showed some latchup sensitivity in testing, rated as moderate risk【112:9†Radiation_effects_predicted_observed_and_compared_for_spacecraft_systems.pdf】."
            }
          ],
          "tids": [],
          "dds": []
        }
      ]
    },
    "pass_2": {
      "name": "Radiation Effects Predicted, Observed, and Compared for Spacecraft Systems",
      "year": 2002,
      "authors": [
        {
          "name": "Bruce E. Pritchard"
        },
        {
          "name": "Gary M. Swift"
        },
        {
          "name": "Allan H. Johnston"
        }
      ],
      "objective": "The main objective of the paper is to document radiation effects observed in selected spacecraft at the system and subsystem levels, relate them to predicted radiation effects in parts, and provide guidance in designs of future spacecraft electronics to have improved tolerance to various radiation effects.",
      "parts": [
        {
          "name": "BlackJack GPS receiver",
          "type": "GPS receiver",
          "manufacturer": "Not specified",
          "other_details": "Contains many SEE-sensitive parts, including DRAMs without EDAC. Tested for latchup sensitivity with some parts showing moderate risk due to low predicted event rates and/or non-destructive nature of observed latchups【8:0†source】.",
          "preliminary_test_types": [
            "SEE"
          ],
          "sees": [
            {
              "max_fluence": 25000000,
              "energy_levels": "10 MeV/nucleon",
              "facility_name": "Jet Propulsion Laboratory",
              "environmental_conditions": "Ground testing with simulated space conditions",
              "terrestrial": true,
              "flight": false,
              "source": "Heavy ions",
              "type": "SEL",
              "amplitude": 0,
              "duration": 0,
              "cross_section_saturation": 0.0001,
              "cross_section_threshold": 0.000001,
              "cross_section_type": "cm^2",
              "special_notes": "Testing included latchup protection circuitry to prevent destructive latchup."
            }
          ],
          "tids": [],
          "dds": []
        },
        {
          "name": "AM29LV800",
          "type": "Flash memory",
          "manufacturer": "Not specified",
          "other_details": "Showed some latchup sensitivity in testing, rated as moderate risk【8:0†source】.",
          "preliminary_test_types": [
            "SEE"
          ],
          "sees": [
            {
              "max_fluence": 10000000,
              "energy_levels": "10 MeV/nucleon",
              "facility_name": "Jet Propulsion Laboratory",
              "environmental_conditions": "Ground testing with simulated space conditions",
              "terrestrial": true,
              "flight": false,
              "source": "Heavy ions",
              "type": "SEL",
              "amplitude": 0,
              "duration": 0,
              "cross_section_saturation": 0.0001,
              "cross_section_threshold": 0.000001,
              "cross_section_type": "cm^2",
              "special_notes": "Testing included latchup protection circuitry to prevent destructive latchup."
            }
          ],
          "tids": [],
          "dds": []
        },
        {
          "name": "DS1670",
          "type": "System controller",
          "manufacturer": "Not specified",
          "other_details": "Showed some latchup sensitivity in testing, rated as moderate risk【8:0†source】.",
          "preliminary_test_types": [
            "SEE"
          ],
          "sees": [
            {
              "max_fluence": 10000000,
              "energy_levels": "10 MeV/nucleon",
              "facility_name": "Jet Propulsion Laboratory",
              "environmental_conditions": "Ground testing with simulated space conditions",
              "terrestrial": true,
              "flight": false,
              "source": "Heavy ions",
              "type": "SEL",
              "amplitude": 0,
              "duration": 0,
              "cross_section_saturation": 0.0001,
              "cross_section_threshold": 0.000001,
              "cross_section_type": "cm^2",
              "special_notes": "Testing included latchup protection circuitry to prevent destructive latchup."
            }
          ],
          "tids": [],
          "dds": []
        },
        {
          "name": "DS1803",
          "type": "Digital potentiometer",
          "manufacturer": "Not specified",
          "other_details": "Showed some latchup sensitivity in testing, rated as moderate risk【8:0†source】.",
          "preliminary_test_types": [
            "SEE"
          ],
          "sees": [
            {
              "max_fluence": 10000000,
              "energy_levels": "10 MeV/nucleon",
              "facility_name": "Jet Propulsion Laboratory",
              "environmental_conditions": "Ground testing with simulated space conditions",
              "terrestrial": true,
              "flight": false,
              "source": "Heavy ions",
              "type": "SEL",
              "amplitude": 0,
              "duration": 0,
              "cross_section_saturation": 0.0001,
              "cross_section_threshold": 0.000001,
              "cross_section_type": "cm^2",
              "special_notes": "Testing included latchup protection circuitry to prevent destructive latchup."
            }
          ],
          "tids": [],
          "dds": []
        },
        {
          "name": "MT48LCIN16",
          "type": "SDRAM",
          "manufacturer": "Not specified",
          "other_details": "Showed some latchup sensitivity in testing, rated as moderate risk【8:0†source】.",
          "preliminary_test_types": [
            "SEE"
          ],
          "sees": [
            {
              "max_fluence": 10000000,
              "energy_levels": "10 MeV/nucleon",
              "facility_name": "Jet Propulsion Laboratory",
              "environmental_conditions": "Ground testing with simulated space conditions",
              "terrestrial": true,
              "flight": false,
              "source": "Heavy ions",
              "type": "SEL",
              "amplitude": 0,
              "duration": 0,
              "cross_section_saturation": 0.0001,
              "cross_section_threshold": 0.000001,
              "cross_section_type": "cm^2",
              "special_notes": "Testing included latchup protection circuitry to prevent destructive latchup."
            }
          ],
          "tids": [],
          "dds": []
        },
        {
          "name": "OR2T15A25240",
          "type": "FPGA",
          "manufacturer": "Not specified",
          "other_details": "Showed some latchup sensitivity in testing, rated as moderate risk【8:0†source】.",
          "preliminary_test_types": [
            "SEE"
          ],
          "sees": [
            {
              "max_fluence": 10000000,
              "energy_levels": "10 MeV/nucleon",
              "facility_name": "Jet Propulsion Laboratory",
              "environmental_conditions": "Ground testing with simulated space conditions",
              "terrestrial": true,
              "flight": false,
              "source": "Heavy ions",
              "type": "SEL",
              "amplitude": 0,
              "duration": 0,
              "cross_section_saturation": 0.0001,
              "cross_section_threshold": 0.000001,
              "cross_section_type": "cm^2",
              "special_notes": "Testing included latchup protection circuitry to prevent destructive latchup."
            }
          ],
          "tids": [],
          "dds": []
        },
        {
          "name": "SA2901",
          "type": "Radiation-hardened CMOS bit-slice",
          "manufacturer": "Sandia",
          "other_details": "Specifically manufactured for the Galileo mission, tested by JPL and found to meet all requirements【8:6†source】.",
          "preliminary_test_types": [
            "TID"
          ],
          "sees": [],
          "tids": [
            {
              "max_fluence": 600000,
              "energy_levels": "Not specified",
              "facility_name": "Jet Propulsion Laboratory",
              "environmental_conditions": "Spacecraft environment",
              "terrestrial": false,
              "flight": true,
              "source": "Heavy ions",
              "max_tid": 600000,
              "dose_rate": 0,
              "eldrs": false,
              "dose_to_failure": 0,
              "increased_power_usage": false,
              "power_usage_description": "Not applicable",
              "failing_time": "Not applicable",
              "special_notes": "The SA2901 was specifically manufactured for the Galileo mission and tested by JPL to meet all requirements."
            }
          ],
          "dds": []
        }
      ]
    },
    "pass_3": {
      "name": "Radiation Effects Predicted, Observed, and Compared for Spacecraft Systems",
      "year": 2002,
      "authors": [
        {
          "name": "Bruce E. Pritchard"
        },
        {
          "name": "Gary M. Swift"
        },
        {
          "name": "Allan H. Johnston"
        }
      ],
      "objective": "The main objective of the paper is to document radiation effects observed in selected spacecraft at the system and subsystem levels, relate them to predicted radiation effects in parts, and provide guidance in designs of future spacecraft electronics to improve tolerance to various radiation effects.",
      "parts": [
        {
          "name": "BlackJack GPS receiver",
          "type": "GPS receiver",
          "manufacturer": "Not specified",
          "other_details": "Contains many SEE-sensitive parts; no destructive latchup observed after more than four cumulative years on orbit【8:0†source】.",
          "preliminary_test_types": [
            "SEE"
          ],
          "sees": [
            {
              "max_fluence": 0,
              "energy_levels": "Not specified",
              "facility_name": "Not specified",
              "environmental_conditions": "On-orbit",
              "terrestrial": false,
              "flight": true,
              "source": "Heavy ions",
              "type": "SEU",
              "amplitude": 0,
              "duration": 0,
              "cross_section_saturation": 0,
              "cross_section_threshold": 0,
              "cross_section_type": "Not specified",
              "special_notes": "No destructive latchup observed after more than four cumulative years on orbit【40:1†source】."
            }
          ],
          "tids": [],
          "dds": []
        },
        {
          "name": "AM29LV800",
          "type": "Flash memory",
          "manufacturer": "Not specified",
          "other_details": "Showed some latchup sensitivity in testing, rated as moderate risk due to low predicted event rates and/or non-destructive nature of observed latchups【8:0†source】.",
          "preliminary_test_types": [
            "SEE"
          ],
          "sees": [
            {
              "max_fluence": 0,
              "energy_levels": "Not specified",
              "facility_name": "Not specified",
              "environmental_conditions": "On-orbit",
              "terrestrial": false,
              "flight": true,
              "source": "Heavy ions",
              "type": "SEL",
              "amplitude": 0,
              "duration": 0,
              "cross_section_saturation": 0,
              "cross_section_threshold": 0,
              "cross_section_type": "Not specified",
              "special_notes": "Rated as moderate risk due to low predicted event rates and/or non-destructive nature of observed latchups【44:1†source】."
            }
          ],
          "tids": [],
          "dds": []
        },
        {
          "name": "DS1670",
          "type": "System controller",
          "manufacturer": "Not specified",
          "other_details": "Showed some latchup sensitivity in testing, rated as moderate risk【8:0†source】.",
          "preliminary_test_types": [
            "SEE"
          ],
          "sees": [
            {
              "max_fluence": 0,
              "energy_levels": "Not specified",
              "facility_name": "Not specified",
              "environmental_conditions": "On-orbit",
              "terrestrial": false,
              "flight": true,
              "source": "Heavy ions",
              "type": "SEL",
              "amplitude": 0,
              "duration": 0,
              "cross_section_saturation": 0,
              "cross_section_threshold": 0,
              "cross_section_type": "Not specified",
              "special_notes": "Rated as moderate risk due to low predicted event rates and/or non-destructive nature of observed latchups【48:9†source】."
            }
          ],
          "tids": [],
          "dds": []
        },
        {
          "name": "DS1803",
          "type": "Digital potentiometer",
          "manufacturer": "Not specified",
          "other_details": "Showed some latchup sensitivity in testing, rated as moderate risk【8:0†source】.",
          "preliminary_test_types": [
            "SEE"
          ],
          "sees": [
            {
              "max_fluence": 0,
              "energy_levels": "Not specified",
              "facility_name": "Not specified",
              "environmental_conditions": "On-orbit",
              "terrestrial": false,
              "flight": true,
              "source": "Heavy ions",
              "type": "SEL",
              "amplitude": 0,
              "duration": 0,
              "cross_section_saturation": 0,
              "cross_section_threshold": 0,
              "cross_section_type": "Not specified",
              "special_notes": "Rated as moderate risk due to low predicted event rates and/or non-destructive nature of observed latchups【52:11†source】."
            }
          ],
          "tids": [],
          "dds": []
        },
        {
          "name": "MT48LCIN16",
          "type": "SDRAM",
          "manufacturer": "Not specified",
          "other_details": "Showed some latchup sensitivity in testing, rated as moderate risk【8:0†source】.",
          "preliminary_test_types": [
            "SEE"
          ],
          "sees": [
            {
              "max_fluence": 0,
              "energy_levels": "Not specified",
              "facility_name": "Not specified",
              "environmental_conditions": "On-orbit",
              "terrestrial": false,
              "flight": true,
              "source": "Heavy ions",
              "type": "SEL",
              "amplitude": 0,
              "duration": 0,
              "cross_section_saturation": 0,
              "cross_section_threshold": 0,
              "cross_section_type": "Not specified",
              "special_notes": "Rated as moderate risk due to low predicted event rates and/or non-destructive nature of observed latchups【56:2†source】."
            }
          ],
          "tids": [],
          "dds": []
        },
        {
          "name": "OR2T15A25240",
          "type": "FPGA",
          "manufacturer": "Not specified",
          "other_details": "Showed some latchup sensitivity in testing, rated as moderate risk【8:0†source】.",
          "preliminary_test_types": [
            "SEE"
          ],
          "sees": [
            {
              "max_fluence": 0,
              "energy_levels": "Not specified",
              "facility_name": "Not specified",
              "environmental_conditions": "On-orbit",
              "terrestrial": false,
              "flight": true,
              "source": "Heavy ions",
              "type": "SEL",
              "amplitude": 0,
              "duration": 0,
              "cross_section_saturation": 0,
              "cross_section_threshold": 0,
              "cross_section_type": "Not specified",
              "special_notes": "Rated as moderate risk due to low predicted event rates and/or non-destructive nature of observed latchups【60:9†source】."
            }
          ],
          "tids": [],
          "dds": []
        },
        {
          "name": "ASIC",
          "type": "Application-Specific Integrated Circuit",
          "manufacturer": "Not specified",
          "other_details": "Observed in ground radiation testing to latch in several ways (both destructively and nondestructively)【8:0†source】.",
          "preliminary_test_types": [
            "SEE"
          ],
          "sees": [
            {
              "max_fluence": 0,
              "energy_levels": "Not specified",
              "facility_name": "Not specified",
              "environmental_conditions": "Ground testing",
              "terrestrial": true,
              "flight": false,
              "source": "Heavy ions",
              "type": "SEL",
              "amplitude": 0,
              "duration": 0,
              "cross_section_saturation": 0,
              "cross_section_threshold": 0,
              "cross_section_type": "Not specified",
              "special_notes": "Observed in ground radiation testing to latch in several ways (both destructively and nondestructively)【64:4†source】."
            }
          ],
          "tids": [],
          "dds": []
        }
      ]
    }
  }
]