import { getPref, setPref } from "../utils/prefs";
import {
  PresetCollection,
  PresetSelections,
  loadPresets,
  savePresets,
  loadSelections,
  saveSelections,
  combinePresets,
  DEFAULT_PRESETS,
  DEFAULT_SELECTIONS,
} from "../utils/presets";
import { generateSummary, OpenAIConfig } from "../utils/openai";
import { getString } from "../utils/locale";
import { markdownToHtml } from "../utils/markdown";

export class ZoteroGPTFactory {
  /**
   * Register preferences with default values
   */
  static registerPrefs() {
    if (getPref("apiKey") === undefined) {
      setPref("apiKey", "");
    }
    if (getPref("model") === undefined) {
      setPref("model", "gpt-5-mini");
    }
    if (getPref("systemPrompt") === undefined) {
      setPref("systemPrompt", "You are a research paper summarizer. Provide only the summary without any meta-commentary or explanations of what you did.");
    }
    if (getPref("presets") === undefined) {
      setPref("presets", JSON.stringify(DEFAULT_PRESETS));
    }
    if (getPref("selectedPresets") === undefined) {
      setPref("selectedPresets", JSON.stringify(DEFAULT_SELECTIONS));
    }
  }

  /**
   * Register menu items
   */
  static registerMenu() {
    // Register Tools menu
    ztoolkit.Menu.register("menuTools", {
      tag: "menu",
      id: "zotero-gpt-menu",
      label: "ZoteroGPT",
      children: [
        {
          tag: "menuitem",
          id: "zotero-gpt-select-presets",
          label: "Select Active Presets...",
          commandListener: () => ZoteroGPTFactory.openPresetSelector(),
        },
        {
          tag: "menuseparator",
        },
        {
          tag: "menuitem",
          id: "zotero-gpt-generate",
          label: "Generate Summary",
          commandListener: () => ZoteroGPTFactory.generateSummaries(),
        },
        {
          tag: "menuseparator",
        },
        {
          tag: "menuitem",
          id: "zotero-gpt-settings",
          label: "Settings",
          commandListener: () => ZoteroGPTFactory.openSettings(),
        },
        {
          tag: "menuitem",
          id: "zotero-gpt-manage-presets",
          label: "Manage Prompt Presets...",
          commandListener: () => ZoteroGPTFactory.openPresetManager(),
        },
      ],
    });
  }

  /**
   * Register context menu item
   */
  static registerContextMenu() {
    ztoolkit.Menu.register("item", {
      tag: "menuitem",
      id: "zotero-gpt-context-generate",
      label: "Generate AI Summary",
      commandListener: () => ZoteroGPTFactory.generateSummaries(),
    });
  }

  /**
   * Open settings dialog
   */
  static async openSettings() {
    const apiKey = getPref("apiKey") as string;
    const model = getPref("model") as string;
    const systemPrompt = getPref("systemPrompt") as string;

    const dialogData: { [key: string]: any } = {
      apiKey: apiKey || "",
      model: model || "gpt-5-mini",
      systemPrompt: systemPrompt || "You are a research paper summarizer. Provide only the summary without any meta-commentary or explanations of what you did.",
      unloadLock: Zotero.Promise.defer(),
      loadCallback: () => {
        ztoolkit.log("[ZoteroGPT] Settings dialog opened");
      },
      unloadCallback: () => {
        ztoolkit.log("[ZoteroGPT] Settings dialog closed");
        dialogData.unloadLock.resolve();
      },
    };

    const dialogHelper = new ztoolkit.Dialog(3, 2)
      .setDialogData(dialogData)
      .addCell(0, 0, {
        tag: "label",
        properties: { innerHTML: "OpenAI API Key:" },
      })
      .addCell(0, 1, {
        tag: "input",
        namespace: "html",
        id: "apiKey",
        attributes: {
          "data-bind": "apiKey",
          "data-prop": "value",
          type: "password",
        },
      })
      .addCell(1, 0, {
        tag: "label",
        properties: { innerHTML: "Model:" },
      })
      .addCell(1, 1, {
        tag: "input",
        namespace: "html",
        id: "model",
        attributes: {
          "data-bind": "model",
          "data-prop": "value",
        },
      })
      .addCell(2, 0, {
        tag: "label",
        properties: { innerHTML: "System Prompt:" },
        styles: { alignSelf: "start", paddingTop: "5px" },
      })
      .addCell(2, 1, {
        tag: "textarea",
        namespace: "html",
        id: "systemPrompt",
        attributes: {
          "data-bind": "systemPrompt",
          "data-prop": "value",
          rows: "4",
        },
        styles: { width: "400px" },
      })
      .addButton("Save", "accept")
      .addButton("Cancel", "cancel")
      .open("ZoteroGPT Settings");

    addon.data.dialog = dialogHelper;
    await dialogData.unloadLock.promise;
    addon.data.dialog = undefined;

    // Save if accepted
    if (dialogData._lastButtonId === "accept") {
      setPref("apiKey", dialogData.apiKey);
      setPref("model", dialogData.model);
      setPref("systemPrompt", dialogData.systemPrompt);
      ztoolkit.log("[ZoteroGPT] Settings saved");
    }
  }

