import { describe, expect, test } from "@jest/globals";
import {
  createDDEntries,
  createPartEntries,
  createSEEEntries,
  createTIDEntries,
} from "./compare-passes";
import { SEEData } from "../types/types";

describe("createDDEntries", () => {
  describe("ideal use case - string", () => {
    const mockGPTPasses = [
      [
        {
          facility: "Canadian Light Source",
          environment: "Oxygen-deprived",
        },
      ],
      [
        {
          facility: "Canadian Light Source",
          environment: "Oxygen-deprived",
        },
      ],
      [
        {
          facility: "Canadian Light Source",
          environment: "Oxygen-deprived",
        },
      ],
    ];
    const expectedParts = [
      {
        facility: "Canadian Light Source",
        environment: "Oxygen-deprived",
      },
    ];

    test("createDDEntries returns same object as GPTPasses", () => {
      expect(
        createDDEntries(
          [],
          mockGPTPasses[0],
          mockGPTPasses[1],
          mockGPTPasses[2]
        )
      ).toStrictEqual(expectedParts);
    });
  });
  describe("yellow conflict - string", () => {
    const mockGPTPasses = [
      [
        {
          facility: "Canadian Light Source",
          environment: "Water",
        },
      ],
      [
        {
          facility: "Canadian Light Source",
          environment: "Water",
        },
      ],
      [
        {
          facility: "Canadian Light Source",
          environment: "Oxygen-deprived",
        },
      ],
    ];
    const expectedParts = [
      {
        facility: "Canadian Light Source",
        environment: "Water",
      },
    ];

    test("createDDEntries returns object with 'water' as environment", () => {
      expect(
        createDDEntries(
          [],
          mockGPTPasses[0],
          mockGPTPasses[1],
          mockGPTPasses[2]
        )
      ).toStrictEqual(expectedParts);
    });
  });

  describe("red conflict - string", () => {
    const mockGPTPasses = [
      [
        {
          facility: "Canadian Light Source",
          environment: "Water",
        },
      ],
      [
        {
          facility: "Canadian Light Source",
          environment: "Space",
        },
      ],
      [
        {
          facility: "Canadian Light Source",
          environment: "Oxygen-deprived",
        },
      ],
    ];
    const expectedParts = [
      {
        facility: "Canadian Light Source",
        environment: null,
      },
    ];

    test("createDDEntries returns object with 'null' as environment", () => {
      expect(
        createDDEntries(
          [],
          mockGPTPasses[0],
          mockGPTPasses[1],
          mockGPTPasses[2]
        )
      ).toStrictEqual(expectedParts);
    });
  });

  describe("different data types", () => {
    const mockGPTPasses = [
      [
        {
          flight: true,
          damage_level: 5.4,
        },
      ],
      [
        {
          flight: true,
          damage_level: 5.4,
        },
      ],
      [
        {
          flight: true,
          damage_level: 5.4,
        },
      ],
    ];
    const expectedParts = [
      {
        flight: true,
        damage_level: 5.4,
      },
    ];

    test("createDDEntries returns same object as in gptPasses", () => {
      expect(
        createDDEntries(
          [],
          mockGPTPasses[0],
          mockGPTPasses[1],
          mockGPTPasses[2]
        )
      ).toStrictEqual(expectedParts);
    });
  });

  describe("red conflicts in number type", () => {
    const mockGPTPasses = [
      [
        {
          flight: true,
          damage_level: 2.4342,
        },
      ],
      [
        {
          flight: true,
          damage_level: 5.4,
        },
      ],
      [
        {
          flight: true,
          damage_level: 11.239,
        },
      ],
    ];
    const expectedParts = [
      {
        flight: true,
        damage_level: null,
      },
    ];

    test("createDDEntries returns null in damage_level", () => {
      expect(
        createDDEntries(
          [],
          mockGPTPasses[0],
          mockGPTPasses[1],
          mockGPTPasses[2]
        )
      ).toStrictEqual(expectedParts);
    });
  });

  describe("multiple tests", () => {
    let mockGPTPasses = [
      [
        {
          flight: true,
          damage_level: 2.4342,
        },
        {
          type: "Single Event Upset",
          max_fluence: 34,
          energy: 23,
        },
      ],
      [
        {
          flight: true,
          damage_level: 2.4342,
        },
        {
          type: "Single Event Upset",
          max_fluence: 34,
          energy: 23,
        },
      ],
      [
        {
          flight: true,
          damage_level: 2.4342,
        },
        {
          type: "Single Event Upset",
          max_fluence: 34,
          energy: 23,
        },
      ],
    ];
    let expectedParts = [
      {
        flight: true,
        damage_level: 2.4342,
      },
      {
        type: "Single Event Upset",
        max_fluence: 34,
        energy: 23,
      },
    ];

    test("createDDEntries returns expectedParts", () => {
      expect(
        createDDEntries(
          [],
          mockGPTPasses[0],
          mockGPTPasses[1],
          mockGPTPasses[2]
        )
      ).toStrictEqual(expectedParts);
    });

    mockGPTPasses = [
      [
        {
          flight: false,
          damage_level: 2.4342,
        },
        {
          type: "Single Event Functional Interrupt",
          max_fluence: 24,
          energy: 23,
        },
      ],
      [
        {
          flight: false,
          damage_level: 2.4342,
        },
        {
          type: "Single Event Functional Interrupt",
          max_fluence: 24,
          energy: 23,
        },
      ],
      [
        {
          flight: true,
          damage_level: 2.4342,
        },
        {
          type: "Single Event Upset",
          max_fluence: 34,
          energy: 23,
        },
      ],
    ];
    expectedParts = [
      {
        flight: false,
        damage_level: 2.4342,
      },
      {
        type: "Single Event Functional Interrupt",
        max_fluence: 24,
        energy: 23,
      },
    ];

    test("createDDEntries updates the right properties and puts them in the right place", () => {
      expect(
        createDDEntries(
          [],
          mockGPTPasses[0],
          mockGPTPasses[1],
          mockGPTPasses[2]
        )
      ).toStrictEqual(expectedParts);
    });
  });
});

