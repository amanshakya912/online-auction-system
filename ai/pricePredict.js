const { spawn } = require('child_process');

function predictPrice(features) {
    return new Promise((resolve, reject) => {
        const featuresJSON = JSON.stringify(features);
        console.log("Features Sent:", featuresJSON);

        const pythonProcess = spawn('python3', ['predict_price.py', featuresJSON]);

        let output = '';
        let errorOutput = '';

        pythonProcess.stdout.on('data', (data) => {
            console.log("Python STDOUT:", data.toString()); // Debug Python output
            output += data.toString();
        });

        pythonProcess.stderr.on('data', (data) => {
            console.error("Python STDERR:", data.toString()); // Debug errors
            errorOutput += data.toString();
        });

        pythonProcess.on('close', (code) => {
            if (code === 0) {
                try {
                    // Trim and parse the output as a number
                    const result = parseFloat(output.trim());
                    if (isNaN(result)) {
                        reject(new Error(`Invalid output: ${output}`));
                    } else {
                        resolve(result);
                    }
                } catch (parseError) {
                    reject(new Error(`Failed to parse output: ${output}`));
                }
            } else {
                reject(new Error(`Python script exited with code ${code}: ${errorOutput}`));
            }
        });
    });
}

module.exports = predictPrice