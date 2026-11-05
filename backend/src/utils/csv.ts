const BOM = '﻿';

/**
 * Neutralise spreadsheet formula injection (cells starting with = + - @ are
 * executed by Excel/Sheets). Plain phone numbers like "+44 20 7946 0192" are
 * left untouched so they stay readable.
 */
function neutralise(value: string): string {
  if (/^[=+\-@\t\r]/.test(value) && !/^[+-]?[\d\s().-]+$/.test(value)) {
    return `'${value}`;
  }
  return value;
}

export function csvCell(value: unknown): string {
  const text = value === null || value === undefined ? '' : String(value);
  return `"${neutralise(text).replace(/"/g, '""')}"`;
}

/** RFC-4180 CSV with UTF-8 BOM and CRLF line endings (Excel / Numbers / Sheets friendly). */
export function toCsv(headers: string[], rows: unknown[][]): string {
  const lines = [headers.map(csvCell).join(','), ...rows.map((r) => r.map(csvCell).join(','))];
  return BOM + lines.join('\r\n') + '\r\n';
}
