import FormBox from "@components/Form";
import Field from "@components/Form/Field";
import PropTypes from "prop-types";
import React from "react";

function LoginForm({ redirectUrl }) {
	return (
		<FormBox destination="/auth/login" redirectUrl={redirectUrl} description="Enter your details to Login" name="login">
			<Field
				name="userEmail"
				type="email"
				label="Email"
				placeholder="Email"
				error="Please enter a valid email"
				hint="should contain valid email"
				value="saurabh123@gmail.com"
				required
			/>
			<Field
				name="userPassword"
				type="password"
				label="Password"
				placeholder="Password"
				error="Please enter a valid Password"
				hint="should contain valid Password"
				value="saurabh"
				required
			/>
			<Field name="userSubmit" type="submit" label="Login" />
		</FormBox>
	);
}

LoginForm.defaultProps = {
	redirectUrl: ""
};

LoginForm.propTypes = {
	redirectUrl: PropTypes.string
};

export default LoginForm;
