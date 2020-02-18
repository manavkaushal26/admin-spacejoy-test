import FormBox from "@components/Form";
import Field from "@components/Form/Field";
import PropTypes from "prop-types";
import React from "react";
import { Row, Col } from "antd";

function ResetPasswordForm({ redirectUrl, token }) {
	return (
		<Row type="flex" justify="center">
			<Col xs={{ span: 18 }} md={{ span: 12 }} lg={{ span: 8 }}>
				<FormBox
					destination="/auth/password/reset"
					redirectUrl={redirectUrl}
					description="Enter your details to Login"
					name="resetPassword"
				>
					<Field name="resetToken" type="hidden" label="" placeholder="" error="" hint="" value={token} required />
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
			</Col>
		</Row>
	);
}

ResetPasswordForm.defaultProps = {
	redirectUrl: "",
	token: "",
};

ResetPasswordForm.propTypes = {
	redirectUrl: PropTypes.string,
	token: PropTypes.string,
};

export default ResetPasswordForm;
