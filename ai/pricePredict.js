const { spawn } = require('child_process');
const path = require('path');

const PYTHON_CMD = process.platform === 'win32' ? 'python' : 'python3';

function predictPrice(features) {
    return new Promise((resolve) => {
        const featuresJSON = JSON.stringify(features);
        const scriptPath = path.join(__dirname, '..', 'predict_price.py');

        const pythonProcess = spawn(PYTHON_CMD, [scriptPath, featuresJSON]);

        let output = '';
        let errorOutput = '';

        pythonProcess.stdout.on('data', (data) => {
            output += data.toString();
        });

        pythonProcess.stderr.on('data', (data) => {
            errorOutput += data.toString();
        });

        pythonProcess.on('close', (code) => {
            if (code === 0) {
                const result = parseFloat(output.trim());
                if (!isNaN(result)) {
                    return resolve(result);
                }
            }
            console.warn('Price prediction unavailable, using default. Python error:', errorOutput.trim());
            resolve(0);
        });

        pythonProcess.on('error', () => {
            console.warn('Python not available, using default price prediction.');
            resolve(0);
        });
    });
}

module.exports = predictPrice