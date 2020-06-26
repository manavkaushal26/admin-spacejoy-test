import FormBox from "@components/Form";
import Field from "@components/Form/Field";
import PropTypes from "prop-types";
import React from "react";
import { Row, Col } from "antd";

function ForgotPasswordForm({ redirectUrl }) {
	return (
		<Row justify='center'>
			<Col xs={{ span: 18 }} md={{ span: 12 }} lg={{ span: 8 }}>
				<FormBox
					destination='/auth/password/forgot'
					redirectUrl={redirectUrl}
					description='Enter your email to send reset password link'
					name='forgotPassword'
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
					<Field name='userSubmit' type='submit' label='Submit' />
				</FormBox>
			</Col>
		</Row>
	);
}

ForgotPasswordForm.defaultProps = {
	redirectUrl: "",
};

ForgotPasswordForm.propTypes = {
	redirectUrl: PropTypes.string,
};

export default ForgotPasswordForm;
