import FormBox from "@components/Form";
import Field from "@components/Form/Field";
import PropTypes from "prop-types";
import React from "react";

function ForgotPasswordForm({ redirectUrl }) {
	return (
		<FormBox
			destination="/auth/password/forgot"
			redirectUrl={redirectUrl}
			description="Enter your details to Login"
			name="forgotPassword"
		>
			<Field
				name="userEmail"
				type="email"
				label="Email"
				placeholder="Email"
				error="Please enter a valid email"
				hint="should contain valid email"
				value=""
				required
			/>
			<Field name="userSubmit" type="submit" label="Submit" />
		</FormBox>
	);
}

ForgotPasswordForm.defaultProps = {
	redirectUrl: ""
};

ForgotPasswordForm.propTypes = {
	redirectUrl: PropTypes.string
};

export default ForgotPasswordForm;
