// exchangeRateService.js
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");
const axios = require("axios");

dotenv.config();

const FIXER_API_KEY = process.env.FIXER_API_KEY;
const EXCHANGE_RATE_FILE = path.join(__dirname, "exchangeRate.json");

const fetchExchangeRate = async () => {
	try {
		const response = await axios.get(`https://api.apilayer.com/fixer/latest`, {
			headers: {
				apiKey: FIXER_API_KEY,
			},
			params: {
				base: "CAD",
			},
		});
		console.log(response.data);

		const exchangeRate = response.data.rates;
		fs.writeFileSync(EXCHANGE_RATE_FILE, JSON.stringify({ exchangeRate, timestamp: Date.now() }));
		return exchangeRate;
	} catch (error) {
		console.error("Error fetching exchange rate:", error);
		throw error;
	}
};

const getExchangeRate = async () => {
	if (fs.existsSync(EXCHANGE_RATE_FILE)) {
		const data = fs.readFileSync(EXCHANGE_RATE_FILE, "utf-8");
		const { exchangeRate, timestamp } = JSON.parse(data);

		const oneDay = 24 * 60 * 60 * 1000;
		if (Date.now() - timestamp < oneDay) {
			return exchangeRate;
		}
	}
	return fetchExchangeRate();
};

module.exports = {
	getExchangeRate,
	fetchExchangeRate,
};
