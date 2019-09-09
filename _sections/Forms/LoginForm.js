import Button from "@components/Button";
import { login } from "@utils/auth";
import fetch from "isomorphic-unfetch";
import React, { useState } from "react";

function LoginForm() {
	const [userData, setUserData] = useState({ email: "", password: "", error: "" });

	async function handleSubmit(event) {
		event.preventDefault();
		setUserData(Object.assign({}, userData, { error: "" }));

		const username = "saurabhdsachan";
		const apiUrl = `https://api.github.com/users/${username}`;

		try {
			const response = await fetch(apiUrl, {
				method: "GET"
			});
			if (response.status === 200) {
				const { token } = await response.json();
				await login({ token });
			} else {
				console.log("Login failed.");
				// https://github.com/developit/unfetch#caveats
				const error = new Error(response.statusText);
				error.response = response;
				throw error;
			}
		} catch (error) {
			console.error("You have an error in your code or there are Network issues.", error);
			const { response } = error;
			setUserData(
				Object.assign({}, userData, {
					error: response ? response.statusText : error.message
				})
			);
		}
	}

	return (
		<div className="login">
			<form onSubmit={handleSubmit}>
				<label htmlFor="email">
					Email
					<input
						type="email"
						id="email"
						name="email"
						value={userData.email}
						onChange={event => setUserData(Object.assign({}, userData, { email: event.target.value }))}
					/>
				</label>
				<label htmlFor="password">
					Password
					<input
						type="password"
						id="password"
						name="password"
						value={userData.password}
						onChange={event => setUserData(Object.assign({}, userData, { password: event.target.value }))}
					/>
				</label>
				<Button type="submit">Login</Button>
				{userData.error && <p className="error">Error: {userData.error}</p>}
			</form>
		</div>
	);
}

export default LoginForm;
