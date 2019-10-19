import FormBox from "@components/Form";
import Field from "@components/Form/Field";
import { company } from "@utils/config";
import PropTypes from "prop-types";
import React from "react";

function SignupForm({ redirectUrl }) {
	return (
		<FormBox
			destination="/auth/register/customer"
			redirectUrl={redirectUrl}
			description="Enter your details to signup"
			name="signup"
		>
			<Field
				name="userName"
				type="text"
				label="Name"
				placeholder="Name"
				error="Please enter your name"
				hint="How do we address you?"
				required
			/>
			<Field
				name="userEmail"
				type="email"
				label="Email"
				placeholder="Email"
				error="Please enter your email"
				hint="Where should we write to you?"
				required
			/>
			<Field
				name="userMobile"
				type="tel"
				label="Mobile"
				placeholder="Mobile"
				error="Please enter your mobile number"
				hint="Our designer will get in touch"
			/>
			<Field
				name="userPassword"
				type="password"
				label="Password"
				placeholder="Password"
				error="Please enter a strong Password"
				hint="Enter your strongest bet"
				required
			/>
			<Field
				name="userCommutePermissionGranted"
				type="checkbox"
				label={`By signing up to a free trial of ${company.product}, you agree to our
										Terms and privacy policy`}
				error="Please select checkbox"
				required
			/>
			<Field name="userSubmit" type="submit" label="Signup" />
		</FormBox>
	);
}

SignupForm.defaultProps = {
	redirectUrl: ""
};

SignupForm.propTypes = {
	redirectUrl: PropTypes.string
};

export default SignupForm;
