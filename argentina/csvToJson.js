const csv = require('csvtojson');
const fs = require('fs');

const csvFilePath = 'distribuciones.csv';

csv()
  .fromFile(csvFilePath)
  .then(jsonObj => {
    fs.writeFileSync('datasets.json', JSON.stringify(jsonObj));
  });
