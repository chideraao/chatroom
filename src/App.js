import { useEffect, useState } from "react";
import {
	BrowserRouter as Router,
	Redirect,
	Route,
	Switch,
} from "react-router-dom";
import "./styles/styles.css";
import Chat from "./pages/Chat.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import { auth } from "./services/firebase.js";
import ChatRoom from "./pages/ChatRoom";

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
				<Switch>
					<PrivateRoute
						path="/home"
						component={Home}
						authenticated={authenticated}
					/>
					<PrivateRoute
						path="/chatroom"
						component={ChatRoom}
						authenticated={authenticated}
					/>
					<PrivateRoute
						path="/chat"
						component={Chat}
						authenticated={authenticated}
					/>
					<PublicRoute
						path="/"
						component={Login}
						authenticated={authenticated}
					/>
					<PublicRoute
						path="/signup"
						component={Signup}
						authenticated={authenticated}
					/>
				</Switch>
			</Router>
		</div>
	);
}

export default App;
