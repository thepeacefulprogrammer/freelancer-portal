import React, { useState, useEffect, useRef } from "react";
import { fetchProjects, placeBid, fetchExchangeRate } from "../../utils/api";
import "./BidBot.css";

const BidBot = () => {
	const [bidding, setBidding] = useState(false);
	const [projects, setProjects] = useState([]);
	const [bidQueue, setBidQueue] = useState([]);
	const [exchangeRate, setExchangeRate] = useState(null);
	const bidderId = "peacefulprogrammer"; // Replace this with your actual bidder ID
	const lowestBidAmount = 150;
	const bidOffsetFactor = 0.9;
	const bidIntervalRef = useRef(null);

	useEffect(() => {
		const getProjects = async () => {
			try {
				const data = await fetchProjects();
				console.log("Projects loaded:", data);
				setProjects(data);
				setBidQueue(data); // Initialize the bid queue with the fetched projects
			} catch (error) {
				console.error(
					"Error loading projects",
					error.response ? error.response.data : error.message
				);
			}
		};

		const getExchangeRate = async () => {
			try {
				const data = await fetchExchangeRate();
				setExchangeRate(data);
				console.log("Exchange rate loaded", data);
			} catch (error) {
				console.error(
					"Error loading exchange rate",
					error.response ? error.response.data : error.message
				);
			}
		};

		getProjects();
		getExchangeRate();
	}, []);

	const getValueInCAD = (rate, currencyCode) => {
		if (currencyCode === "CAD") {
			return rate;
		}
		if (exchangeRate && exchangeRate[currencyCode]) {
			const rateInCAD = rate / exchangeRate[currencyCode];
			return rateInCAD;
		}
		console.error(`Exchange rate for ${currencyCode} not found`);
		return null;
	};

	const determineAmount = (project) => {
		const maxBudget = getValueInCAD(project.budget.maximum, project.currency.code);
		const avgBid = getValueInCAD(project.bid_stats.bid_avg, project.currency.code);

		let myBid = avgBid * bidOffsetFactor;

		if (myBid < lowestBidAmount) {
			myBid = lowestBidAmount;
		}

		if (myBid > maxBudget) {
			myBid = maxBudget;
		}

		return myBid.toFixed(0);
	};

	const determinePeriod = (project) => {
		return 7; // Example fixed period
	};

	const determineMilestonePercentage = (project) => {
		return 100; // Example fixed milestone percentage
	};

	const determineDescription = (project) => {
		return "This is my proposal description."; // Example description
	};

	const processBidQueue = async () => {
		if (bidQueue.length > 0) {
			const project = bidQueue.shift();
			setBidQueue(bidQueue); // Update the bid queue

			const maxBudgetInCAD = getValueInCAD(project.budget.maximum, project.currency.code);
			if (maxBudgetInCAD < lowestBidAmount) {
				return;
			}

			// Determine the bid values dynamically
			const amount = determineAmount(project);
			const period = determinePeriod(project);
			const milestonePercentage = determineMilestonePercentage(project);
			const description = determineDescription(project);

			// Place a bid for each project that matches your criteria
			try {
				// const response = await placeBid(
				// 	project.id,
				// 	bidderId,
				// 	amount,
				// 	period,
				// 	milestonePercentage,
				// 	description
				// );
				// console.log("Bid placed successfully:", response);
				console.log("Project: ", project);
				console.log(
					"Bid placed successfully:",
					project.id,
					bidderId,
					amount,
					period,
					milestonePercentage,
					description
				);
			} catch (error) {
				console.error("Error placing bid:", error);
			}
		}
	};

	useEffect(() => {
		if (bidding) {
			console.log("Starting bidding...");

			bidIntervalRef.current = setInterval(() => {
				processBidQueue();
			}, 5000); // Process one bid per five seconds

			return () => clearInterval(bidIntervalRef.current);
		} else {
			console.log("Stopping bidding...");
			clearInterval(bidIntervalRef.current);
		}
	}, [bidding, bidQueue]);

	return (
		<div className="bid-bot-container">
			<h1>BidBot</h1>
			{!bidding && <button onClick={() => setBidding(true)}>Start bidding!</button>}
			{bidding && <button onClick={() => setBidding(false)}>Stop bidding!</button>}
		</div>
	);
};

export default BidBot;
