import FormBox from "@components/Form";
import Field from "@components/Form/Field";
import PropTypes from "prop-types";
import React from "react";
import { Row, Col } from "antd";

function LoginForm({ redirectUrl }) {
	return (
		<Row justify='center'>
			<Col xs={{ span: 18 }} md={{ span: 12 }} lg={{ span: 8 }}>
				<FormBox
					destination='/auth/login'
					redirectUrl={redirectUrl}
					description='Enter your details to Login'
					name='login'
				>
					<Field
						name='userEmail'
						type='email'
						label='Email'
						placeholder='Email'
						error='Please enter a valid email'
						hint='should contain valid email'
						required
					/>
					<Field
						name='userPassword'
						type='password'
						label='Password'
						placeholder='Password'
						error='Please enter a valid Password'
						hint='should contain valid Password'
						required
					/>
					<Field name='userSubmit' type='submit' label='Login' />
				</FormBox>
			</Col>
		</Row>
	);
}

LoginForm.defaultProps = {
	redirectUrl: "",
};

LoginForm.propTypes = {
	redirectUrl: PropTypes.string,
};

export default LoginForm;
