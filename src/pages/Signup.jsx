import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  signInWithGoogle,
  signInWithGithub,
  signUp,
  credResponse,
} from "../helpers/auth";
import { ReactComponent as Password } from "../assets/logo/lock_black_24dp.svg";
import { ReactComponent as Person } from "../assets/logo/person_outline_black_24dp.svg";
import { ReactComponent as Google } from "../assets/logo/google_brands.svg";
import { ReactComponent as Github } from "../assets/logo/github_brands.svg";
import styles from "../styles/login.module.css";

const google = window.google;

const onOneTapSignIn = (credential) => {
  credResponse(credential);
};

function Signup() {
  const [user, setUser] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);

  useEffect(() => {
    google?.accounts.id.initialize({
      client_id: process.env.REACT_APP_CLIENT_ID,
      callback: onOneTapSignIn,
      context: "use",
    });
    google?.accounts.id.prompt((notification) => {
      console.log(notification);
    });
    return () => {
      google?.accounts.id.cancel();
    };
  });

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
    <div className={styles.formBody}>
      <div className={styles.card}>
        <form
          autoComplete="off"
          className={styles.form}
          onSubmit={handleSubmit}
        >
          <h1>Sign Up</h1>
          <p>Fill the form below to sign up.</p>
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
            <button
              title="Sign-up"
              aria-label="Signup to DheraGram"
              type="submit"
            >
              Sign Up
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
          <button
            aria-label="Sign-in with Github"
            onClick={githubSignIn}
            type="button"
          >
            <Github />
          </button>
        </div>
        <div className={styles.option}>
          {" "}
          <p>
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
export default Signup;
