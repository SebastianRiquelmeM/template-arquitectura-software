import net from "net";

console.log("Hello from backend");

const backendServer = net.createServer((socket) => {
	console.log("Frontend connected");

	socket.on("data", (data) => {
		const message = data.toString();
		console.log("Received from frontend:", message);

		// Analizar el mensaje recibido
		const length = parseInt(message.slice(0, 5));
		const service = message.slice(5, 10);
		const numbers = message.slice(10).split(" ");

		console.log("--------------------Backend Details--------------------");
		console.log("Message: ", message);
		console.log("Length: ", length);
		console.log("Service: ", service);
		console.log("Numbers: ", numbers);

		if (service === "sumar" && numbers.length === 2) {
			const num1 = parseInt(numbers[0]);
			const num2 = parseInt(numbers[1]);
			const result = num1 + num2;
			const response = `00022sumarOK${num1} + ${num2} = ${result}`;
			console.log("Response:", response);
			socket.write(response);
		} else {
			console.log("Response: 00010sumarNKError");
			socket.write("00010sumarNKError");
		}
	});

	socket.on("close", () => {
		console.log("Frontend disconnected");
	});
});

backendServer.listen(3000, () => {
	console.log("Backend server listening on port 3000");

	const backendClient = new net.Socket();
	backendClient.connect(5000, "bus", () => {
		console.log("Backend connected to bus");
		const initMessage = "00010sinitsumar";
		console.log("Sending init message:", initMessage);
		backendClient.write(initMessage);
	});

	backendClient.on("data", (data) => {
		const message = data.toString();
		console.log("Received message from bus:", message);

		// Analizar el mensaje recibido
		const length = parseInt(message.slice(0, 5));
		const service = message.slice(5, 10);
		const numbers = message.slice(10).split(" ");

		console.log("Processing message...");
		console.log("Service:", service);
		console.log("Numbers:", numbers);

		if (service === "sumar" && numbers.length === 2) {
			const num1 = parseInt(numbers[0]);
			const num2 = parseInt(numbers[1]);
			const result = num1 + num2;
			const response = `00022sumarOK${num1} + ${num2} = ${result}`;
			console.log("Sending response:", response);
			backendClient.write(response);
		} else {
			console.log("Invalid request");
			const response = "00010sumarNKError";
			console.log("Sending response:", response);
			backendClient.write(response);
		}
	});
});
