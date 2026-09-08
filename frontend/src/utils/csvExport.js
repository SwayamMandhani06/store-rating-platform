export function exportToCSV(filename, rows, columns) {
  if (!rows || !rows.length) return;

  const headerRow = columns.map((col) => `"${col.label || col.key}"`).join(',');

  const dataRows = rows.map((row) => {
    return columns
      .map((col) => {
        let val = '';
        if (col.csvValue) {
          val = col.csvValue(row);
        } else if (row[col.key] !== undefined && row[col.key] !== null) {
          val = row[col.key];
        }
        const stringVal = String(val).replace(/"/g, '""');
        return `"${stringVal}"`;
      })
      .join(',');
  });

  const csvContent = [headerRow, ...dataRows].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}-${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
