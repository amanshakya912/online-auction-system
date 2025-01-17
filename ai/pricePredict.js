const { spawn } = require('child_process');

function predictPrice(features) {
    return new Promise((resolve, reject) => {
        // Convert features to a JSON string to pass as an argument
        const featuresJSON = JSON.stringify(features);

        // Spawn a Python process
        const pythonProcess = spawn('python', ['predict_price.py', featuresJSON]);

        let output = '';
        let errorOutput = '';

        // Listen for data from stdout (Python script output)
        pythonProcess.stdout.on('data', (data) => {
            output += data.toString();
        });

        // Listen for errors from stderr
        pythonProcess.stderr.on('data', (data) => {
            errorOutput += data.toString();
        });

        // Handle the process closing
        pythonProcess.on('close', (code) => {
            if (code === 0) {
                resolve(output.trim());
            } else {
                reject(new Error(`Python script exited with code ${code}: ${errorOutput}`));
            }
        });
    });
}

// Example features
const features = [842, 0, 2.2, 0, 1, 0, 7, 0.6, 188, 2, 2, 20, 756, 2549, 9, 7, 19, 0, 0, 1];

predictPrice(features)
    .then(predictedPrice => {
        console.log('Predicted Price Range:', predictedPrice);
    })
    .catch(error => {
        console.error('Error predicting price:', error.message);
    });
