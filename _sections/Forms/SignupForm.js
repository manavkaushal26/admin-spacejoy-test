import FormBox from "@components/Form";
import Field from "@components/Form/Field";
import React from "react";

function SignupForm() {
	return (
		<FormBox destination="" description="Enter your details to signup">
			<Field name="userName" type="text" label="Username" placeholder="Username" />
			<Field name="userEmail" type="email" label="Email" placeholder="Email" required />
			<Field name="userSubmit" type="submit" label="Submit" />
		</FormBox>
	);
}

export default SignupForm;
