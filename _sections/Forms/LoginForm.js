import FormBox from "@components/Form";
import Field from "@components/Form/Field";
import React from "react";

function LoginForm() {
	return (
		<FormBox destination="/auth/login" description="Enter your details to signup">
			<Field
				name="userEmail"
				type="email"
				label="Email"
				placeholder="Email"
				error="Please enter a valid email"
				hint="should contain valid email"
				required
			/>
			<Field
				name="userPassword"
				type="password"
				label="Password"
				placeholder="Password"
				error="Please enter a valid Password"
				hint="should contain valid Password"
				required
			/>
			<Field name="userSubmit" type="submit" label="Submit" />
		</FormBox>
	);
}

export default LoginForm;