describe("createTIDEntries", () => {
  describe("ideal use case", () => {
    const mockGPTPasses = [
      [
        {
          energy: 90,
          terrestrial: true,
          facility: "Canadian Light Source",
          environment: "Oxygen-deprived",
        },
      ],
      [
        {
          energy: 90,
          terrestrial: true,
          facility: "Canadian Light Source",
          environment: "Oxygen-deprived",
        },
      ],
      [
        {
          energy: 90,
          terrestrial: true,
          facility: "Canadian Light Source",
          environment: "Oxygen-deprived",
        },
      ],
    ];
    const expectedParts = [
      {
        energy: 90,
        terrestrial: true,
        facility: "Canadian Light Source",
        environment: "Oxygen-deprived",
      },
    ];

    test("createTIDEntries returns same object as GPTPasses", () => {
      expect(
        createTIDEntries(
          [],
          mockGPTPasses[0],
          mockGPTPasses[1],
          mockGPTPasses[2]
        )
      ).toStrictEqual(expectedParts);
    });
  });

  describe("yellow conflict", () => {
    const mockGPTPasses = [
      [
        {
          energy: 4,
          terrestrial: true,
          facility: "USask",
          environment: "Oxygen-deprived",
        },
      ],
      [
        {
          energy: 4,
          terrestrial: false,
          facility: "USask",
          environment: "Oxygen-deprived",
        },
      ],
      [
        {
          energy: 90,
          terrestrial: true,
          facility: "Canadian Light Source",
          environment: "Oxygen",
        },
      ],
    ];
    const expectedParts = [
      {
        energy: 4,
        terrestrial: true,
        facility: "USask",
        environment: "Oxygen-deprived",
      },
    ];

    test("createTIDEntries returns expectedParts", () => {
      expect(
        createTIDEntries(
          [],
          mockGPTPasses[0],
          mockGPTPasses[1],
          mockGPTPasses[2]
        )
      ).toStrictEqual(expectedParts);
    });
  });

  describe("red conflict", () => {
    const mockGPTPasses = [
      [
        {
          energy: 30,
          terrestrial: true,
          facility: "",
          environment: "",
        },
      ],
      [
        {
          energy: 4,
          terrestrial: false,
          facility: "USask",
          environment: "Oxygen-deprived",
        },
      ],
      [
        {
          energy: 90,
          terrestrial: true,
          facility: "Canadian Light Source",
          environment: "Oxygen",
        },
      ],
    ];
    const expectedParts = [
      {
        energy: null,
        terrestrial: true,
        facility: null,
        environment: null,
      },
    ];

    test("createTIDEntries returns expectedParts whose values that don't have 1 match are null", () => {
      expect(
        createTIDEntries(
          [],
          mockGPTPasses[0],
          mockGPTPasses[1],
          mockGPTPasses[2]
        )
      ).toStrictEqual(expectedParts);
    });
  });

  describe("multiple tests", () => {
    let mockGPTPasses = [
      [
        {
          energy: 90,
          terrestrial: true,
          facility: "Canadian Light Source",
          environment: "Oxygen-deprived",
        },
        {
          dose_to_failure: 60,
          increased_power_usage: false,
          power_usage_description: "this is so cool yippee",
        },
      ],
      [
        {
          energy: 90,
          terrestrial: true,
          facility: "Canadian Light Source",
          environment: "Oxygen-deprived",
        },
        {
          dose_to_failure: 60,
          increased_power_usage: false,
          power_usage_description: "this is so cool yippee",
        },
      ],
      [
        {
          energy: 90,
          terrestrial: true,
          facility: "Canadian Light Source",
          environment: "Oxygen-deprived",
        },
        {
          dose_to_failure: 60,
          increased_power_usage: false,
          power_usage_description: "this is so cool yippee",
        },
      ],
    ];
    let expectedParts = [
      {
        energy: 90,
        terrestrial: true,
        facility: "Canadian Light Source",
        environment: "Oxygen-deprived",
      },
      {
        dose_to_failure: 60,
        increased_power_usage: false,
        power_usage_description: "this is so cool yippee",
      },
    ];

    test("createTIDEntries returns same object as GPTPasses", () => {
      expect(
        createTIDEntries(
          [],
          mockGPTPasses[0],
          mockGPTPasses[1],
          mockGPTPasses[2]
        )
      ).toStrictEqual(expectedParts);
    });

    mockGPTPasses = [
      [
        {
          energy: 90,
          terrestrial: true,
          facility: "USask",
          environment: "Oxygen-deprived",
        },
        {
          dose_to_failure: 1,
          increased_power_usage: true,
          power_usage_description: "this is not cool anymore",
        },
      ],
      [
        {
          energy: 90,
          terrestrial: true,
          facility: "USask",
          environment: "Oxygen-deprived",
        },
        {
          dose_to_failure: 1,
          increased_power_usage: true,
          power_usage_description: "this is so cool yippee",
        },
      ],
      [
        {
          energy: 90,
          terrestrial: true,
          facility: "Canadian Light Source",
          environment: "Oxygen-deprived",
        },
        {
          dose_to_failure: 60,
          increased_power_usage: false,
          power_usage_description: "this is not cool anymore",
        },
      ],
    ];
    expectedParts = [
      {
        energy: 90,
        terrestrial: true,
        facility: "USask",
        environment: "Oxygen-deprived",
      },
      {
        dose_to_failure: 1,
        increased_power_usage: true,
        power_usage_description: "this is not cool anymore",
      },
    ];

    test("createTIDEntries updates the right properties and keeps them in the right place", () => {
      expect(
        createTIDEntries(
          [],
          mockGPTPasses[0],
          mockGPTPasses[1],
          mockGPTPasses[2]
        )
      ).toStrictEqual(expectedParts);
    });
  });
});

