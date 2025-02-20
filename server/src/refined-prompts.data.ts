export const prompts = {
  generalContext: `You are an expert in radiation effects on electronic components.
      Your task is to analyze and extract relevant data from research papers, focusing on Total Ionizing Dose (TID),
      Single Event Effects (SEE), and Displacement Damage (DD) data for various components.
      Answer the following questions step by step to extract structured and meaningful data.
      
      Use "ø" as a delimiter between values. Ensure the output is formatted exactly as requested.`,

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

    tidData: `Extract Total Ionizing Dose (TID) data. Use "ø" as a delimiter:
        - Source of radiation (Co60, Protons, Electrons, Heavy ions, X-rays)
        - Maximum TID level
        - Dose rate
        - Was Enhanced Low Dose Rate Sensitivity (ELDRS) observed? (Yes/No)
        - Was P-pion used? (Yes/No)
        - Dose to failure
        - Was increased power usage observed? (Yes/No)
        - Description of power usage increase
        - Any special notes
  
        Format:
        Source ø Max TID ø Dose Rate ø ELDRS ø P-pion ø Dose to Failure ø Increased Power Usage ø Power Usage Description ø Special Notes`,

    seeData: `Extract Single Event Effects (SEE) data using "ø":
        - Radiation source (Heavy ions, Protons, Laser, Neutron, Electron)
        - Type of SEE observed (SEU, SET, SEFI, SEL, SEB, SEGR)
        - Amplitude
        - Duration
        - Cross-section value
        - Cross-section type
        - Any special notes
        
        Format:
        Source ø Type ø Amplitude ø Duration ø Cross-section ø Cross-section Type ø Special Notes`,

    ddData: `Extract Displacement Damage (DD) data using "ø":
        - Radiation source (Protons, Neutrons)
        - Level of damage observed
        - Description of damage effects
        - Any special notes
        
        Format:
        Source ø Damage Level ø Description ø Special Notes`,

    summary: `Provide a structured summary of all extracted data ensuring completeness and clarity.
        Return the response in a structured format with each field separated by "ø".`,
  },
};
