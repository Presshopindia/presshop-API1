const { parentPort, workerData } = require('worker_threads');
const { modify3addWatermarkToAudio } = require('./hopper');
const fs = require('fs');

(async () => {
    try {
        const { outputFileforconvertion, outputFilePath, outputFilePathsameduration } = workerData;
        await modify3addWatermarkToAudio(outputFileforconvertion, outputFilePath, outputFilePathsameduration);
        parentPort.postMessage({ success: true, outputFilePathsameduration });
    } catch (error) {
        parentPort.postMessage({ success: false, error });
    }
})();