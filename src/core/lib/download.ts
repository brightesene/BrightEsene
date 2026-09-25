/**
 * Download rows as a CSV file that Excel opens directly: UTF-8 BOM and
 * semicolon separators (the default list separator for nl-BE / fr-BE Excel).
 * Swap for a server-generated .xlsx once the reporting backend exists.
 */
export function downloadSpreadsheet(filename: string, header: string[], rows: Array<Array<string | number>>): void {
  const escape = (v: string | number) => {
    const s = String(v);
    return /[";\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const body = [header, ...rows].map((r) => r.map(escape).join(';')).join('\r\n');
  const blob = new Blob(['﻿' + body], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename.endsWith('.csv') ? filename : `${filename}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
