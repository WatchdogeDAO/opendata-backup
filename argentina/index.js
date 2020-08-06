const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const axios = require('axios');
var FormData = require('form-data');

const data = require('./datasets.json');

dotenv.config();

const key = process.env.PINATA_API_KEY;
const secret = process.env.PINATA_API_SECRET;
const dir = 'data';

const main = async () => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  for (let [index, element] of data.entries()) {
    if (element.ipfsHash) continue;

    try {
      // Download the file
      const extension = parseFileType(element.distribucion_formato);
      const fileName = `${index}_${element.distribucion_titulo}${extension}`;
      const filePath = path.join(dir, fileName);
      await downloadVideo(element.distribucion_url_descarga, filePath);
      // Upload video to pinata.
      const pinataEndpoint = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
      const formData = new FormData();
      formData.append('file', fs.createReadStream(filePath));

      const response = await axios({
        method: 'post',
        url: pinataEndpoint,
        data: formData,
        maxContentLength: 'Infinity',
        headers: {
          'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
          pinata_api_key: key,
          pinata_secret_api_key: secret,
        },
      });
      element.fileName = fileName;
      element.ipfsHash = response.data.IpfsHash;
      console.log('Successful Upload:', response.data.IpfsHash);
      break;
    } catch (e) {
      // TODO: Of course make this more solid.
      console.log('Could not upload:', index, e);
      data.splice(index, 1);
    }
  }

  fs.writeFileSync('snapshot.json', JSON.stringify(data));
};

async function downloadVideo(url, fileName) {
  const writer = fs.createWriteStream(fileName);

  const response = await axios({
    url,
    method: 'GET',
    responseType: 'stream',
  });

  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on('finish', resolve);
    writer.on('error', reject);
  });
}

function parseFileType(fileType) {
  return fileType ? `.${fileType.toLowerCase()}` : '';
}

main();
