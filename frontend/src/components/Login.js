import React from "react";
import { getFreelancerAuthURL } from "../utils/auth";

const Login = () => {
	const handleLogin = () => {
		window.location.href = getFreelancerAuthURL();
	};

	return (
		<div>
			<h1>Freelancer Portal</h1>
			<button onClick={handleLogin}>Login with Freelancer</button>
		</div>
	);
};

export default Login;
