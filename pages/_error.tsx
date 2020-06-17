import User from "@customTypes/userType";
import Layout from "@sections/Layout";
import { redirectToLocation } from "@utils/auth";
import { Button } from "antd";
import React from "react";
import styled from "styled-components";
import Error from "next/error";

const ErrorWrapper = styled.div`
	min-height: calc(100vh - 60px);
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	> * + * {
		margin-top: 1rem;
	}
	> div {
		height: auto !important;
	}
`;

const routeParameters = {
	pathname: "/launchpad",
	url: "/launchpad",
};

class ErrorComponent extends React.Component<{ authVerification: Partial<User>; status: number }> {
	static getInitialProps({ res, err }) {
		let status = null;
		if (res) {
			const { statusCode } = res;
			status = statusCode;
		} else if (err) {
			const { statusCode } = err;
			status = statusCode;
		}
		return { status };
	}

	render() {
		const { status } = this.props;
		return (
			<Layout {...this.props}>
				<ErrorWrapper>
					<Error statusCode={status} />
					<Button type="primary" onClick={(): void => redirectToLocation(routeParameters)}>
						Go to Launchpad
					</Button>
				</ErrorWrapper>
			</Layout>
		);
	}
}

export default ErrorComponent;
