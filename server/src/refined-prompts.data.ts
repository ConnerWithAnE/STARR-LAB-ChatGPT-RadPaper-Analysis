export const generalContext = {
  prompt: `You are an expert in radiation effects on electronic components.
      Your task is to analyze and extract relevant data from research papers, focusing on Total Ionizing Dose (TID),
      Single Event Effects (SEE), and Displacement Damage (DD) data for various components.
      Answer the following questions step by step to extract structured and meaningful data.
      
     Ensure the output is formatted exactly as requested.`,
};

export const questions = {
  paperMetaData: {
    prompt: `Extract the following details about the research paper:
        - Paper name  
        - Year of publication  
        - List of author names  
        - What is the main objective of the paper?  

        Return the response as a **valid JSON object** with the following structure:  

        {  
        "type": "object",
        "properties": {
            "paper_name": { "type": "string" },
            "year": { "type": "integer" },
            "authors": { 
                "type": "array", 
                    "items": { 
                        "type": "object", 
                        "properties": { 
                            "name": { "type": "string" } 
                        },
                        "required": ["name"]
                    }
            },
            "objective": { "type": "string" }
        },
          "required": ["paper_name", "year", "authors", "objective"]
        }

        Return only valid JSON with no extra text.`,
    schema: {
      type: "object",
      properties: {
        paper_name: { type: "string" },
        year: { type: "integer" },
        authors: {
          type: "array",
          items: {
            type: "object",
            properties: {
              name: { type: "string" },
            },
            required: ["name"],
          },
        },
        objective: { type: "string" },
      },
      required: ["paper_name", "year", "authors", "objective"],
    },
  },
  componentDetails: {
    prompt: `Identify all of the electronic devices tested in the paper.
        - device name  
        - Type of component (e.g., microprocessor, FPGA, memory chip, etc.)  
        - The manufactuerer of the device
        - Any other relevant details  
        
        Return the response as a **valid JSON object**, an array of components with the following fields 
        
        {
          
        "device_name": { "type": "string" },
        "component_type": { "type": "string" },
        "manufacturer": { "type": "string" },
        "other_details": { "type": "string" }
    
        }
        
        Return only valid JSON with no extra text.`,
    schema: {
      type: "array",
      items: {
        type: "object",
        properties: {
          component_name: { type: "string" },
          type: { type: "string" },
          manufacturer: { type: "string" },
          other_details: { type: "string" },
        },
        required: ["component_name", "type", "manufacturer"],
      },
    },
  },
  testingConditions: {
    prompt: `Describe the conditions under which radiation testing was conducted.:
        - The name of the device provided, you are looking for data corresponding to this
        - Type of testing performed (ONLY ONE OF [ TID, SEE, DD])
        - Maximum fluence in exponential notation
        - Energy levels
        - Facility name
        - Environmental conditions
        - Was the test conducted in a terrestrial setting? (Yes/No)
        - Was the test conducted in-flight? (Yes/No)

        There might be more than one test for the given part, if that is the case return a list of tests pertaining to the part

        Return the response as a **valid JSON object** with the following structure:

        {
            "device_name": <string>,
            "testing_type": "TID | SEE | DD",
            "max_fluence": <number>,
            "energy_levels": "<string>",
            "facility_name": "<string>",
            "environmental_conditions": "<string>",
            "terrestrial": <true | false>,
            "in_flight": <true | false>
        }
            
        Return only valid JSON with no extra text.`,
    schenma: {
      type: "object",
      properties: {
        testing_type: { type: "string", enum: ["TID", "SEE", "DD"] },
        max_fluence: { type: "number" },
        energy_levels: { type: "string" },
        facility_name: { type: "string" },
        environmental_conditions: { type: "string" },
        terrestrial: { type: "boolean" },
        in_flight: { type: "boolean" },
      },
      required: [
        "testing_type",
        "max_fluence",
        "energy_levels",
        "facility_name",
        "environmental_conditions",
        "terrestrial",
        "in_flight",
      ],
    },
  },
  tidData: {
    prompt: `Describe the conditions under which radiation testing was conducted. Extract Total Ionizing Dose (TID) data:
        - The name of the device provided, you are looking for data corresponding to this
        - Maximum fluence in exponential notation
        - Energy levels
        - Facility name
        - Environmental conditions
        - Was the test conducted in a terrestrial setting? (Yes/No)
        - Was the test conducted in-flight? (Yes/No)
        - Source of radiation (Co60, Protons, Electrons, Heavy ions, X-rays, Pions)
        - Maximum TID level
        - Dose rate
        - Was Enhanced Low Dose Rate Sensitivity (ELDRS) observed? (Yes/No)
        - Dose to failure
        - Was increased power usage observed? (Yes/No)
        - Description of power usage increase
        - If power current leakage is present, at what rate
        - How long was it failing for
        - Any special notes

        Return the response as a **valid JSON object** with the following structure:

        {
            "device_name": <string>
            "max_fluence": <number>,
            "energy_levels": "<string>",
            "facility_name": "<string>",
            "environmental_conditions": "<string>",
            "terrestrial": <true | false>,
            "in_flight": <true | false>,
            "source": "Co60 | Protons | Electrons | Heavy ions | X-rays | Pions",
            "max_tid": <number>,
            "dose_rate": <number>,
            "eldrs_observed": <true | false>,
            "dose_to_failure": <number>,
            "increased_power_usage": <true | false>,
            "power_usage_description": "<string>",
            "current_leakage": <number>,
            "failing_time": "<string>",
            "special_notes": "<string>"
        }
            
        Return only valid JSON with no extra text.`,
    schema: {
      type: "object",
      properties: {
        max_fluence: { type: "number" },
        energy_levels: { type: "string" },
        facility_name: { type: "string" },
        environmental_conditions: { type: "string" },
        terrestrial: { type: "boolean" },
        in_flight: { type: "boolean" },
        source: {
          type: "string",
          enum: [
            "Co60",
            "Protons",
            "Electrons",
            "Heavy ions",
            "X-rays",
            "Pions",
          ],
        },
        max_tid: { type: "number" },
        dose_rate: { type: "number" },
        eldrs_observed: { type: "boolean" },
        dose_to_failure: { type: "number" },
        increased_power_usage: { type: "boolean" },
        power_usage_description: { type: "string" },
        current_leakage: { type: "number" },
        failing_time: { type: "string" },
        special_notes: { type: "string" },
      },
      required: [
        "max_fluence",
        "energy_levels",
        "facility_name",
        "environmental_conditions",
        "terrestrial",
        "in_flight",
        "source",
        "max_tid",
        "dose_rate",
        "eldrs_observed",
        "dose_to_failure",
        "increased_power_usage",
      ],
    },
  },
  seeData: {
    prompt: `Describe the conditions under which radiation testing was conducted. Extract Single Event Effects (SEE) data:
        - The name of the device provided, you are looking for data corresponding to this
        - Maximum fluence in exponential notation
        - Energy levels
        - Facility name
        - Environmental conditions
        - Was the test conducted in a terrestrial setting? (Yes/No)
        - Was the test conducted in-flight? (Yes/No)
        - Radiation source (Heavy ions, Protons, Laser, Neutron, Electron)
        - Type of SEE observed (SEU, SEDR, SET, SEFI, SEL, SEB, SEGR, MBU, SES, SEJ, SED, SEBID, SEHE, SEN, SEPH, SECD, SEICS, SEIPC, SEITR, SECL, SECS, SECC, SETV, SEM, SEF, SEPC, SEA. SETR, SEPF, SEQT, SESD)
        - Amplitude of effect
        - Duration of effect
        - Cross-section saturation value
        - Cross-section threshold value
        - Cross-section type
        - Any special notes

        Return the response as a **valid JSON object** with the following structure:

        {
        "device_name": <string>
        "max_fluence": number,
        "energy_levels": string,
        "facility_name": string,
        "environmental_conditions": string,
        "terrestrial": boolean,
        "in_flight": boolean,
        "source": "Heavy ions" | "Protons" | "Laser" | "Neutron" | "Electron" | "X-rays",
        "see_type": string,
        "amplitude": number,
        "duration": number,
        "cross_section_saturation": number,
        "cross_section_threshold": number,
        "cross_section_type": string,
        "special_notes": string | null
        }

        Return only valid JSON with no extra text.`,
    schema: {
      type: "object",
      properties: {
        max_fluence: { type: "number" },
        energy_levels: { type: "string" },
        facility_name: { type: "string" },
        environmental_conditions: { type: "string" },
        terrestrial: { type: "boolean" },
        in_flight: { type: "boolean" },
        source: {
          type: "string",
          enum: [
            "Heavy ions",
            "Protons",
            "Laser",
            "Neutron",
            "Electron",
            "X-rays",
          ],
        },
        see_type: { type: "string" },
        amplitude: { type: "number" },
        duration: { type: "number" },
        cross_section_saturation: { type: "number" },
        cross_section_threshold: { type: "number" },
        cross_section_type: { type: "string" },
        special_notes: { type: "string" },
      },
      required: [
        "max_fluence",
        "energy_levels",
        "facility_name",
        "environmental_conditions",
        "terrestrial",
        "in_flight",
        "source",
        "see_type",
        "amplitude",
        "duration",
        "cross_section_saturation",
        "cross_section_threshold",
        "cross_section_type",
      ],
    },
  },
  ddData: {
    prompt: `Describe the conditions under which radiation testing was conducted. Extract Displacement Damage (DD) data:
        - The name of the device provided, you are looking for data corresponding to this
        - Maximum fluence in exponential notation
        - Energy levels
        - Facility name
        - Environmental conditions
        - Was the test conducted in a terrestrial setting? (Yes/No)
        - Was the test conducted in-flight? (Yes/No)
        - Radiation source (Protons, Neutrons)
        - Level of damage observed
        - Description of damage effects
        - Any special notes

        Return the response as a **valid JSON object** with the following structure:

        {
            "device_name": <string>
            "max_fluence": <number>,
            "energy_levels": "<string>",
            "facility_name": "<string>",
            "environmental_conditions": "<string>",
            "terrestrial": <true | false>,
            "in_flight": <true | false>,
            "source": "Protons | Neutrons",
            "damage_level": <number>,
            "damage_description": "<string>",
            "special_notes": "<string>"
        }

        Return only valid JSON with no extra text.`,
    schema: {
      type: "object",
      properties: {
        max_fluence: { type: "number" },
        energy_levels: { type: "string" },
        facility_name: { type: "string" },
        environmental_conditions: { type: "string" },
        terrestrial: { type: "boolean" },
        in_flight: { type: "boolean" },
        source: { type: "string", enum: ["Protons", "Neutrons"] },
        damage_level: { type: "number" },
        damage_description: { type: "string" },
        special_notes: { type: "string" },
      },
      required: [
        "max_fluence",
        "energy_levels",
        "facility_name",
        "environmental_conditions",
        "terrestrial",
        "in_flight",
        "source",
        "damage_level",
        "damage_description",
      ],
    },
  },
};

