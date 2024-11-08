const { parentPort, workerData } = require('worker_threads');
const { main1 } = require('./hopper');
const fs = require('fs');

(async () => {
    try {
        const { inputFile, outputFileforconvertion } = workerData;
        await main1(inputFile, outputFileforconvertion);
        fs.unlinkSync(inputFile);
        parentPort.postMessage({ success: true, outputFileforconvertion });
    } catch (error) {
        parentPort.postMessage({ success: false, error });
    }
})();