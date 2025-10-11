/**
 * OpenAI API client for ZoteroGPT
 * Handles Chat Completions API with fulltext extraction
 */

export interface OpenAIConfig {
  apiKey: string;
  model: string;
  systemPrompt?: string;
}

export interface FileUploadResponse {
  id: string;
  object: string;
  bytes: number;
  created_at: number;
  filename: string;
  purpose: string;
}

export interface ChatCompletionsResponse {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
}

/**
 * Extract fulltext from a PDF attachment using Zotero's built-in extraction
 */
async function extractPDFFulltext(attachmentID: number): Promise<string | null> {
  try {
    const attachment = Zotero.Items.get(attachmentID);
    if (!attachment) {
      ztoolkit.log("[ZoteroGPT] Attachment not found:", attachmentID);
      return null;
    }

    if (attachment.attachmentContentType !== "application/pdf") {
      ztoolkit.log("[ZoteroGPT] Attachment is not a PDF:", attachment.attachmentContentType);
      return null;
    }

    ztoolkit.log("[ZoteroGPT] Extracting fulltext from PDF...");
    const fulltext = await attachment.attachmentText;

    if (!fulltext || fulltext.trim().length === 0) {
      ztoolkit.log("[ZoteroGPT] No text extracted from PDF");
      return null;
    }

    ztoolkit.log(`[ZoteroGPT] Extracted ${fulltext.length} characters from PDF`);
    return fulltext;
  } catch (error) {
    ztoolkit.log("[ZoteroGPT] Error extracting PDF fulltext:", error);
    return null;
  }
}

/**
 * Get PDF file size in bytes
 */
async function getPDFFileSize(pdfPath: string): Promise<number> {
  try {
    const file = Zotero.File.pathToFile(pdfPath);
    if (!file.exists()) {
      return 0;
    }
    return file.fileSize;
  } catch (error) {
    ztoolkit.log("[ZoteroGPT] Error getting PDF file size:", error);
    return 0;
  }
}

/**
 * Upload a PDF file to OpenAI Files API
 */
export async function uploadPDFToOpenAI(
  pdfPath: string,
  config: OpenAIConfig,
): Promise<string> {
  const file = Zotero.File.pathToFile(pdfPath);
  if (!file.exists()) {
    throw new Error("PDF file not found");
  }

  ztoolkit.log(`[ZoteroGPT] Uploading PDF: ${file.leafName} (${(file.fileSize / 1024 / 1024).toFixed(2)} MB)`);

  // Read file as binary data
  const inputStream = (Components.classes as any)[
    "@mozilla.org/network/file-input-stream;1"
  ].createInstance(Components.interfaces.nsIFileInputStream);
  inputStream.init(file, 0x01, 0o444, 0);

  const binaryStream = (Components.classes as any)[
    "@mozilla.org/binaryinputstream;1"
  ].createInstance(Components.interfaces.nsIBinaryInputStream);
  binaryStream.setInputStream(inputStream);

  const bytes = binaryStream.readByteArray(binaryStream.available());
  binaryStream.close();
  inputStream.close();

  // Create multipart/form-data manually
  const boundary =
    "----WebKitFormBoundary" + Math.random().toString(36).substring(2);
  const encoder = new TextEncoder();

  const parts: Uint8Array[] = [];

  // Add purpose field (for Assistants API)
  parts.push(encoder.encode(`--${boundary}\r\n`));
  parts.push(
    encoder.encode('Content-Disposition: form-data; name="purpose"\r\n\r\n'),
  );
  parts.push(encoder.encode("assistants\r\n"));

  // Add file field
  parts.push(encoder.encode(`--${boundary}\r\n`));
  parts.push(
    encoder.encode(
      `Content-Disposition: form-data; name="file"; filename="${file.leafName}"\r\n`,
    ),
  );
  parts.push(encoder.encode("Content-Type: application/pdf\r\n\r\n"));
  parts.push(new Uint8Array(bytes));
  parts.push(encoder.encode("\r\n"));

  // Add closing boundary
  parts.push(encoder.encode(`--${boundary}--\r\n`));

  // Combine all parts
  const totalLength = parts.reduce((sum, part) => sum + part.length, 0);
  const body = new Uint8Array(totalLength);
  let offset = 0;
  for (const part of parts) {
    body.set(part, offset);
    offset += part.length;
  }

  // Upload to OpenAI
  const response = await Zotero.HTTP.request("POST", "https://api.openai.com/v1/files", {
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      "Content-Type": `multipart/form-data; boundary=${boundary}`,
    },
    body,
    responseType: "json",
    timeout: 120000, // 2 minutes for file upload
  });

  if (response.status !== 200) {
    throw new Error(
      `File upload failed: ${response.status} ${response.responseText}`,
    );
  }

  const data = response.response as FileUploadResponse;
  ztoolkit.log(`[ZoteroGPT] PDF uploaded successfully, file_id: ${data.id}`);
  return data.id;
}

