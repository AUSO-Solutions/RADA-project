// import { json2csv } from 'json-2-csv';
const user = [
  {
    "firstName": 'John',
    "lastName": 'Doe',
    "email": 'johndoe@gmail.com',
  },
  {
    "firstName": 'Kenny',
    "lastName": 'Doe',
    "email": 'johnnydoe@gmail.com',
  }
]

const convertToCSV = (objArray) => {
  const array = typeof objArray !== 'object' ? JSON.parse(objArray) : objArray;
  let str = '';

  for (let i = 0; i < array.length; i++) {
    let line = '';
    for (let index in array[i]) {
      if (line !== '') line += ',';

      line += array[i][index];
    }
    str += line + '\r\n';
  }
  return str;
};

const downloadCSV = (data, fileName) => {
  const csvData = new Blob([convertToCSV(data)], { type: 'text/csv' });
  const csvURL = URL.createObjectURL(csvData);
  const link = document.createElement('a');
  link.href = csvURL;
  link.download = `${fileName}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const downloadTemplate = (data) => {
  downloadCSV(user, 'user-template')
}

export { user, downloadTemplate }