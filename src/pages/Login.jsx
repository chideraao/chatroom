import React, { useState } from "react";
import { Link } from "react-router-dom";
import { signIn, signInWithGithub, signInWithGoogle } from "../helpers/auth";
import styles from "../styles/login.module.css";

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
		<div className={styles.formBody}>
			<form autoComplete="off" onSubmit={handleSubmit}>
				<h1>Login</h1>
				<p>Fill in the form below to login to your account.</p>
				<div className={styles.emailInput}>
					<input
						name="email"
						type="text"
						onChange={handleChange}
						value={user.email}
						required
					/>
					<label htmlFor="email" className={styles.labelName}>
						<h1>boo</h1>
						<span className={styles.contentName}>Email</span>
					</label>
				</div>
				<div className={styles.passwordInput}>
					<input
						placeholder="Password"
						name="password"
						onChange={handleChange}
						value={user.password}
						type="password"
						required
					/>
					<label htmlFor="password" className={styles.labelName}>
						<h1>boo</h1>
						<span className={styles.contentName}>Password</span>
					</label>
				</div>
				<div>
					{error ? <p>{error}</p> : null}
					<button type="submit">Login</button>
				</div>
			</form>
			<div className="">
				<button onClick={googleSignIn} type="button">
					Sign up with Google
				</button>
				<button onClick={githubSignIn} type="button">
					Sign up with Github
				</button>
			</div>
			<div className="">
				<p>
					Don't have an account? <Link to="/signup">Sign up</Link>
				</p>
			</div>
		</div>
	);
}

export default Login;
