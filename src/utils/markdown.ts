/**
 * Simple markdown to HTML converter for Zotero notes
 * Handles common markdown syntax elements
 */

/**
 * Escape HTML special characters
 */
function escapeHtml(text: string): string {
  const map: { [key: string]: string } = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

/**
 * Convert markdown to HTML
 */
export function markdownToHtml(markdown: string): string {
  let html = markdown;

  // Code blocks (```code```) - handle first to avoid conflicts
  html = html.replace(/```([^\n]*)\n([\s\S]*?)```/g, (match, lang, code) => {
    return `<pre style="background-color: #f5f5f5; padding: 10px; border-radius: 4px; overflow-x: auto; white-space: pre-wrap; word-wrap: break-word;"><code>${escapeHtml(code.trim())}</code></pre>`;
  });

  // Split into lines for line-by-line processing
  const lines = html.split("\n");
  const processedLines: string[] = [];
  let inList = false;
  let listType: "ul" | "ol" | null = null;
  let inBlockquote = false;
  let blockquoteLines: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];

    // Skip empty lines
    if (line.trim() === "") {
      if (inList) {
        processedLines.push(listType === "ul" ? "</ul>" : "</ol>");
        inList = false;
        listType = null;
      }
      if (inBlockquote) {
        processedLines.push(`<blockquote>${blockquoteLines.join("<br/>")}</blockquote>`);
        inBlockquote = false;
        blockquoteLines = [];
      }
      // Don't add anything for empty lines - paragraph tags will handle spacing
      continue;
    }

    // Horizontal rules (---, ***, ___)
    const hrMatch = line.match(/^[\s]*[-*_]{3,}[\s]*$/);
    if (hrMatch) {
      if (inList) {
        processedLines.push(listType === "ul" ? "</ul>" : "</ol>");
        inList = false;
        listType = null;
      }
      if (inBlockquote) {
        processedLines.push(`<blockquote>${blockquoteLines.join("<br/>")}</blockquote>`);
        inBlockquote = false;
        blockquoteLines = [];
      }
      processedLines.push("<hr/>");
      continue;
    }

    // Blockquotes (> text)
    const blockquoteMatch = line.match(/^>\s*(.*)$/);
    if (blockquoteMatch) {
      if (inList) {
        processedLines.push(listType === "ul" ? "</ul>" : "</ol>");
        inList = false;
        listType = null;
      }
      if (!inBlockquote) {
        inBlockquote = true;
      }
      blockquoteLines.push(processInline(blockquoteMatch[1]));
      continue;
    } else if (inBlockquote) {
      // End of blockquote
      processedLines.push(`<blockquote>${blockquoteLines.join("<br/>")}</blockquote>`);
      inBlockquote = false;
      blockquoteLines = [];
    }

    // Headings (# ## ### #### ##### ######)
    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      if (inList) {
        processedLines.push(listType === "ul" ? "</ul>" : "</ol>");
        inList = false;
        listType = null;
      }
      const level = headingMatch[1].length;
      const text = headingMatch[2];
      processedLines.push(`<h${level}>${processInline(text)}</h${level}>`);
      continue;
    }

    // Unordered list items (- item or * item)
    const ulMatch = line.match(/^[\s]*[-*]\s+(.+)$/);
    if (ulMatch) {
      if (!inList || listType !== "ul") {
        if (inList && listType === "ol") {
          processedLines.push("</ol>");
        }
        processedLines.push("<ul>");
        inList = true;
        listType = "ul";
      }
      processedLines.push(`<li>${processInline(ulMatch[1])}</li>`);
      continue;
    }

    // Ordered list items (1. item, 2. item, etc.)
    const olMatch = line.match(/^[\s]*\d+\.\s+(.+)$/);
    if (olMatch) {
      if (!inList || listType !== "ol") {
        if (inList && listType === "ul") {
          processedLines.push("</ul>");
        }
        processedLines.push("<ol>");
        inList = true;
        listType = "ol";
      }
      processedLines.push(`<li>${processInline(olMatch[1])}</li>`);
      continue;
    }

    // Regular paragraph
    if (inList) {
      processedLines.push(listType === "ul" ? "</ul>" : "</ol>");
      inList = false;
      listType = null;
    }
    processedLines.push(`<p>${processInline(line)}</p>`);
  }

  // Close any open lists or blockquotes
  if (inList) {
    processedLines.push(listType === "ul" ? "</ul>" : "</ol>");
  }
  if (inBlockquote) {
    processedLines.push(`<blockquote>${blockquoteLines.join("<br/>")}</blockquote>`);
  }

  return processedLines.join("\n");
}

/**
 * Process inline markdown elements (bold, italic, code, links)
 */
function processInline(text: string): string {
  let processed = text;

  // Inline code (`code`)
  processed = processed.replace(/`([^`]+)`/g, (match, code) => {
    return `<code>${escapeHtml(code)}</code>`;
  });

  // Bold (**text** or __text__)
  processed = processed.replace(/\*\*([^\*]+)\*\*/g, "<strong>$1</strong>");
  processed = processed.replace(/__([^_]+)__/g, "<strong>$1</strong>");

  // Italic (*text* or _text_)
  processed = processed.replace(/\*([^\*]+)\*/g, "<em>$1</em>");
  processed = processed.replace(/_([^_]+)_/g, "<em>$1</em>");

  // Links ([text](url))
  processed = processed.replace(
    /\[([^\]]+)\]\(([^\)]+)\)/g,
    '<a href="$2">$1</a>',
  );

  return processed;
}
