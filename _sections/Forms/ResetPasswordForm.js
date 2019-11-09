import FormBox from "@components/Form";
import Field from "@components/Form/Field";
import PropTypes from "prop-types";
import React from "react";

function ResetPasswordForm({ redirectUrl }) {
	return (
		<FormBox
			destination="/auth/password/forgot"
			redirectUrl={redirectUrl}
			description="Enter your details to Login"
			name="resetPassword"
		>
			<Field
				name="userPassword"
				type="password"
				label="Password"
				placeholder="Password"
				error="Please enter a strong Password"
				hint="Enter your strongest bet"
				required
			/>
			<Field name="userSubmit" type="submit" label="Submit" />
		</FormBox>
	);
}

ResetPasswordForm.defaultProps = {
	redirectUrl: ""
};

ResetPasswordForm.propTypes = {
	redirectUrl: PropTypes.string
};

export default ResetPasswordForm;
