// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Callback from "./components/Callback";
import Projects from "./components/Projects";
import LatestProject from "./components/LatestProject/LatestProject";
import Header from "./components/Header/Header";
import BidBot from "./components/BidBot/BidBot";

const App = () => {
	const accessToken = localStorage.getItem("freelancer_access_token");

	return (
		<Router>
			<Header />
			<Routes>
				<Route path="/" element={accessToken ? <LatestProject /> : <Login />} />
				<Route path="/projects" element={<Projects />} />
				<Route path="/callback" element={<Callback />} />
				<Route path="/bidbot" element={<BidBot />} />
			</Routes>
		</Router>
	);
};

export default App;
