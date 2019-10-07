import FormBox from "@components/Form";
import Field from "@components/Form/Field";
import React from "react";

function SignupForm() {
	return (
		<FormBox destination="/auth/registeruser" description="Enter your details to signup" name="signup">
			<Field
				name="userName"
				type="text"
				label="Name"
				placeholder="Name"
				error="Please enter your name"
				hint="Should contain valid text"
			/>
			<Field
				name="userEmail"
				type="email"
				label="Email"
				placeholder="Email"
				error="Please enter your email"
				hint="Should contain valid email"
				required
			/>
			<Field
				name="userPassword"
				type="password"
				label="Password"
				placeholder="Password"
				error="Please enter a strong Password"
				hint="Should contain valid password"
				required
			/>
			<Field name="userSubmit" type="submit" label="Signup" />
		</FormBox>
	);
}

export default SignupForm;
