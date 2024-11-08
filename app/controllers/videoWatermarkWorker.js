const { workerData, parentPort } = require('worker_threads');
const fs = require('fs');
const mime = require('mime-types');
const utils = require('./middleware/utils'); // Assuming utils contains the uploadFile function
const { addWatermarkToVideo } = require('./hopper');
const {uploadFiletoAwsS3BucketforVideowatermark} = require("./shared/helpers")
async function processFile() {
  try {
    const { fileData, STORAGE_PATH } = workerData;
    const date = new Date();

    let imageforStore = await utils.uploadFile({
      fileData: fileData,
      path: `${STORAGE_PATH}/test`,
    });

    const split = imageforStore.fileName.split(".");
    const extention = split[1];

    const randomname = Math.floor(1000000000 + Math.random() * 9000000000);
    const randomname2 = Math.floor(100 + Math.random() * 900);

    const outputFileforconvertion = `/var/www/mongo/presshop_rest_apis/public/test/${randomname}.mp4`;
    const inputFile = `/var/www/mongo/presshop_rest_apis/public/test/${imageforStore.fileName}`;

    const Audiowatermak = `/var/www/mongo/presshop_rest_apis/public/test/newWatermark.mp3`;
    const imageWatermark = `/var/www/mongo/presshop_rest_apis/public/Watermark/newLogo.png`;
    const outputFilePathsameduration = `/var/www/mongo/presshop_rest_apis/public/test/${randomname + randomname2}.${extention}`;

    const value = mime.lookup(`.${extention}`);

    // Add watermark
    await addWatermarkToVideo(inputFile, imageWatermark, Audiowatermak, outputFilePathsameduration);

    const buffer1 = fs.readFileSync(outputFilePathsameduration);
    let audio_description = await uploadFiletoAwsS3BucketforVideowatermark({
      fileData: buffer1,
      path: `public/userImages`,
      mime_type: value
    });

    // Clean up temporary files
    fs.unlinkSync(outputFilePathsameduration);
    fs.unlinkSync(inputFile);

    const final = audio_description.data.replace("https://uat-presshope.s3.eu-west-2.amazonaws.com", "https://uat-cdn.presshop.news");

    // Send the result back to the main thread
    parentPort.postMessage({ watermark: final });

  } catch (error) {
    // Send the error back to the main thread
    parentPort.postMessage({ error: error.message });
  }
}

// Start processing when the worker is initialized
processFile();
