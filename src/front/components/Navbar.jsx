import React from "react";
import { Link, useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const Navbar = () => {
	const navigate = useNavigate();
	const { store, dispatch } = useGlobalReducer();

	const handleLogout = () => {
		dispatch({ type: 'logout' });
		navigate("/");
	};

	return (
		<nav className="navbar navbar-light bg-light">
			<div className="container">
				<Link to="/">
					<span className="navbar-brand mb-0 h1">Mi App</span>
				</Link>
				<div className="ml-auto">
					{store.auth && store.auth.isAuthenticated ? (
						<div className="d-flex align-items-center">
							{store.auth.user && (
								<span className="me-2">{store.auth.user.email}</span>
							)}
							<button className="btn btn-sm btn-outline-danger" onClick={handleLogout}>
								Logout
							</button>
						</div>
					) : (
						<div>
							<Link to="/login">
								<button className="btn btn-sm btn-outline-primary me-2">Login</button>
							</Link>
							<Link to="/signup">
								<button className="btn btn-sm btn-primary">Signup</button>
							</Link>
						</div>
					)}
				</div>
			</div>
		</nav>
	);
};