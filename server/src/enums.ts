export enum GPTModel {

    GPT4O = "gpt-4o",

    // GPT-4 Models
    GPT4 = "gpt-4",                  // Standard GPT-4 model for text and code completion
    GPT4Turbo = "gpt-4-turbo",        // Cost-effective and faster variant of GPT-4
    GPT4_32K = "gpt-4-32k",           // GPT-4 model with a 32,768 token limit
    GPT4Turbo_32K = "gpt-4-turbo-32k", // Turbo variant with a 32,768 token limit for larger contexts
  
    // GPT-3.5 Models
    GPT3_5Turbo = "gpt-3.5-turbo",     // Cost-effective and optimized model for speed
    GPT3_5Turbo_16K = "gpt-3.5-turbo-16k", // GPT-3.5 Turbo with extended token limit for larger inputs
  
    // Legacy GPT-3 Models
    TextDavinci_003 = "text-davinci-003", // High-quality text generation, capable of complex tasks
    TextDavinci_002 = "text-davinci-002", // Earlier version of the Davinci model
    TextCurie_001 = "text-curie-001",     // Balanced model for moderate complexity tasks
    TextBabbage_001 = "text-babbage-001", // Faster, suited for simpler tasks
    TextAda_001 = "text-ada-001"          // Fastest and most affordable, used for basic tasks
  }
  