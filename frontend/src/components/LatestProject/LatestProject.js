import React, { useEffect, useState, useRef } from "react";
import { fetchProjects, fetchExchangeRate } from "../../utils/api";
import "./LatestProject.css";

const LatestProject = () => {
	const [project, setProject] = useState(null);
	const [started, setStarted] = useState(false);
	const [exchangeRate, setExchangeRate] = useState(null);
	const previousProjectId = useRef(null);
	const notificationSound = useRef(new Audio("/audio/notification.mp3"));

	const getProjects = async () => {
		try {
			const data = await fetchProjects();
			console.log("Projects data:", data);

			if (data && data.length > 0) {
				const newProject = data[0];

				if (previousProjectId.current !== newProject.id) {
					if (previousProjectId.current !== null) {
						notificationSound.current.play();
					}
					setProject(newProject);
					previousProjectId.current = newProject.id;
				} else {
					setProject(newProject);
				}

				// Fetch exchange rate from backend
				const exchangeData = await fetchExchangeRate();
				console.log("Exchange rate data:", exchangeData);

				if (exchangeData && exchangeData[newProject.currency.code]) {
					setExchangeRate(exchangeData[newProject.currency.code]);
				} else {
					console.error("Exchange rate for currency not found");
				}
			}
		} catch (error) {
			console.error("Error loading projects", error.response ? error.response.data : error.message);
		}
	};

	useEffect(() => {
		let interval;
		if (started) {
			getProjects();
			interval = setInterval(() => {
				getProjects();
			}, 30000); // 30000 milliseconds = 30 seconds
		}
		return () => clearInterval(interval); // Clear the interval on component unmount
	}, [started]);

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

	if (!started) {
		return <button onClick={() => setStarted(true)}>Start Tracking Projects</button>;
	}

	if (!project) {
		return <div>Loading...</div>;
	}

	const handleOpenProjectInFreelancer = (projectId) => () => {
		const url = `https://www.freelancer.com/projects/${projectId}`;
		window.open(url, "_blank");
	};

	const convertToCAD = (amount) => {
		return exchangeRate ? roundToTwoDecimalPlaces(amount / exchangeRate) : null;
	};

	return (
		<div>
			<ul>
				<li key={project.id}>
					<h2>{project.title}</h2>
					<p style={{ whiteSpace: "pre-line" }}>{project.description}</p>
					<p>
						Budget: {roundToTwoDecimalPlaces(project.budget.minimum)} to{" "}
						{roundToTwoDecimalPlaces(project.budget.maximum)} {project.currency.code}{" "}
						{exchangeRate && (
							<>
								(Approx. {convertToCAD(project.budget.minimum)} to{" "}
								{convertToCAD(project.budget.maximum)} CAD)
							</>
						)}
					</p>
					<p>
						Average Bid: {roundToTwoDecimalPlaces(project.bid_stats.bid_avg)}{" "}
						{project.currency.code}{" "}
						{exchangeRate && <>(Approx. {convertToCAD(project.bid_stats.bid_avg)} CAD)</>} with{" "}
						{project.bid_stats.bid_count} bids
					</p>
					<p>Posted {timeSincePosted(project.time_submitted)} ago</p>
					<button onClick={handleOpenProjectInFreelancer(project.id)}>
						Open Project in Freelancer
					</button>
				</li>
			</ul>
		</div>
	);
};

export default LatestProject;
