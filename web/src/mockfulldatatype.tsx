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
    name: "This is a test name",
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
        name: "A1308KUA-2-S",
        type: "Hall Effect Sensor",
        manufacturer: "Allegro Microsystems",
        testing_location: "Terrestrial",
        tids: [
          {
            id: 0,
            source: "Co60",
            data_type: 0,
            max_fluence: 0,
            energy: 0,
            facility: "Canadian Light Source",
            environment: "Forest",
            terrestrial: true,
            flight: false,
            max_tid: 0,
            dose_rate: 1.6934,
            eldrs: true,
            p_pion: false,
            dose_to_failure: 55.4,
            increased_power_usage: false,
            power_usage_description: "string",
            special_notes:
              "This is a test to make sure that the rendering works",
          },
          {
            id: 0,
            source: "Protons",
            data_type: 567,
            max_fluence: 5.44444444,
            energy: 90,
            facility: "string",
            environment: "string",
            terrestrial: false,
            flight: true,
            max_tid: 2495023,
            dose_rate: 333,
            eldrs: false,
            p_pion: false,
            dose_to_failure: 0,
            increased_power_usage: false,
            power_usage_description: "string",
            special_notes: "This is a second test on this guy",
          },
        ],
        sees: [
          {
            id: 0,
            source: "Protons",
            type: "Single Event Upset",
            max_fluence: 0,
            energy: 0,
            facility: "string",
            environment: "string",
            terrestrial: true,
            flight: false,
            amplitude: 490,
            duration: 0,
            cross_section: 0,
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
    name: "This is a test name",
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
        name: "A1308KUA-2-T",
        type: "Hall Effect Sensor",
        manufacturer: "Allegro Microsystems",
        testing_location: "Terrestrial",
        tids: [
          {
            id: 0,
            source: "Co61",
            data_type: 0,
            max_fluence: 0,
            energy: 0,
            facility: "Canadian Light Source",
            environment: "Forest",
            terrestrial: true,
            flight: false,
            max_tid: 0,
            dose_rate: 1.6934,
            eldrs: true,
            p_pion: false,
            dose_to_failure: 55.4,
            increased_power_usage: false,
            power_usage_description: "string",
            special_notes:
              "This is a test to make sure that the rendering works",
          },
          {
            id: 0,
            source: "Electrons",
            data_type: 567,
            max_fluence: 5.44444444,
            energy: 90,
            facility: "string",
            environment: "string",
            terrestrial: false,
            flight: true,
            max_tid: 2495023,
            dose_rate: 333,
            eldrs: false,
            p_pion: false,
            dose_to_failure: 0,
            increased_power_usage: false,
            power_usage_description: "string",
            special_notes: "This is a second test on this guy",
          },
        ],
        sees: [
          {
            id: 0,
            source: "Neutron",
            type: "Single Event Upset",
            max_fluence: 0,
            energy: 0,
            facility: "string",
            environment: "string",
            terrestrial: true,
            flight: false,
            amplitude: 490,
            duration: 0,
            cross_section: 0,
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
    name: "This is a test name",
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
        name: "A1308KUA-2-U",
        type: "Hall Effect Sensor",
        manufacturer: "Allegro Microsystems",
        testing_location: "Terrestrial",
        tids: [
          {
            id: 0,
            source: "Co60",
            data_type: 0,
            max_fluence: 0,
            energy: 0,
            facility: "Canadian Light Source",
            environment: "Forest",
            terrestrial: true,
            flight: false,
            max_tid: 0,
            dose_rate: 1.6934,
            eldrs: true,
            p_pion: false,
            dose_to_failure: 55.4,
            increased_power_usage: false,
            power_usage_description: "string",
            special_notes:
              "This is a test to make sure that the rendering works",
          },
          {
            id: 0,
            source: "Protons",
            data_type: 567,
            max_fluence: 5.44444444,
            energy: 90,
            facility: "string",
            environment: "string",
            terrestrial: false,
            flight: true,
            max_tid: 2495023,
            dose_rate: 333,
            eldrs: false,
            p_pion: false,
            dose_to_failure: 0,
            increased_power_usage: false,
            power_usage_description: "string",
            special_notes: "This is a second test on this guy",
          },
        ],
        sees: [
          {
            id: 0,
            source: "Protons",
            type: "Single Event Upset",
            max_fluence: 0,
            energy: 0,
            facility: "string",
            environment: "string",
            terrestrial: true,
            flight: false,
            amplitude: 490,
            duration: 0,
            cross_section: 0,
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
  name: "This is a test name",
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
      name: "A1308KUA-2-T",
      type: "Hall Effect Sensor",
      manufacturer: "Allegro Microsystems",
      testing_location: "Terrestrial",
      tids: [
        {
          id: 0,
          source: "Co60",
          data_type: 0,
          max_fluence: 0,
          energy: 0,
          facility: "Canadian Light Source",
          environment: "Forest",
          terrestrial: true,
          flight: false,
          max_tid: 0,
          dose_rate: 1.6934,
          eldrs: true,
          p_pion: false,
          dose_to_failure: 55.4,
          increased_power_usage: false,
          power_usage_description: "string",
          special_notes: "This is a test to make sure that the rendering works",
        },
        {
          id: 0,
          source: "Protons",
          data_type: 567,
          max_fluence: 5.44444444,
          energy: 90,
          facility: "string",
          environment: "string",
          terrestrial: false,
          flight: true,
          max_tid: 2495023,
          dose_rate: 333,
          eldrs: false,
          p_pion: false,
          dose_to_failure: 0,
          increased_power_usage: false,
          power_usage_description: "string",
          special_notes: "This is a second test on this guy",
        },
      ],
      sees: [
        {
          id: 0,
          source: "Protons",
          type: "Single Event Upset",
          max_fluence: 0,
          energy: 0,
          facility: "string",
          environment: "string",
          terrestrial: true,
          flight: false,
          amplitude: 490,
          duration: 0,
          cross_section: 0,
          cross_section_type: "string",
          special_notes: "This is to test a different type of test showing up",
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
