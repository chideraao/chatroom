import React, { useState } from "react";
import { Link } from "react-router-dom";
import { signInWithGoogle, signInWithGithub, signUp } from "../helpers/auth";

function Signup() {
	const [user, setUser] = useState({ email: "", password: "" });
	const [error, setError] = useState(null);

	const handleSubmit = (e) => {
		e.preventDefault();
		setError("");
		let email = user.email.toLowerCase().trim();
		signUp(email, user.password)
			.then(() => {
				setError(null);
				setUser({ email: "", password: "" });
			})
			.catch((err) => setError(err.message));
	};

	const handleChange = (e) => {
		const target = e.target;
		const value = target.type === "checkbox" ? target.checked : target.value;
		const name = target.name;

		setUser((prevState) => ({ ...prevState, [name]: value }));
	};

	const googleSignIn = (e) => {
		signInWithGoogle().catch((err) => {
			setError(err.message);
		});
	};

	const githubSignIn = (e) => {
		signInWithGithub().catch((err) => {
			setError(err.message);
		});
	};

	return (
		<div>
			<form onSubmit={handleSubmit} autoComplete="off">
				<h1>
					Sign Up to
					<Link to="/">DheraGram</Link>
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
				<p>Or</p>
				<button onClick={googleSignIn} type="button">
					Sign up with Google
				</button>
				<button onClick={githubSignIn} type="button">
					Sign up with Github
				</button>
			</form>
		</div>
	);
}
export default Signup;