export const prompts = {
  generalContext: `You are an expert in radiation effects on electronic components.
      Your task is to analyze and extract relevant data from research papers, focusing on Total Ionizing Dose (TID),
      Single Event Effects (SEE), and Displacement Damage (DD) data for various components.
      Answer the following questions step by step to extract structured and meaningful data.
      
      Ensure the output is formatted exactly as requested.`,

  questions: {
    paperMetadata: `Extract the following details about the research paper using "ø" as a delimiter:
        - Paper name
        - Year of publication
        - List of author names (separate names using "¶")
        - What is the main objective of the paper?
        
        Format:
        Paper Name ø Year ø Author1¶Author2¶Author3 ø Objective`,

    componentDetails: `Identify the electronic components tested in the paper. Use "ø" to separate fields:
        - Component name
        - Type of component (e.g., microprocessor, FPGA, memory chip, etc.)
        - Manufacturer
        - Any other relevant details
        
        Format (if multiple components, use new lines):
        Component Name ø Type ø Manufacturer ø Other Details`,

    testingConditions: `Describe the conditions under which radiation testing was conducted. Use "ø":
        - Type of testing performed (TID, SEE, DD)
        - Maximum fluence
        - Energy levels
        - Facility name
        - Environmental conditions
        - Was the test conducted in a terrestrial setting? (Yes/No)
        - Was the test conducted in-flight? (Yes/No)
        
        Format:
        Testing Type ø Max Fluence ø Energy ø Facility Name ø Environmental Conditions ø Terrestrial ø Flight`,

    tidData: `Describe the conditions under which radiation testing was conducted. Extract Total Ionizing Dose (TID) data. Use "ø" as a delimiter:
        - Maximum fluence
        - Energy levels
        - Facility name
        - Environmental conditions
        - Was the test conducted in a terrestrial setting? (Yes/No)
        - Was the test conducted in-flight? (Yes/No)
        - Source of radiation (Co60, Protons, Electrons, Heavy ions, X-rays Pions)
        - Maximum TID level
        - Dose rate
        - Was Enhanced Low Dose Rate Sensitivity (ELDRS) observed? (Yes/No)
        - Dose to failure
        - Was increased power usage observed? (Yes/No)
        - Description of power usage increase
        - If power current leakage is present, at what rate
        - How long was it failing for
        - Any special notes
  
        Format:
        Max Fluence ø Energy ø Facility Name ø Environmental Conditions ø Terrestrial ø Flight ø Source ø Max TID ø Dose Rate ø ELDRS ø Dose to Failure ø Increased Power Usage ø Power Usage Description ø current leakage ø failing time ø Special Notes`,

    seeData: `Describe the conditions under which radiation testing was conducted. Extract Single Event Effects (SEE) data using "ø":
        - Maximum fluence
        - Energy levels
        - Facility name
        - Environmental conditions
        - Was the test conducted in a terrestrial setting? (Yes/No)
        - Was the test conducted in-flight? (Yes/No)
        - Radiation source (Heavy ions, Protons, Laser, Neutron, Electron)
        - Type of SEE observed (SEU, SEDR, SET, SEFI, SEL, SEB, SEGR, MBU, SES, SEJ, SED, SEBID, SEHE, SEN, SEPH, SECD, SEICS, SEIPC, SEITR, SECL, SECS, SECC, SETV, SEM, SEF, SEPC, SEA. SETR, SEPF, SEQT, SESD)
        - Amplitude of effect
        - Duration of effect
        - Cross-section saturation value
        - Cross-section threshold value
        - Cross-section type
        - Any special notes

        Return the response as a **valid JSON object** with the following structure:

        {
        "max_fluence": number,
        "energy_levels": string,
        "facility_name": string,
        "environmental_conditions": string,
        "terrestrial": boolean,
        "in_flight": boolean,
        "source": "Heavy ions" | "Protons" | "Laser" | "Neutron" | "Electron" | "X-rays",
        "see_type": string,
        "amplitude": number,
        "duration": number,
        "cross_section_saturation": number,
        "cross_section_threshold": number,
        "cross_section_type": string,
        "special_notes": string | null
        }

        Return only valid JSON with no extra text.`,

    //Format:
    //Max Fluence ø Energy ø Facility Name ø Environmental Conditions ø Terrestrial ø Flight ø Source ø Type ø Amplitude ø Duration ø Cross-section ø Cross-section Type ø Special Notes,

    ddData: `Describe the conditions under which radiation testing was conducted. Extract Displacement Damage (DD) data using "ø":
        - Maximum fluence
        - Energy levels
        - Facility name
        - Environmental conditions
        - Was the test conducted in a terrestrial setting? (Yes/No)
        - Was the test conducted in-flight? (Yes/No)
        - Radiation source (Protons, Neutrons)
        - Level of damage observed
        - Description of damage effects
        - Any special notes
        
        Format:
        Max Fluence ø Energy ø Facility Name ø Environmental Conditions ø Terrestrial ø Flight ø Source ø Damage Level ø Description ø Special Notes`,

    summary: `Provide a structured summary of all extracted data ensuring completeness and clarity.
        Return the response in a structured format with each field separated by "ø".`,
  },
};