describe("createSEEEntries", () => {
  describe("ideal use case", () => {
    const mockGPTPasses = [
      [
        {
          cross_section: 10,
          cross_section_type: "TID",
        },
      ],
      [
        {
          cross_section: 10,
          cross_section_type: "TID",
        },
      ],
      [
        {
          cross_section: 10,
          cross_section_type: "TID",
        },
      ],
    ];
    const expectedParts = [
      {
        cross_section: 10,
        cross_section_type: "TID",
      },
    ];

    test("createSEEEntries returns same object as GPTPasses", () => {
      expect(
        createSEEEntries(
          [],
          mockGPTPasses[0],
          mockGPTPasses[1],
          mockGPTPasses[2]
        )
      ).toStrictEqual(expectedParts);
    });
  });

  describe("yellow conflict", () => {
    const mockGPTPasses = [
      [
        {
          cross_section: 10,
          cross_section_type: "TID",
        },
      ],
      [
        {
          cross_section: 10,
          cross_section_type: "DD",
        },
      ],
      [
        {
          cross_section: 10,
          cross_section_type: "DD",
        },
      ],
    ];
    const expectedParts = [
      {
        cross_section: 10,
        cross_section_type: "DD",
      },
    ];

    test("createSEEEntries returns expectedParts", () => {
      expect(
        createSEEEntries(
          [],
          mockGPTPasses[0],
          mockGPTPasses[1],
          mockGPTPasses[2]
        )
      ).toStrictEqual(expectedParts);
    });
  });

  describe("red conflict", () => {
    const mockGPTPasses = [
      [
        {
          cross_section: 10,
          cross_section_type: "SEE",
        },
      ],
      [
        {
          cross_section: 10,
          cross_section_type: "TID",
        },
      ],
      [
        {
          cross_section: 10,
          cross_section_type: "DD",
        },
      ],
    ];
    const expectedParts = [
      {
        cross_section: 10,
        cross_section_type: null,
      },
    ];

    test("createSEEEntries returns expectedParts whose values that don't have 1 match are null", () => {
      expect(
        createSEEEntries(
          [],
          mockGPTPasses[0],
          mockGPTPasses[1],
          mockGPTPasses[2]
        )
      ).toStrictEqual(expectedParts);
    });
  });

  describe("multiple tests", () => {
    let mockGPTPasses = [
      [
        {
          cross_section: 10,
          cross_section_type: "TID",
        },
        {
          type: "Single Event Latch-up" as SEEData["type"],
          max_fluence: 34,
          energy: 2340,
        },
      ],
      [
        {
          cross_section: 10,
          cross_section_type: "TID",
        },
        {
          type: "Single Event Latch-up" as SEEData["type"],
          max_fluence: 34,
          energy: 2340,
        },
      ],
      [
        {
          cross_section: 10,
          cross_section_type: "TID",
        },
        {
          type: "Single Event Latch-up" as SEEData["type"],
          max_fluence: 34,
          energy: 2340,
        },
      ],
    ];
    let expectedParts = [
      {
        cross_section: 10,
        cross_section_type: "TID",
      },
      {
        type: "Single Event Latch-up" as SEEData["type"],
        max_fluence: 34,
        energy: 2340,
      },
    ];

    test("createSEEEntries returns same object as GPTPasses", () => {
      expect(
        createSEEEntries(
          [],
          mockGPTPasses[0],
          mockGPTPasses[1],
          mockGPTPasses[2]
        )
      ).toStrictEqual(expectedParts);
    });

    mockGPTPasses = [
      [
        {
          cross_section: 10,
          cross_section_type: "TID",
        },
        {
          type: "Single Event Functional Interrupt" as SEEData["type"],
          max_fluence: 34,
          energy: 2340,
        },
      ],
      [
        {
          cross_section: 0.3,
          cross_section_type: "TID",
        },
        {
          type: "Single Event Functional Interrupt" as SEEData["type"],
          max_fluence: 34,
          energy: 100,
        },
      ],
      [
        {
          cross_section: 0.3,
          cross_section_type: "TID",
        },
        {
          type: "Single Event Latch-up" as SEEData["type"],
          max_fluence: 34,
          energy: 100,
        },
      ],
    ];
    expectedParts = [
      {
        cross_section: 0.3,
        cross_section_type: "TID",
      },
      {
        type: "Single Event Functional Interrupt" as SEEData["type"],
        max_fluence: 34,
        energy: 100,
      },
    ];

    test("createSEEEntries returns same object as GPTPasses", () => {
      expect(
        createSEEEntries(
          [],
          mockGPTPasses[0],
          mockGPTPasses[1],
          mockGPTPasses[2]
        )
      ).toStrictEqual(expectedParts);
    });
  });
});
