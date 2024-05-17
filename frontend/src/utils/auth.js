const CLIENT_ID = process.env.REACT_APP_FREELANCER_APP_ID;
const REDIRECT_URI = process.env.REACT_APP_FREELANCER_REDIRECT_URI;
const FREELANCER_AUTH_URL = `https://accounts.freelancer.com/oauth/authorize`;

export const getFreelancerAuthURL = () => {
	const params = new URLSearchParams({
		client_id: CLIENT_ID,
		redirect_uri: REDIRECT_URI,
		response_type: "code",
		scope: "profile email", // Add necessary scopes
	});

	return `${FREELANCER_AUTH_URL}?${params.toString()}`;
};
