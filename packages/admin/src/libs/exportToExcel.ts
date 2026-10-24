import * as XLSX from "xlsx";

const exportToExcel = (
  rows: (string | number)[][],
  filename: string,
  sheetName = "Sheet1",
) => {
  const worksheet = XLSX.utils.aoa_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

  XLSX.writeFile(
    workbook,
    filename.endsWith(".xlsx") ? filename : `${filename}.xlsx`,
  );
};

export default exportToExcel;
