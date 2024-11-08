const { parentPort } = require('worker_threads');
const Jimp = require('jimp');
const AWS = require('aws-sdk');


const ACCESS_KEY = "AKIAVOXE3E6KGIDEVH2F"; //process.env.ACCESS_KEY
const SECRET_KEY = "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"; //process.env.SECRET_KEY
const Bucket = "uat-presshope"; //process.env.Bucket
const REGION = "eu-west-2";
AWS.config.update({
  accessKeyId: ACCESS_KEY,
  secretAccessKey: SECRET_KEY,
  region: REGION,
});


parentPort.on('message', async (data) => {
    try {
        const { ORIGINAL_IMAGE, WATERMARK, FILENAME, mime_type } = data;

        const [image, logo] = await Promise.all([
            Jimp.read(ORIGINAL_IMAGE),
            Jimp.read(WATERMARK),
        ]);

        const isPortrait = image.bitmap.height > image.bitmap.width;
        logo.cover(image.getWidth(), image.getHeight());

        const processedImage = await image.composite(logo, 0, 0, {
            mode: Jimp.BLEND_SCREEN,
            opacitySource: 1,
            opacityDest: 0.1,
        });

        processedImage.getBuffer(Jimp.MIME_PNG, (err, imageDataBuffer) => {
            if (err) {
                parentPort.postMessage({ error: err });
                return;
            }

            const s3 = new AWS.S3();
            const s3Params = {
                Bucket: "uat-presshope", // Replace with your S3 bucket name
                Key: `contentData/${FILENAME}`, // Define the S3 key (path) for the uploaded image
                Body: imageDataBuffer,
                ContentType: mime_type,
            };

            s3.upload(s3Params, (s3Err, s3Data) => {
                if (s3Err) {
                    parentPort.postMessage({ error: s3Err });
                    return;
                }

                parentPort.postMessage({ imageUrl: s3Data.Location });
            });
        });
    } catch (err) {
        parentPort.postMessage({ error: err });
    }
});