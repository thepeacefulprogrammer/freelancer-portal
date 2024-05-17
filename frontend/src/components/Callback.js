// src/components/Callback.js
import React, { useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import queryString from "query-string";

const Callback = () => {
	const location = useLocation();
	const navigate = useNavigate();

	useEffect(() => {
		const fetchAccessToken = async (code) => {
			const CLIENT_ID = process.env.REACT_APP_FREELANCER_APP_ID;
			const CLIENT_SECRET = process.env.REACT_APP_FREELANCER_APP_SECRET;
			const REDIRECT_URI = process.env.REACT_APP_FREELANCER_REDIRECT_URI;

			console.log("Fetching access token with code:", code);

			try {
				const response = await axios.post(
					"http://localhost:8000/oauth/token",
					queryString.stringify({
						grant_type: "authorization_code",
						code,
						redirect_uri: REDIRECT_URI,
						client_id: CLIENT_ID,
						client_secret: CLIENT_SECRET,
					}),
					{
						headers: {
							"Content-Type": "application/x-www-form-urlencoded",
						},
					}
				);

				console.log("Received response:", response.data);

				const { access_token } = response.data;
				localStorage.setItem("freelancer_access_token", access_token);
				navigate("/"); // Redirect to your main app page
			} catch (error) {
				console.error("Error fetching access token", error);
			}
		};

		const { code } = queryString.parse(location.search);
		if (code) {
			fetchAccessToken(code);
		} else {
			console.log("No code found in the query parameters");
		}
	}, [location, navigate]);

	return (
		<div>
			<h1>Loading...</h1>
		</div>
	);
};

export default Callback;
