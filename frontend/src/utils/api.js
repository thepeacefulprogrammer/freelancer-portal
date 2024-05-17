// src/utils/api.js
import axios from "axios";

const API_BASE_URL = "https://www.freelancer.com/api/projects/0.1";

export const fetchExchangeRate = async () => {
	try {
		const response = await axios.get("http://localhost:8000/api/exchange-rate");

		return response.data.exchangeRate;
	} catch (error) {
		console.error("Error fetching exchange rate", error);
		return null;
	}
};

export const fetchProjects = async () => {
	const token = localStorage.getItem("freelancer_access_token");
	try {
		const response = await axios.get(`${API_BASE_URL}/projects/active`, {
			headers: {
				"freelancer-oauth-v1": token,
			},
			params: {
				query: "react OR website",
				project_types: "fixed",
				project_statuses: "open",
				full_description: "",
			},
		});

		const projects = response.data.result.projects;
		const filteredProjects = projects.filter(
			(project) =>
				!project.description.includes("Shopify") && !project.description.includes("Laravel")
		);

		return filteredProjects;
	} catch (error) {
		console.error("Error fetching projects", error.response ? error.response.data : error.message);
		throw error;
	}
};
