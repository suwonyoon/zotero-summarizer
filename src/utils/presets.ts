export interface Preset {
  id: string;
  name: string;
  prompt: string;
}

export interface PresetCollection {
  language: Preset[];
  content: Preset[];
}

export interface PresetSelections {
  language: string; // Single language preset ID
  content: string[]; // Multiple content preset IDs
  useMarkdownConversion?: boolean; // Whether to request markdown and convert to rich text HTML
}

export const DEFAULT_PRESETS: PresetCollection = {
  language: [
    {
      id: "lang-en",
      name: "English",
      prompt: "Please respond in English.",
    },
    {
      id: "lang-ko",
      name: "Korean",
      prompt: "한국어로 응답해주세요.",
    },
    {
      id: "lang-hybrid",
      name: "Korean+English Hybrid",
      prompt:
        "한국어 문법을 사용하되, 전문 용어는 영어로 유지해주세요. (Use Korean grammar but keep technical terms in English.)",
    },
  ],
  content: [
    {
      id: "content-academic",
      name: "Academic Summary",
      prompt:
        "Provide an academic summary including: research question, methodology, key findings, and implications.",
    },
    {
      id: "content-keypoints",
      name: "Key Points",
      prompt: "Summarize the main ideas in bullet points.",
    },
    {
      id: "content-methodology",
      name: "Methodology Focus",
      prompt:
        "Focus on the methodology and experimental design used in this research.",
    },
    {
      id: "content-results",
      name: "Results & Conclusions",
      prompt: "Focus on the findings and conclusions of the research.",
    },
    {
      id: "content-critical",
      name: "Critical Analysis",
      prompt:
        "Provide a critical analysis evaluating the strengths, weaknesses, and limitations of this research.",
    },
    {
      id: "content-eli5",
      name: "ELI5 (Explain Like I'm 5)",
      prompt: "Explain this research in simple terms that a beginner can understand.",
    },
  ],
};

export const DEFAULT_SELECTIONS: PresetSelections = {
  language: "lang-en",
  content: ["content-academic"],
  useMarkdownConversion: false,
};

/**
 * Combine selected presets into a single prompt
 */
export function combinePresets(
  presets: PresetCollection,
  selections: PresetSelections,
): string {
  const parts: string[] = [];

  // Add language preset
  const languagePreset = presets.language.find(
    (p) => p.id === selections.language,
  );
  if (languagePreset) {
    parts.push(languagePreset.prompt);
  }

  // Add content presets
  if (selections.content.length > 0) {
    const contentPresets = selections.content
      .map((id) => presets.content.find((p) => p.id === id))
      .filter((p): p is Preset => p !== undefined);

    if (contentPresets.length > 0) {
      parts.push(contentPresets[0].prompt);

      // Add additional content presets with "Additionally" prefix
      for (let i = 1; i < contentPresets.length; i++) {
        parts.push(`Additionally, ${contentPresets[i].prompt}`);
      }
    }
  }

  // Add markdown formatting instruction if enabled
  if (selections.useMarkdownConversion) {
    parts.push("Format your response using Markdown syntax with proper headings (# ## ###), bold (**text**), italic (*text*), lists (- item), and code blocks (```code```).");
  }

  return parts.join(" ");
}

/**
 * Load presets from preferences
 */
export function loadPresets(getPref: (key: string) => any): PresetCollection {
  const presetsJSON = getPref("presets");
  if (presetsJSON) {
    try {
      return JSON.parse(presetsJSON) as PresetCollection;
    } catch (e) {
      ztoolkit.log("Failed to parse presets, using defaults", e);
    }
  }
  return DEFAULT_PRESETS;
}

/**
 * Save presets to preferences
 */
export function savePresets(
  presets: PresetCollection,
  setPref: (key: string, value: any) => void,
): void {
  setPref("presets", JSON.stringify(presets));
}

/**
 * Load preset selections from preferences
 */
export function loadSelections(
  getPref: (key: string) => any,
): PresetSelections {
  const selectionsJSON = getPref("selectedPresets");
  if (selectionsJSON) {
    try {
      return JSON.parse(selectionsJSON) as PresetSelections;
    } catch (e) {
      ztoolkit.log("Failed to parse selections, using defaults", e);
    }
  }
  return DEFAULT_SELECTIONS;
}

/**
 * Save preset selections to preferences
 */
export function saveSelections(
  selections: PresetSelections,
  setPref: (key: string, value: any) => void,
): void {
  setPref("selectedPresets", JSON.stringify(selections));
}
