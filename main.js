// The plan is to give certain values to the system, and from there it then decides if bid should be increased, kept the same, or decreased


var csv = require('csvtojson'); // Parses csv to json
var brain = require('brain.js'); // Handles the black magic of neural networks
var readline = require('readline'); // Allows CLI

// Create CLI interface
var rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
	prompt: 'Bid,Pos,Imp,Cli,Con> '
});

// Set some global variables
var csvFilePath = 'test.csv';
var trainingData = [];
var network;

// Function that handles what needs to be done on boot
function boot() {
	// Parse data from the CSV
	csv()
		.fromFile(csvFilePath)
		.on('json', function(jsonObj) {
			// Populate the training data
			// Input is what the predictions are done on
			// Outputs are the results
			var input = [jsonObj.Bid, jsonObj.Position, jsonObj.Impressions, jsonObj.Clicks, jsonObj.Conversions];
			var output = [jsonObj.ActionUp, jsonObj.ActionKeep, jsonObj.ActionDown];

			trainingData.push({
				input: input,
				output: output
			});
		}).on('done', trainNetwork);
	;
};

// Handle trainign the neural network
function trainNetwork() {
	network = new brain.NeuralNetwork();
	network.train(trainingData);
	start();
};

// Main loop function
function start() {
	// Initialize CLI
	rl.prompt();

	// Read and parse the input
	rl.on('line', function(line) {
		// Should have input sanitization, but whatever
		var match = line.split(',');

		// Show the result
		console.log(match, network.run(match));

		rl.prompt();
	}).on('close', function() {
		console.log('Bye');
		process.exit(0);
	});
};

boot();
