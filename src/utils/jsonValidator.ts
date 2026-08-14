export interface JsonValidationResult {
  isValid: boolean;
  parsedData?: any;
  errorMessage?: string;
  errorLine?: number;
  errorColumn?: number;
  errorSnippet?: string;
  linesCount: number;
}

/**
 * Validates JSON string and pinpoints the line & column number if a SyntaxError occurs.
 */
export function validateJsonString(rawText: string): JsonValidationResult {
  if (!rawText || !rawText.trim()) {
    return {
      isValid: false,
      errorMessage: 'Teks JSON masih kosong. Silakan tempelkan (paste) atau ketik teks JSON.',
      linesCount: 0
    };
  }

  const lines = rawText.split('\n');
  const linesCount = lines.length;

  try {
    const parsedData = JSON.parse(rawText);
    return {
      isValid: true,
      parsedData,
      linesCount
    };
  } catch (err: any) {
    const message = err?.message || 'Format JSON tidak valid';
    let line = 1;
    let column = 1;

    // Pattern 1: position X (e.g. "at position 245" or "in JSON at position 245")
    const posMatch = message.match(/position\s+(\d+)/i);
    // Pattern 2: line X column Y (e.g. "at line 12 column 5")
    const lineColMatch = message.match(/line\s+(\d+)\s+column\s+(\d+)/i);
    // Pattern 3: line X (e.g. "at line 12")
    const lineOnlyMatch = message.match(/line\s+(\d+)/i);

    if (lineColMatch) {
      line = parseInt(lineColMatch[1], 10);
      column = parseInt(lineColMatch[2], 10);
    } else if (lineOnlyMatch) {
      line = parseInt(lineOnlyMatch[1], 10);
      column = 1;
    } else if (posMatch) {
      const pos = parseInt(posMatch[1], 10);
      line = 1;
      column = 1;
      for (let i = 0; i < pos && i < rawText.length; i++) {
        if (rawText[i] === '\n') {
          line++;
          column = 1;
        } else {
          column++;
        }
      }
    } else {
      // Fallback detection for "Unexpected end of JSON input" or generic error
      if (message.toLowerCase().includes('end of json') || message.toLowerCase().includes('end of input')) {
        line = linesCount;
        column = lines[linesCount - 1]?.length || 1;
      } else {
        const commonLine = scanCommonJsonErrorLine(lines);
        if (commonLine > 0) {
          line = commonLine;
        }
      }
    }

    // Ensure line is within valid range [1, linesCount]
    line = Math.max(1, Math.min(line, linesCount));

    const errorSnippet = lines[line - 1] ? lines[line - 1].trim() : '';

    return {
      isValid: false,
      parsedData: null,
      errorMessage: message,
      errorLine: line,
      errorColumn: column,
      errorSnippet,
      linesCount
    };
  }
}

/**
 * Helper to scan lines for common JSON syntax mistakes
 */
function scanCommonJsonErrorLine(lines: string[]): number {
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i];
    // Trailing comma before closing brace or bracket
    if (/,\s*[\}\]]/.test(l)) {
      return i + 1;
    }
    // Single quotes instead of double quotes for property names
    if (/'[^']*'\s*:/.test(l)) {
      return i + 1;
    }
    // Unquoted key names
    if (/([{,]\s*)([a-zA-Z0-9_$]+)\s*:/.test(l) && !/"[a-zA-Z0-9_$]+"/.test(l)) {
      return i + 1;
    }
  }
  return 1;
}

/**
 * Convert a single JSON code line into HTML with syntax highlight spans
 */
export function highlightJsonLine(lineText: string): string {
  if (!lineText) return '&nbsp;';

  const escaped = lineText
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  return escaped.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?|[{}[\]:,])/g,
    (match) => {
      let cls = 'text-slate-700 dark:text-slate-300';
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          // Key
          cls = 'text-purple-600 font-semibold dark:text-purple-400';
        } else {
          // String value
          cls = 'text-emerald-600 font-medium dark:text-emerald-400';
        }
      } else if (/true|false/.test(match)) {
        cls = 'text-blue-600 font-bold dark:text-blue-400';
      } else if (/null/.test(match)) {
        cls = 'text-rose-500 font-bold dark:text-rose-400';
      } else if (/^-?\d/.test(match)) {
        cls = 'text-amber-600 font-semibold dark:text-amber-400';
      } else if (/[{}[\]:,]/.test(match)) {
        cls = 'text-slate-400 font-bold dark:text-slate-500';
      }
      return `<span class="${cls}">${match}</span>`;
    }
  );
}
