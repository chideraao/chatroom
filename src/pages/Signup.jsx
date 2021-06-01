import React, { useState } from "react";
import { Link } from "react-router-dom";

function Signup() {
	const [user, setUser] = useState({ email: "", password: "" });
	const [error, setError] = useState("");

	const handleSubmit = (e) => {
		e.preventDefault();
	};

	const handleChange = (e) => {
		const target = e.target;
		const value = target.value;
		const name = target.name;
		setUser((prevState) => ({ ...prevState, [name]: value }));
	};

	return (
		<div>
			<form onSubmit={handleSubmit}>
				<h1>
					Sign Up to
					<Link to="/">Chatroom</Link>
				</h1>
				<p>Fill in the form below to create an account.</p>
				<div>
					<input
						placeholder="Email"
						name="email"
						type="email"
						onChange={handleChange}
						value={user.email}
					></input>
				</div>
				<div>
					<input
						placeholder="Password"
						name="password"
						onChange={handleChange}
						value={user.password}
						type="password"
					></input>
				</div>
				<div>
					{error ? <p>{error}</p> : null}
					<button type="submit">Sign up</button>
				</div>
				<hr></hr>
				<p>
					Already have an account? <Link to="/login">Login</Link>
				</p>
			</form>
		</div>
	);
}
export default Signup;
