const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
const cors = require("cors");
const querystring = require("querystring");
const exchangeRateRoute = require("./routes/exchangeRateRoute");

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

app.use("/api", exchangeRateRoute);

app.post("/oauth/token", async (req, res) => {
	const { code, redirect_uri, client_id, client_secret } = req.body;

	console.log("Received request with the following parameters:");
	console.log(`Code: ${code}`);
	console.log(`Redirect URI: ${redirect_uri}`);
	console.log(`Client ID: ${client_id}`);
	console.log(`Client Secret: ${client_secret}`);

	const payload = querystring.stringify({
		grant_type: "authorization_code", // Ensure the correct grant type is set
		code,
		redirect_uri,
		client_id,
		client_secret,
	});

	console.log("Sending payload to Freelancer API:", payload);

	try {
		const response = await axios.post("https://accounts.freelancer.com/oauth/token", payload, {
			headers: {
				"Content-Type": "application/x-www-form-urlencoded", // Ensure correct content type
			},
		});

		console.log("Response from Freelancer API:", response.data);

		res.json(response.data);
	} catch (error) {
		console.error("Error fetching access token from Freelancer:", error.response.data);
		res.status(500).send(error.response.data);
	}
});

const PORT = 8000;
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
