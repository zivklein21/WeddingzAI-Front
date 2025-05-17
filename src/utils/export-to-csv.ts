export const exportToCSV = (
  data: Record<string, string | number>[],
  headers: string[],
  filename: string
) => {
  if (!data.length || !headers.length) {
    console.warn("No data or headers to export.");
    return;
  }

  let csvContent = headers.join(",") + "\n";

  data.forEach((row) => {
    const rowValues = headers.map((key) => row[key] ?? "");
    csvContent += rowValues.join(",") + "\n";
  });

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
