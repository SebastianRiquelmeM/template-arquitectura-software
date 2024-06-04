import net from "net";
import readline from "readline";

console.log("Hello from frontend");

const client = new net.Socket();

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

function connectToServer() {
	client.connect(5000, "bus", () => {
		console.log("Connected to bus");
		promptNumbers();
	});
}

function promptNumbers() {
	rl.question("Enter the first number: ", (num1) => {
		rl.question("Enter the second number: ", (num2) => {
			const message = `00012sumar${num1} ${num2}`;
			console.log("Sending message:", message);
			client.write(message);
		});
	});
}

client.on("data", (data) => {
	const response = data.toString();
	console.log("Received response:", response);
	promptNumbers();
});

client.on("close", () => {
	console.log("Connection closed");
	rl.close();
});

connectToServer();