  /**
   * Open preset selector dialog
   */
  static async openPresetSelector() {
    const presets = loadPresets(getPref as any);
    const selections = loadSelections(getPref as any);

    const dialogData: { [key: string]: any } = {
      language: selections.language,
      content: [...selections.content],
      useMarkdownConversion: selections.useMarkdownConversion || false,
      unloadLock: Zotero.Promise.defer(),
      loadCallback: () => {
        ztoolkit.log("[ZoteroGPT] Preset selector dialog opened");
      },
      unloadCallback: () => {
        ztoolkit.log("[ZoteroGPT] Preset selector dialog closed");
        dialogData.unloadLock.resolve();
      },
    };

    const updatePreview = (dialog: any) => {
      if (!dialog.window) return;

      const previewArea = dialog.window.document.getElementById(
        "prompt-preview",
      ) as HTMLTextAreaElement;
      if (!previewArea) return;

      const currentSelections = {
        language: dialogData.language,
        content: dialogData.content,
        useMarkdownConversion: dialogData.useMarkdownConversion,
      };
      const combinedPrompt = combinePresets(presets, currentSelections);
      previewArea.value = combinedPrompt;
      ztoolkit.log("[ZoteroGPT] Preview updated:", combinedPrompt);
    };

    let row = 0;
    const dialogHelper = new ztoolkit.Dialog(
      presets.language.length + presets.content.length + 5, // +5 for headers, markdown checkbox, and preview
      1, // Single column
    ).setDialogData(dialogData);

    // Language presets header
    dialogHelper.addCell(row++, 0, {
      tag: "label",
      namespace: "html",
      properties: { innerHTML: "<strong>Language:</strong>" },
      styles: {
        marginBottom: "8px",
        fontSize: "14px",
      },
    });

    // Language presets (radio buttons)
    for (const preset of presets.language) {
      dialogHelper.addCell(row++, 0, {
        tag: "div",
        namespace: "html",
        styles: {
          marginBottom: "8px",
          padding: "4px 8px",
          borderRadius: "3px",
        },
        children: [
          {
            tag: "input",
            namespace: "html",
            id: `lang-${preset.id}`,
            attributes: {
              type: "radio",
              name: "language-preset",
              value: preset.id,
              ...(preset.id === selections.language ? { checked: "checked" } : {}),
            },
            listeners: [
              {
                type: "change",
                listener: () => {
                  dialogData.language = preset.id;
                  ztoolkit.log("[ZoteroGPT] Language selected:", preset.id);
                  updatePreview(dialogHelper);
                },
              },
            ],
          },
          {
            tag: "label",
            namespace: "html",
            attributes: { for: `lang-${preset.id}` },
            properties: { innerHTML: ` ${preset.name}` },
            styles: {
              marginLeft: "8px",
              cursor: "pointer",
              fontSize: "13px",
            },
          },
        ],
      });
    }

    // Content presets header
    dialogHelper.addCell(row++, 0, {
      tag: "label",
      namespace: "html",
      properties: { innerHTML: "<strong>Content Style:</strong>" },
      styles: {
        marginTop: "20px",
        marginBottom: "8px",
        fontSize: "14px",
        display: "block",
        paddingTop: "12px",
        borderTop: "1px solid #e0e0e0",
      },
    });

    // Content presets (checkboxes)
    for (const preset of presets.content) {
      dialogHelper.addCell(row++, 0, {
        tag: "div",
        namespace: "html",
        styles: {
          marginBottom: "8px",
          padding: "4px 8px",
          borderRadius: "3px",
        },
        children: [
          {
            tag: "input",
            namespace: "html",
            id: `content-${preset.id}`,
            attributes: {
              type: "checkbox",
              ...(selections.content.includes(preset.id) ? { checked: "checked" } : {}),
            },
            listeners: [
              {
                type: "change",
                listener: (e: Event) => {
                  const checkbox = e.target as HTMLInputElement;
                  if (checkbox.checked) {
                    if (!dialogData.content.includes(preset.id)) {
                      dialogData.content.push(preset.id);
                    }
                  } else {
                    dialogData.content = dialogData.content.filter(
                      (id: string) => id !== preset.id,
                    );
                  }
                  ztoolkit.log("[ZoteroGPT] Content presets:", dialogData.content);
                  updatePreview(dialogHelper);
                },
              },
            ],
          },
          {
            tag: "label",
            namespace: "html",
            attributes: { for: `content-${preset.id}` },
            properties: { innerHTML: ` ${preset.name}` },
            styles: {
              marginLeft: "8px",
              cursor: "pointer",
              fontSize: "13px",
            },
          },
        ],
      });
    }

    // Markdown formatting checkbox
    dialogHelper.addCell(row++, 0, {
      tag: "div",
      namespace: "html",
      styles: {
        marginTop: "20px",
        paddingTop: "12px",
        borderTop: "1px solid #e0e0e0",
      },
      children: [
        {
          tag: "input",
          namespace: "html",
          id: "use-markdown",
          attributes: {
            type: "checkbox",
            ...(selections.useMarkdownConversion ? { checked: "checked" } : {}),
          },
          listeners: [
            {
              type: "change",
              listener: (e: Event) => {
                const checkbox = e.target as HTMLInputElement;
                dialogData.useMarkdownConversion = checkbox.checked;
                ztoolkit.log("[ZoteroGPT] Use markdown conversion:", dialogData.useMarkdownConversion);
                updatePreview(dialogHelper);
              },
            },
          ],
        },
        {
          tag: "label",
          namespace: "html",
          attributes: { for: "use-markdown" },
          properties: { innerHTML: " Convert markdown to rich text" },
          styles: {
            marginLeft: "8px",
            cursor: "pointer",
            fontSize: "13px",
            fontWeight: "bold",
          },
        },
      ],
    });

    // Preview section header
    dialogHelper.addCell(row++, 0, {
      tag: "label",
      namespace: "html",
      properties: { innerHTML: "<strong>Combined Prompt Preview</strong>" },
      styles: {
        marginTop: "20px",
        marginBottom: "8px",
        fontSize: "14px",
        display: "block",
        paddingTop: "12px",
        borderTop: "1px solid #e0e0e0",
      },
    });

    // Preview textarea
    dialogHelper.addCell(row++, 0, {
      tag: "textarea",
      namespace: "html",
      id: "prompt-preview",
      attributes: {
        readonly: "true",
        rows: "12",
      },
      styles: {
        width: "100%",
        fontFamily: "monospace",
        fontSize: "11px",
        padding: "12px",
        backgroundColor: "#f9f9f9",
        border: "1px solid #d0d0d0",
        borderRadius: "4px",
        resize: "vertical",
        lineHeight: "1.5",
        color: "#333",
        minHeight: "200px",
      },
    });

    dialogHelper.addButton("OK", "accept").addButton("Cancel", "cancel");

    dialogHelper.open("Select Active Presets", {
      width: 700,
      height: 600,
      resizable: true,
    });

    addon.data.dialog = dialogHelper;

    // Initialize preview after a short delay
    setTimeout(() => {
      updatePreview(dialogHelper);
    }, 100);

    await dialogData.unloadLock.promise;
    addon.data.dialog = undefined;

    // Save if accepted
    if (dialogData._lastButtonId === "accept") {
      const newSelections: PresetSelections = {
        language: dialogData.language,
        content: dialogData.content,
        useMarkdownConversion: dialogData.useMarkdownConversion,
      };
      saveSelections(newSelections, setPref as any);
      ztoolkit.log("[ZoteroGPT] Presets selected:", newSelections);
    }
  }

