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

export const fetchUserProfile = async () => {
	const token = localStorage.getItem("freelancer_access_token");
	if (!token) {
		console.error("No OAuth token found in local storage");
		throw new Error("No OAuth token found in local storage");
	}

	try {
		console.log("Fetching user profile with token:", token);
		const response = await axios.get(`https://www.freelancer.com/api/users/0.1/self`, {
			headers: {
				"freelancer-oauth-v1": token,
			},
		});

		console.log("User profile response:", response.data);
		return response.data.result;
	} catch (error) {
		console.error(
			"Error fetching user profile",
			error.response ? error.response.data : error.message
		);
		throw error;
	}
};

export const placeBid = async (
	projectId,
	bidderId,
	amount,
	period,
	milestonePercentage,
	description = ""
) => {
	const token = localStorage.getItem("freelancer_access_token");

	try {
		const response = await axios.post(
			`${API_BASE_URL}/bids/`,
			{
				project_id: projectId,
				bidder_id: bidderId,
				amount: amount,
				period: period,
				milestone_percentage: milestonePercentage,
				description: description,
			},
			{
				headers: {
					"Content-Type": "application/json",
					"freelancer-oauth-v1": token,
				},
			}
		);

		return response.data;
	} catch (error) {
		console.error("Error placing bid", error.response ? error.response.data : error.message);
		throw error;
	}
};
