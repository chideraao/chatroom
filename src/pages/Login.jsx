import React, { useState } from "react";
import { Link } from "react-router-dom";
import { signIn, signInWithGithub, signInWithGoogle } from "../helpers/auth";
import { ReactComponent as Password } from "../assets/logo/lock_black_24dp.svg";
import { ReactComponent as Person } from "../assets/logo/person_outline_black_24dp.svg";
import { ReactComponent as Google } from "../assets/logo/google_brands.svg";
import { ReactComponent as Github } from "../assets/logo/github_brands.svg";
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
      <div className={styles.card}>
        <form
          autoComplete="off"
          className={styles.form}
          onSubmit={handleSubmit}
        >
          <h1>Sign In</h1>
          <p>Fill in the form below to sign in to your account.</p>
          <div className={styles.emailInput}>
            <input
              name="email"
              type="text"
              onChange={handleChange}
              value={user.email}
              required
              autoComplete="true"
            />
            <label htmlFor="email" className={styles.labelName}>
              <Person />
              <span className={styles.contentName}>Email</span>
            </label>
          </div>
          <div className={styles.passwordInput}>
            <input
              name="password"
              onChange={handleChange}
              value={user.password}
              type="password"
              required
              autoComplete="true"
            />
            <label htmlFor="password" className={styles.labelName}>
              <Password />
              <span className={styles.contentName}>Password</span>
            </label>
          </div>
          <div className={styles.bttn}>
            {error ? <p className={styles.loginError}>{error}</p> : null}
            <button title="Login" aria-label="Login to DheraGram" type="submit">
              Login
            </button>
          </div>
        </form>
        <div className={styles.flex}>
          <div className={styles.rule}></div>
          <p>or</p>
          <div className={styles.rule}></div>
        </div>
        <div className={styles.svgContainer}>
          <button
            aria-label="Sign-in with Google"
            onClick={googleSignIn}
            type="button"
          >
            <Google />
          </button>
          <label htmlFor="submit">
            <button
              aria-label="Sign-in with Github"
              onClick={githubSignIn}
              type="button"
            >
              <Github />
            </button>
          </label>
        </div>
        <div className={styles.option}>
          <p>
            Don't have an account? <Link to="/signup">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
