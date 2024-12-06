export const questions = [
  "What is the title of the paper",
  "Which year was the paper published",
  "What are all of the author's names, in the format (J. Doe) in a comma separated list",
  "What is the part number (or name if that is not available) of the part or parts studied by the paper",
  "What is the type of part or parts (eg, switching regulator) mentioned in the paper",
  "Who is the manufacturer",
  "What is the type of testing location: Respond to this question with \"Terrestrial\" for a terrestial testing location, or \"Flight\" for a flight testing location",
  "What type of testing was done: Respond to this question with \"TID\" for Total Ionizing Dose testing, \"SEE\" for heavy ion, proton, laser, or neutron testing, or \"OTHER\" if you are not completely 100% sure"
];

export const prompt = `Please answer the following questions, as concisely as possible, and with a heavy emphasis on numbers instead of words.\n
    Use standard text and do not provide citations for each of your answers. 
    Answer each question, and separate the answers with a "ø" character as a delimiter.
    If you are unable to answer the question accurately, provide the answer N/A.\n`;

export const Other_targeted_questions = [
  "What type was the radiation source",
  "Were there any failures, if so, when?",
];

export const TID_targeted_questions = [
  "What type was the radiation source",
  "What was the total dose",
  "Were there any failures, if so, when?",
];

export const SEE_targeted_questions = [
  "What type was the radiation source",
  "What the energy of the source",
  "Were there any failures, if so, when?",
];

export const targeted_prompt = `Please answer the following questions, as concisely as possible, and with a heavy emphasis on numbers instead of words.
    Use standard text and do not provide citations for each of your answers. 
    Answer each question, and separate the answers with a "ø" character as a delimiter.
    If you are unable to answer the question accurately, provide the answer N/A.\n`;

export const sort_questions = `There are five types of papers: 
    The first are \"Laboratory Capabilities/Facility Equipment/Simulator\", which detail the capacities of a location, or university for use in research.
    The second are \"Testing Methods\", which detail specific methods of testing, without any devices being tested in the paper.
    The third are \"Phenomenons/Theory Papers_Sorted\", which detail theories or phenomenons that occur on a wide variety of devices, without doing specific testing on a device.
    The fourth are \"Compendiums\", which are collections of concise but detailed data on a large variety of devices. The devices must have their part numbers listed to be in this category.
    The fifth are \"Single/Multiple Device Testing\", which are papers that test one or more devices with one or more types of radiation. The device must have a part number to be in this category.
    In the same order, respond with \"LAB\", \"TST\", \"PHE\", \"CMP\", or \"SMD\", for the category that the paper best fits.`;

export const sort_prompts = `Please answer the following question, as concisely as possible, with a single word answer as outlined in the question.
    Classify this paper into one of the following categories: """ + questions + """
    Use standard text and do not provide citations for each of your answer.
    Answer the question with the keyword for one of the 5 papers.
    If you are unable to answer the question accurately, provide the answer N/A.`;
