import { useEffect, useState } from "react";
import {
	BrowserRouter as Router,
	Redirect,
	Route,
	Switch,
} from "react-router-dom";
import "./styles/styles.css";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import { auth } from "./services/firebase.js";
import { ChatsProvider } from "./context/ChatsContext";

/**Higher order component for Private pages */
function PrivateRoute({ component: Component, authenticated, ...rest }) {
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

/**Higher order component for public pages */
function PublicRoute({ component: Component, authenticated, ...rest }) {
	return (
		<Route
			{...rest}
			render={(props) =>
				authenticated === false ? (
					<Component {...props} />
				) : (
					<Redirect to="/home" />
				)
			}
		/>
	);
}

/**main app.js **/
function App() {
	const [authenticated, setAuthenticated] = useState(false);

	useEffect(() => {
		auth().onAuthStateChanged((user) => {
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
				<ChatsProvider>
					<Switch>
						<PrivateRoute
							path="/home"
							component={Home}
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
					</Switch>
				</ChatsProvider>
			</Router>
		</div>
	);
}

export default App;
