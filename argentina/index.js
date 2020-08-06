const fs = require('fs');
const dotenv = require('dotenv');
const data = require('./datasets.json');

dotenv.config();

const key = process.env.PINATA_API_KEY;
const secret = process.env.PINATA_API_SECRET;

const main = async () => {
  let newData = [];
  for (const element of data) {
    if (element.hash) continue;

    try {
      const pinataEndpoint = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;

      // Download the file

      // Select the correct termination.

      const response = await axios({
        method: 'post',
        url: url,
        data: req.body.data,
        headers: {
          pinata_api_key: process.env.PINATA_KEY,
          pinata_secret_api_key: process.env.PINATA_SECRET_KEY,
        },
      });
      res.json(response.data);
    } catch (e) {
      res.status(500).send(e);
    }
    // Err. Something went wrong with an upload? Write to a new file and return.
    // Ok. Add the hash to the elementt
  }
};

const parseFileType = fileType => {
  return fileType ? `.${fileType.toLowerCase()}` : '';
};

main();