/**
 * Call OpenAI Responses API with file
 */
export async function callResponsesAPI(
  fileId: string,
  prompt: string,
  config: OpenAIConfig,
): Promise<string> {
  const requestBody = {
    model: config.model,
    input: [
      {
        role: "user",
        content: [
          {
            type: "input_file",
            file_id: fileId,
          },
          {
            type: "input_text",
            text: prompt,
          },
        ],
      },
    ],
  };

  ztoolkit.log("[ZoteroGPT] Calling Responses API with file_id:", fileId);

  let response;
  try {
    response = await Zotero.HTTP.request(
      "POST",
      "https://api.openai.com/v1/responses",
      {
        headers: {
          Authorization: `Bearer ${config.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
        responseType: "json",
        timeout: 300000, // 5 minutes for PDF processing
      },
    );
  } catch (e: any) {
    // Zotero.HTTP throws exception for non-200 responses
    ztoolkit.log("[ZoteroGPT] Responses API error:", e);
    if (e.xmlhttp?.response?.error) {
      ztoolkit.log("[ZoteroGPT] OpenAI error details:", JSON.stringify(e.xmlhttp.response.error, null, 2));
      throw new Error(
        `Responses API failed: ${e.status}\nError: ${e.xmlhttp.response.error.message || JSON.stringify(e.xmlhttp.response.error)}`,
      );
    }
    throw e;
  }

  const data = response.response as any;

  // Parse response: output[] → find type:"message" → content[] → find type:"output_text" → text
  const messageOutput = data.output?.find((item: any) => item.type === "message");
  const textContent = messageOutput?.content?.find(
    (item: any) => item.type === "output_text",
  );
  const summary = textContent?.text;

  if (!summary) {
    throw new Error("No summary found in API response");
  }

  ztoolkit.log(`[ZoteroGPT] Received response with ${summary.length} characters`);
  return summary;
}

/**
 * Truncate text to fit within token limits
 * Rough estimate: 1 token ≈ 4 characters for English text
 */
function truncateText(text: string, maxTokens: number = 100000): string {
  const maxChars = maxTokens * 4; // Conservative estimate
  if (text.length <= maxChars) {
    return text;
  }

  ztoolkit.log(`[ZoteroGPT] Truncating text from ${text.length} to ${maxChars} characters`);
  return text.substring(0, maxChars) + "\n\n[Text truncated due to length...]";
}

/**
 * Call OpenAI Chat Completions API
 */
export async function callChatCompletionsAPI(
  prompt: string,
  config: OpenAIConfig,
): Promise<string> {
  const systemPrompt = config.systemPrompt || "You are a helpful research assistant that summarizes academic papers.";
  const requestBody = {
    model: config.model,
    messages: [
      {
        role: "system",
        content: systemPrompt,
      },
      {
        role: "user",
        content: prompt,
      },
    ],
  };

  ztoolkit.log(`[ZoteroGPT] Calling Chat Completions API with ${prompt.length} characters`);

  let response;
  try {
    response = await Zotero.HTTP.request(
      "POST",
      "https://api.openai.com/v1/chat/completions",
      {
        headers: {
          Authorization: `Bearer ${config.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
        responseType: "json",
        timeout: 300000, // 5 minutes for long texts
      },
    );
  } catch (e: any) {
    ztoolkit.log("[ZoteroGPT] Chat Completions API error:", e);
    if (e.xmlhttp?.response?.error) {
      ztoolkit.log("[ZoteroGPT] OpenAI error details:", JSON.stringify(e.xmlhttp.response.error, null, 2));
      throw new Error(
        `Chat Completions API failed: ${e.status}\nError: ${e.xmlhttp.response.error.message || JSON.stringify(e.xmlhttp.response.error)}`,
      );
    }
    throw e;
  }

  const data = response.response as ChatCompletionsResponse;
  const content = data.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error("No content found in API response");
  }

  ztoolkit.log(`[ZoteroGPT] Received response with ${content.length} characters`);
  return content;
}

/**
 * Generate summary for a Zotero item
 */
export async function generateSummary(
  item: Zotero.Item,
  prompt: string,
  config: OpenAIConfig,
): Promise<string> {
  ztoolkit.log("[ZoteroGPT] Generating summary for item:", item.id);

  // Get title and abstract
  const title = item.getField("title") as string;
  const abstract = item.getField("abstractNote") as string;

  const contextText = `Title: ${title}\n\nAbstract: ${abstract || "No abstract available"}`;
  const fullPrompt = `${contextText}\n\n${prompt}`;

  // Try to find PDF attachment
  const attachments = item.getAttachments();
  let pdfPath: string | null = null;
  let pdfAttachmentID: number | null = null;

  for (const attachmentID of attachments) {
    const attachment = Zotero.Items.get(attachmentID);
    if (attachment && attachment.isPDFAttachment()) {
      const path = await attachment.getFilePathAsync();
      if (path) {
        pdfPath = path;
        pdfAttachmentID = attachmentID;
        break;
      }
    }
  }

  let summary: string;

  if (pdfPath) {
    // Check PDF file size
    const fileSize = await getPDFFileSize(pdfPath);
    const fileSizeMB = fileSize / 1024 / 1024;
    const MAX_UPLOAD_SIZE_MB = 25;

    ztoolkit.log(`[ZoteroGPT] Found PDF: ${fileSizeMB.toFixed(2)} MB`);

    if (fileSizeMB <= MAX_UPLOAD_SIZE_MB) {
      // PDF is small enough - use Responses API with file upload
      try {
        ztoolkit.log("[ZoteroGPT] PDF ≤ 25 MB, using Responses API with file upload");
        const fileId = await uploadPDFToOpenAI(pdfPath, config);
        summary = await callResponsesAPI(fileId, fullPrompt, config);
      } catch (error) {
        // If Responses API fails, fall back to fulltext extraction
        ztoolkit.log("[ZoteroGPT] Responses API failed, falling back to fulltext extraction:", error);
        const fulltext = await extractPDFFulltext(pdfAttachmentID!);
        if (fulltext) {
          const truncatedFulltext = truncateText(fulltext);
          const fullPromptWithText = `${contextText}\n\nFull Text:\n${truncatedFulltext}\n\n${prompt}`;
          summary = await callChatCompletionsAPI(fullPromptWithText, config);
        } else {
          // If fulltext extraction also fails, use title/abstract only
          ztoolkit.log("[ZoteroGPT] Fulltext extraction failed, using title/abstract only");
          summary = await callChatCompletionsAPI(fullPrompt, config);
        }
      }
    } else {
      // PDF is too large - use fulltext extraction with Chat Completions API
      ztoolkit.log("[ZoteroGPT] PDF > 25 MB, using fulltext extraction with Chat Completions API");
      const fulltext = await extractPDFFulltext(pdfAttachmentID!);
      if (fulltext) {
        const truncatedFulltext = truncateText(fulltext);
        const fullPromptWithText = `${contextText}\n\nFull Text:\n${truncatedFulltext}\n\n${prompt}`;
        summary = await callChatCompletionsAPI(fullPromptWithText, config);
      } else {
        // If fulltext extraction fails, use title/abstract only
        ztoolkit.log("[ZoteroGPT] Fulltext extraction failed, using title/abstract only");
        summary = await callChatCompletionsAPI(fullPrompt, config);
      }
    }
  } else {
    // No PDF found - use title/abstract only
    ztoolkit.log("[ZoteroGPT] No PDF found, using Chat Completions API with title/abstract only");
    summary = await callChatCompletionsAPI(fullPrompt, config);
  }

  ztoolkit.log("[ZoteroGPT] Summary generated successfully");
  return summary;
}