  /**
   * Open preset manager dialog
   */
  static async openPresetManager() {
    const presets = loadPresets(getPref as any);

    const dialogData: { [key: string]: any } = {
      presets: JSON.parse(JSON.stringify(presets)), // Deep copy
      selectedTab: "language", // "language" or "content"
      selectedPresetId: null,
      presetName: "",
      presetPrompt: "",
      unloadLock: Zotero.Promise.defer(),
      loadCallback: () => {
        ztoolkit.log("[ZoteroGPT] Preset manager opened");
      },
      unloadCallback: () => {
        ztoolkit.log("[ZoteroGPT] Preset manager closed");
        dialogData.unloadLock.resolve();
      },
    };

    const updatePresetList = (dialog: any) => {
      ztoolkit.log("[ZoteroGPT] Updating preset list, tab:", dialogData.selectedTab);

      if (!dialog.window) {
        ztoolkit.log("[ZoteroGPT] Dialog window not ready yet");
        return;
      }

      const selectBox = dialog.window.document.getElementById(
        "preset-select",
      ) as HTMLSelectElement;

      if (!selectBox) {
        ztoolkit.log("[ZoteroGPT] Select box not found!");
        return;
      }

      ztoolkit.log("[ZoteroGPT] Found select box, clearing items");

      // Clear current items
      selectBox.innerHTML = "";

      // Add presets based on selected tab
      const presetList =
        dialogData.selectedTab === "language"
          ? dialogData.presets.language
          : dialogData.presets.content;

      ztoolkit.log("[ZoteroGPT] Adding", presetList.length, "presets to list");

      for (const preset of presetList) {
        const option = dialog.window.document.createElement("option");
        option.value = preset.id;
        option.textContent = preset.name;
        selectBox.appendChild(option);
        ztoolkit.log("[ZoteroGPT] Added preset:", preset.name);
      }

      ztoolkit.log("[ZoteroGPT] Preset list updated, total options:", selectBox.options.length);
    };

    const getSelectedPreset = () => {
      if (!dialogData.selectedPresetId) return null;
      const presetList =
        dialogData.selectedTab === "language"
          ? dialogData.presets.language
          : dialogData.presets.content;
      return presetList.find((p: any) => p.id === dialogData.selectedPresetId);
    };

    const dialogHelper = new ztoolkit.Dialog(20, 2)
      .setDialogData(dialogData)
      .addCell(0, 0, {
        tag: "h2",
        properties: { innerHTML: "Manage Presets" },
      })
      // Tab buttons
      .addCell(1, 0, {
        tag: "div",
        namespace: "html",
        styles: {
          display: "flex",
          gap: "5px",
          marginBottom: "10px",
          flexWrap: "wrap",
        },
        children: [
          {
            tag: "button",
            namespace: "html",
            id: "tab-language",
            properties: { innerHTML: "Language Presets" },
            styles: {
              padding: "5px 10px",
              whiteSpace: "nowrap",
              flex: "1 1 auto",
              minWidth: "120px",
            },
            listeners: [
              {
                type: "click",
                listener: (e: Event) => {
                  e.preventDefault();
                  e.stopPropagation();
                  dialogData.selectedTab = "language";
                  dialogData.selectedPresetId = null;
                  dialogData.presetName = "";
                  dialogData.presetPrompt = "";
                  const nameInput = dialogHelper.window?.document.getElementById(
                    "preset-name",
                  ) as HTMLInputElement;
                  const promptInput =
                    dialogHelper.window?.document.getElementById(
                      "preset-prompt",
                    ) as HTMLTextAreaElement;
                  if (nameInput) nameInput.value = "";
                  if (promptInput) promptInput.value = "";
                  updatePresetList(dialogHelper);
                },
              },
            ],
          },
          {
            tag: "button",
            namespace: "html",
            id: "tab-content",
            properties: { innerHTML: "Content Presets" },
            styles: {
              padding: "5px 10px",
              whiteSpace: "nowrap",
              flex: "1 1 auto",
              minWidth: "120px",
            },
            listeners: [
              {
                type: "click",
                listener: (e: Event) => {
                  e.preventDefault();
                  e.stopPropagation();
                  dialogData.selectedTab = "content";
                  dialogData.selectedPresetId = null;
                  dialogData.presetName = "";
                  dialogData.presetPrompt = "";
                  const nameInput = dialogHelper.window?.document.getElementById(
                    "preset-name",
                  ) as HTMLInputElement;
                  const promptInput =
                    dialogHelper.window?.document.getElementById(
                      "preset-prompt",
                    ) as HTMLTextAreaElement;
                  if (nameInput) nameInput.value = "";
                  if (promptInput) promptInput.value = "";
                  updatePresetList(dialogHelper);
                },
              },
            ],
          },
        ],
      })
      // Preset list
      .addCell(2, 0, {
        tag: "label",
        properties: { innerHTML: "Presets:" },
        styles: { fontWeight: "bold" },
      })
      .addCell(3, 0, {
        tag: "select",
        namespace: "html",
        id: "preset-select",
        attributes: { size: "8" },
        styles: { width: "300px", marginBottom: "10px" },
        // Event listeners will be attached manually after dialog opens
      })
      // Preset details
      .addCell(4, 0, {
        tag: "label",
        properties: { innerHTML: "Preset Name:" },
        styles: { marginTop: "10px" },
      })
      .addCell(5, 0, {
        tag: "input",
        namespace: "html",
        id: "preset-name",
        attributes: {
          type: "text",
          placeholder: "Enter preset name",
        },
        styles: { width: "290px" },
        listeners: [
          {
            type: "input",
            listener: (e: Event) => {
              dialogData.presetName = (e.target as HTMLInputElement).value;
            },
          },
        ],
      })
      .addCell(6, 0, {
        tag: "label",
        properties: { innerHTML: "Preset Prompt:" },
        styles: { marginTop: "5px" },
      })
      .addCell(7, 0, {
        tag: "textarea",
        namespace: "html",
        id: "preset-prompt",
        attributes: {
          rows: "4",
          placeholder: "Enter preset prompt",
        },
        styles: { width: "290px", height: "80px" },
        listeners: [
          {
            type: "input",
            listener: (e: Event) => {
              dialogData.presetPrompt = (e.target as HTMLTextAreaElement).value;
            },
          },
        ],
      })
      // Action buttons
      .addCell(8, 0, {
        tag: "div",
        namespace: "html",
        styles: {
          display: "flex",
          gap: "5px",
          marginTop: "10px",
          flexWrap: "wrap",
        },
        children: [
          {
            tag: "button",
            namespace: "html",
            properties: { innerHTML: "Add New" },
            attributes: { type: "button" },
            styles: {
              padding: "5px 10px",
              whiteSpace: "nowrap",
              flex: "1 1 auto",
              minWidth: "100px",
            },
            listeners: [
              {
                type: "click",
                listener: (e: Event) => {
                  e.preventDefault();
                  e.stopPropagation();

                  ztoolkit.log(
                    "[ZoteroGPT] Add New clicked - Name:",
                    dialogData.presetName,
                    "Prompt:",
                    dialogData.presetPrompt,
                  );

                  if (!dialogData.presetName || !dialogData.presetPrompt) {
                    dialogHelper.window?.alert(
                      "Please enter both name and prompt",
                    );
                    return;
                  }

                  const newId = `${dialogData.selectedTab}-${Date.now()}`;
                  const newPreset = {
                    id: newId,
                    name: dialogData.presetName,
                    prompt: dialogData.presetPrompt,
                  };

                  ztoolkit.log("[ZoteroGPT] Creating preset:", newPreset);

                  if (dialogData.selectedTab === "language") {
                    dialogData.presets.language.push(newPreset);
                  } else {
                    dialogData.presets.content.push(newPreset);
                  }

                  updatePresetList(dialogHelper);
                  dialogData.presetName = "";
                  dialogData.presetPrompt = "";
                  const nameInput = dialogHelper.window?.document.getElementById(
                    "preset-name",
                  ) as HTMLInputElement;
                  const promptInput =
                    dialogHelper.window?.document.getElementById(
                      "preset-prompt",
                    ) as HTMLTextAreaElement;
                  if (nameInput) nameInput.value = "";
                  if (promptInput) promptInput.value = "";

                  ztoolkit.log(
                    "[ZoteroGPT] Preset added. Total presets:",
                    dialogData.presets,
                  );
                },
              },
            ],
          },
          {
            tag: "button",
            namespace: "html",
            properties: { innerHTML: "Update Selected" },
            attributes: { type: "button" },
            styles: {
              padding: "5px 10px",
              whiteSpace: "nowrap",
              flex: "1 1 auto",
              minWidth: "100px",
            },
            listeners: [
              {
                type: "click",
                listener: (e: Event) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (!dialogData.selectedPresetId) {
                    dialogHelper.window?.alert("Please select a preset first");
                    return;
                  }
                  if (!dialogData.presetName || !dialogData.presetPrompt) {
                    dialogHelper.window?.alert(
                      "Please enter both name and prompt",
                    );
                    return;
                  }

                  const presetList =
                    dialogData.selectedTab === "language"
                      ? dialogData.presets.language
                      : dialogData.presets.content;
                  const preset = presetList.find(
                    (p: any) => p.id === dialogData.selectedPresetId,
                  );
                  if (preset) {
                    preset.name = dialogData.presetName;
                    preset.prompt = dialogData.presetPrompt;
                    updatePresetList(dialogHelper);
                  }
                },
              },
            ],
          },
          {
            tag: "button",
            namespace: "html",
            properties: { innerHTML: "Delete Selected" },
            attributes: { type: "button" },
            styles: {
              padding: "5px 10px",
              whiteSpace: "nowrap",
              flex: "1 1 auto",
              minWidth: "100px",
            },
            listeners: [
              {
                type: "click",
                listener: (e: Event) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (!dialogData.selectedPresetId) {
                    dialogHelper.window?.alert("Please select a preset first");
                    return;
                  }

                  const confirmed = dialogHelper.window?.confirm(
                    "Are you sure you want to delete this preset?",
                  );
                  if (!confirmed) return;

                  if (dialogData.selectedTab === "language") {
                    dialogData.presets.language =
                      dialogData.presets.language.filter(
                        (p: any) => p.id !== dialogData.selectedPresetId,
                      );
                  } else {
                    dialogData.presets.content =
                      dialogData.presets.content.filter(
                        (p: any) => p.id !== dialogData.selectedPresetId,
                      );
                  }

                  dialogData.selectedPresetId = null;
                  dialogData.presetName = "";
                  dialogData.presetPrompt = "";
                  updatePresetList(dialogHelper);
                  const nameInput = dialogHelper.window?.document.getElementById(
                    "preset-name",
                  ) as HTMLInputElement;
                  const promptInput =
                    dialogHelper.window?.document.getElementById(
                      "preset-prompt",
                    ) as HTMLTextAreaElement;
                  if (nameInput) nameInput.value = "";
                  if (promptInput) promptInput.value = "";
                },
              },
            ],
          },
        ],
      })
      .addButton("Save All", "accept")
      .addButton("Cancel", "cancel")
      .open("Preset Manager");

    addon.data.dialog = dialogHelper;

    // Initialize the preset list and attach event listeners after dialog is ready
    setTimeout(() => {
      ztoolkit.log("[ZoteroGPT] Initializing preset list");
      updatePresetList(dialogHelper);

      // Manually attach event listeners to the select box
      const selectBox = dialogHelper.window?.document.getElementById(
        "preset-select",
      ) as HTMLSelectElement;

      if (selectBox) {
        ztoolkit.log("[ZoteroGPT] Attaching event listeners to select box");

        selectBox.addEventListener("click", (e: Event) => {
          const target = e.target as HTMLElement;
          let selectedId: string | null = null;

          if (target.tagName === "OPTION") {
            selectedId = (target as HTMLOptionElement).value;
          } else if (target.tagName === "SELECT") {
            selectedId = (target as HTMLSelectElement).value;
          }

          ztoolkit.log(
            "[ZoteroGPT] Manual click handler - target:",
            target.tagName,
            "value:",
            selectedId,
          );

          if (selectedId) {
            dialogData.selectedPresetId = selectedId;
            const preset = getSelectedPreset();
            if (preset) {
              dialogData.presetName = preset.name;
              dialogData.presetPrompt = preset.prompt;

              const nameInput = dialogHelper.window?.document.getElementById(
                "preset-name",
              ) as HTMLInputElement;
              const promptInput =
                dialogHelper.window?.document.getElementById(
                  "preset-prompt",
                ) as HTMLTextAreaElement;

              if (nameInput) nameInput.value = preset.name;
              if (promptInput) promptInput.value = preset.prompt;

              ztoolkit.log(
                "[ZoteroGPT] Manual handler populated fields with:",
                preset.name,
              );
            }
          }
        });

        selectBox.addEventListener("change", (e: Event) => {
          const selectBox = e.target as HTMLSelectElement;
          const selectedId = selectBox.value;

          ztoolkit.log(
            "[ZoteroGPT] Manual change handler - value:",
            selectedId,
          );

          if (selectedId) {
            dialogData.selectedPresetId = selectedId;
            const preset = getSelectedPreset();
            if (preset) {
              dialogData.presetName = preset.name;
              dialogData.presetPrompt = preset.prompt;

              const nameInput = dialogHelper.window?.document.getElementById(
                "preset-name",
              ) as HTMLInputElement;
              const promptInput =
                dialogHelper.window?.document.getElementById(
                  "preset-prompt",
                ) as HTMLTextAreaElement;

              if (nameInput) nameInput.value = preset.name;
              if (promptInput) promptInput.value = preset.prompt;

              ztoolkit.log(
                "[ZoteroGPT] Manual handler populated fields with:",
                preset.name,
              );
            }
          }
        });
      } else {
        ztoolkit.log("[ZoteroGPT] ERROR: Could not find preset-select element");
      }
    }, 100);

    await dialogData.unloadLock.promise;
    addon.data.dialog = undefined;

    // Save if accepted
    if (dialogData._lastButtonId === "accept") {
      savePresets(dialogData.presets, setPref as any);
      ztoolkit.log("[ZoteroGPT] Presets saved");
    }
  }

  /**
   * Generate summaries for selected items
   */
  static async generateSummaries() {
    const ZoteroPane = ztoolkit.getGlobal("ZoteroPane");
    const items = ZoteroPane.getSelectedItems();
    if (!items || items.length === 0) {
      ztoolkit.getGlobal("alert")("Please select at least one item.");
      return;
    }

    // Validate API key
    const apiKey = getPref("apiKey") as string;
    if (!apiKey) {
      ztoolkit
        .getGlobal("alert")(
          "Please set your OpenAI API key in ZoteroGPT Settings.",
        );
      return;
    }

    const model = getPref("model") as string;
    const systemPrompt = getPref("systemPrompt") as string;
    const config: OpenAIConfig = { apiKey, model, systemPrompt };

    // Load presets and selections
    const presets = loadPresets(getPref as any);
    const selections = loadSelections(getPref as any);
    const prompt = combinePresets(presets, selections);

    ztoolkit.log("[ZoteroGPT] Starting summarization for", items.length, "items");
    ztoolkit.log("[ZoteroGPT] Using prompt:", prompt);

    const progressWindow = new ztoolkit.ProgressWindow("ZoteroGPT", {
      closeOnClick: false,
    });
    progressWindow.createLine({
      text: "Generating summaries...",
      progress: 0,
    });
    progressWindow.show();

    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      progressWindow.changeLine({
        text: `Processing ${i + 1}/${items.length}: ${item.getField("title")}`,
        progress: (i / items.length) * 100,
      });

      try {
        const summary = await generateSummary(item, prompt, config);

        // Convert summary to HTML format
        let noteHTML: string;
        if (selections.useMarkdownConversion) {
          // Convert markdown to HTML using our built-in converter
          ztoolkit.log("[ZoteroGPT] Converting markdown to HTML");
          noteHTML = `<h2>AI Summary</h2>${markdownToHtml(summary)}`;
          ztoolkit.log("[ZoteroGPT] Successfully converted markdown to HTML");
        } else {
          // Use simple HTML conversion (plain text with line breaks)
          noteHTML = `<h2>AI Summary</h2><p>${summary.replace(/\n/g, "<br/>")}</p>`;
        }

        // Create note with summary
        const note = new Zotero.Item("note");
        note.parentID = item.id;
        note.setNote(noteHTML);
        await note.saveTx();

        successCount++;
        ztoolkit.log("[ZoteroGPT] Summary created for item:", item.id);
      } catch (error) {
        errorCount++;
        ztoolkit.log("[ZoteroGPT] Error processing item:", item.id, error);
      }
    }

    progressWindow.changeLine({
      text: `Done! Success: ${successCount}, Errors: ${errorCount}`,
      progress: 100,
    });

    progressWindow.startCloseTimer(5000);

    if (errorCount > 0) {
      ztoolkit
        .getGlobal("alert")(
          `Generated ${successCount} summaries, ${errorCount} failed.`,
        );
    }
  }
}
