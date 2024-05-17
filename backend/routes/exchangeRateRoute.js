// exchangeRateRoute.js
const express = require("express");
const { getExchangeRate } = require("../exchangeRateService");

const router = express.Router();

router.get("/exchange-rate", async (req, res) => {
	try {
		const exchangeRate = await getExchangeRate();
		res.json({ exchangeRate });
	} catch (error) {
		res.status(500).json({ error: "Error fetching exchange rate" });
	}
});

module.exports = router;
