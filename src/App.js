import { useEffect, useState } from "react";
import { BrowserRouter as Router, Redirect, Route } from "react-router-dom";
import Chat from "./pages/Chat.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import { auth } from "./services/firebase.js";

function PrivateRoute({ component: Component, authenticated, ...rest }) {
	console.log();
	return (
		<Route
			{...rest}
			render={(props) =>
				authenticated === true ? (
					<Component {...props} />
				) : (
					<Redirect
						to={{ pathname: "/login", state: { from: props.location } }}
					/>
				)
			}
		/>
	);
}

function PublicRoute({ component: Component, authenticated, ...rest }) {
	return (
		<Route
			{...rest}
			render={(props) =>
				authenticated === false ? (
					<Component {...props} />
				) : (
					<Redirect to="/chat" />
				)
			}
		/>
	);
}

function App() {
	const [authenticated, setAuthenticated] = useState(false);

	useEffect(() => {
		auth.onAuthStateChanged((user) => {
			if (user) {
				setAuthenticated(true);
			} else {
				setAuthenticated(false);
			}
		});
		return () => {};
	}, []);

	return (
		<div className="App">
			<Router>
				<Route path="/home" component={Home} exact />
				<PrivateRoute
					path="/chat"
					component={Chat}
					authenticated={authenticated}
				/>
				<PublicRoute
					path="/login"
					component={Login}
					authenticated={authenticated}
				/>
				<PublicRoute
					path="/signup"
					component={Signup}
					authenticated={authenticated}
				/>
			</Router>
		</div>
	);
}

export default App;
