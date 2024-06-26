import React, { useEffect, useState } from "react";
import { fetchProjects, fetchExchangeRate } from "../utils/api";
import "./Projects.css";

const Projects = () => {
	const [projects, setProjects] = useState([]);
	const [exchangeRate, setExchangeRate] = useState(null);

	useEffect(() => {
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

		const getProjects = async () => {
			try {
				let data = await fetchProjects();

				// remove projects that are older than 1 day
				const currentDate = new Date();
				const oneDayAgo = new Date(currentDate);
				oneDayAgo.setDate(currentDate.getDate() - 1);

				data = data.filter((project) => {
					const projectDate = new Date(project.submitdate * 1000);
					return projectDate > oneDayAgo;
				});

				setProjects(data);
			} catch (error) {
				console.error(
					"Error loading projects",
					error.response ? error.response.data : error.message
				);
			}
		};

		getExchangeRate();
		getProjects();
	}, []);

	const roundToTwoDecimalPlaces = (number) => {
		return parseFloat(number).toFixed(2);
	};

	const timeSincePosted = (timeSubmitted) => {
		const currentTime = new Date();
		const projectTime = new Date(timeSubmitted * 1000);
		const diff = currentTime - projectTime;

		if (diff < 60000) {
			return "less than a minute";
		}

		if (diff < 3600000) {
			return Math.floor(diff / 60000) + " minutes";
		}

		if (diff < 86400000) {
			return Math.floor(diff / 3600000) + " hours";
		}

		return Math.floor(diff / 86400000) + " days";
	};

	const handleOpenProjectInFreelancer = (projectId) => () => {
		const url = `https://www.freelancer.com/projects/${projectId}`;
		window.open(url, "_blank");
	};

	// Calculate value in CAD using exchangeRate object
	const getValueInCAD = (rate, currencyCode) => {
		if (currencyCode === "CAD") {
			return rate;
		}
		if (exchangeRate && exchangeRate[currencyCode]) {
			console.log(
				`Converting ${rate} ${currencyCode} to CAD using rate ${exchangeRate[currencyCode]}`
			);
			const rateInCAD = rate / exchangeRate[currencyCode];
			return rateInCAD;
		}
		console.error(`Exchange rate for ${currencyCode} not found`);
		return null;
	};

	return (
		<div>
			<h1>Projects</h1>
			<ul>
				{projects.map((project) => (
					<li key={project.id}>
						{project.title}
						<p style={{ whiteSpace: "pre-line" }}>{project.description}</p>
						<p>
							Budget: {roundToTwoDecimalPlaces(project.budget.minimum)} to{" "}
							{roundToTwoDecimalPlaces(project.budget.maximum)} {project.currency.code} or{" "}
							{exchangeRate
								? `${roundToTwoDecimalPlaces(
										getValueInCAD(project.budget.minimum, project.currency.code)
								  )} to ${roundToTwoDecimalPlaces(
										getValueInCAD(project.budget.maximum, project.currency.code)
								  )} CAD`
								: "Loading..."}
						</p>
						<p>
							Average Bid: {roundToTwoDecimalPlaces(project.bid_stats.bid_avg)}{" "}
							{project.currency.code} or{" "}
							{exchangeRate
								? `${roundToTwoDecimalPlaces(
										getValueInCAD(project.bid_stats.bid_avg, project.currency.code)
								  )} CAD`
								: "Loading..."}{" "}
							with {project.bid_stats.bid_count} bids
						</p>
						<p>Posted {timeSincePosted(project.time_submitted)} ago</p>
						<button onClick={handleOpenProjectInFreelancer(project.id)}>Open Project</button>
					</li>
				))}
			</ul>
		</div>
	);
};

export default Projects;
