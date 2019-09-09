import FormBox from "@components/Form";
import Field from "@components/Form/Field";
import React from "react";

function SignupForm() {
	return (
		<FormBox destination="" description="Enter your details to signup">
			<Field name="userName" type="text" label="User Name" placeholder="User Name" inline />
			<Field name="userEmail" type="email" label="Email" placeholder="Email" inline required />
			<Field name="userSubmit" type="submit" label="Submit" />
		</FormBox>
	);
}

export default SignupForm;
