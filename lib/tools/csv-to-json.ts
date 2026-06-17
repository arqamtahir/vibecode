export interface CsvParseOptions {
  delimiter: string;
  hasHeader: boolean;
}

export interface CsvParseResult {
  data: Record<string, string>[] | string[][];
  errors: string[];
  rowCount: number;
}

/** Parse a CSV string into structured data, handling quoted fields and embedded delimiters. */
export function parseCsv(input: string, options: CsvParseOptions): CsvParseResult {
  const { delimiter, hasHeader } = options;
  const errors: string[] = [];
  const lines = input.split(/\r?\n/);

  function parseRow(line: string): string[] {
    const fields: string[] = [];
    let i = 0;
    while (i < line.length) {
      if (line[i] === '"') {
        let value = "";
        i++; // skip opening quote
        while (i < line.length) {
          if (line[i] === '"') {
            if (line[i + 1] === '"') {
              value += '"';
              i += 2;
            } else {
              i++; // skip closing quote
              break;
            }
          } else {
            value += line[i++];
          }
        }
        fields.push(value);
        // skip delimiter after closing quote
        if (i < line.length && line[i] === delimiter) i++;
      } else {
        let j = line.indexOf(delimiter, i);
        if (j === -1) j = line.length;
        fields.push(line.slice(i, j));
        i = j + 1;
      }
    }
    // Handle trailing delimiter
    if (line.endsWith(delimiter)) fields.push("");
    return fields;
  }

  const nonEmpty = lines.filter((l) => l.trim() !== "");
  if (!nonEmpty.length) {
    return { data: [], errors: ["Input is empty."], rowCount: 0 };
  }

  const rows = nonEmpty.map((l, i) => {
    try {
      return parseRow(l);
    } catch {
      errors.push(`Row ${i + 1}: parse error.`);
      return [] as string[];
    }
  });

  const colCount = rows[0].length;

  if (hasHeader) {
    const headers = rows[0];
    const dataRows = rows.slice(1);
    const data = dataRows.map((row, i) => {
      if (row.length !== colCount) {
        errors.push(`Row ${i + 2}: expected ${colCount} columns, got ${row.length}.`);
      }
      const obj: Record<string, string> = {};
      headers.forEach((h, j) => {
        obj[h || `col${j + 1}`] = row[j] ?? "";
      });
      return obj;
    });
    return { data, errors, rowCount: dataRows.length };
  } else {
    return { data: rows, errors, rowCount: rows.length };
  }
}
