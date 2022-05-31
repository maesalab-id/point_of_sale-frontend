export const exportToCSV = ({
  fileName,
  header,
  items,
  parseData
}) => {
  let result = [];
  let csvContent = "data:text/csv;charset=utf-8,";
  for (let i = 0; i < items.length; i++) {
    result[i] = parseData(items[i], i);
  }

  result = [header, ...result];

  for (let i = 0; i < result.length; i++) {
    csvContent += result[i].join(";") + "\r\n";
  }

  let encodedUri = encodeURI(csvContent);

  let link = document.createElement("a");

  link.setAttribute("href", encodedUri);
  link.setAttribute("download", fileName);

  link.click();

  return {
    result,
    csvContent
  };
}