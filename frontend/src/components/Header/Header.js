import React from "react";
import "./Header.css";
import { Link } from "react-router-dom";

const Header = () => {
	return (
		<header className="header">
			<nav>
				<ul>
					<li>
						<Link to="/">Home</Link>
					</li>
					<li>
						<Link to="/projects">Projects</Link>
					</li>
					<li>
						<Link to="/bidbot">BidBot</Link>
					</li>
				</ul>
			</nav>
		</header>
	);
};

export default Header;
