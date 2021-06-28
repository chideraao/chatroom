import React, { useState } from "react";
import { Link } from "react-router-dom";
import { signIn, signInWithGithub, signInWithGoogle } from "../helpers/auth";

function Login() {
	const [user, setUser] = useState({ email: "", password: "" });
	const [error, setError] = useState(null);

	const handleSubmit = (e) => {
		e.preventDefault();
		let email = user.email.toLowerCase().trim();
		signIn(email, user.password)
			.then(() => {
				setUser({ email: "", password: "" });
				setError(null);
			})
			.catch((err) => {
				setError(err.message);
			});
	};

	const handleChange = (e) => {
		setUser((prevState) => ({ ...prevState, [e.target.name]: e.target.value }));
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
			<form autoComplete="off" onSubmit={handleSubmit}>
				<h1>
					Login to <Link to="/">DheraGram</Link>
				</h1>
				<p>Fill in the form below to login to your account.</p>
				<div>
					<input
						placeholder="Email"
						name="email"
						type="email"
						onChange={handleChange}
						value={user.email}
					/>
				</div>
				<div>
					<input
						placeholder="Password"
						name="password"
						onChange={handleChange}
						value={user.password}
						type="password"
					/>
				</div>
				<div>
					{error ? <p>{error}</p> : null}
					<button type="submit">Login</button>
				</div>
				<hr />
				<p>
					Don't have an account? <Link to="/signup">Sign up</Link>
				</p>
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

export default Login;
