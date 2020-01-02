import Image from "@components/Image";
import User from "@customTypes/userType";
import Layout from "@sections/Layout";
import { redirectToLocation } from "@utils/auth";
import { Button, Typography } from "antd";
import React from "react";
import styled from "styled-components";

const { Text } = Typography;

const ErrorWrapper = styled.div`
	min-height: calc(100vh - 60px);
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	> * + * {
		margin-top: 1rem;
	}
`;

const ErrorText = styled(Text)`
	position: relative;
	text-align: center;
	> * + * {
		margin-top: 1rem;
	}
`;

const errorImage =
	process.env.NODE_ENV === "production"
		? "q_80/v1573097106/shared/404_btqimw.svg"
		: "q_80/v1576132598/shared/404_btqimw.svg";

const routeParameters = {
	pathname: "/dashboard",
	url: "/dashboard"
};

class Error extends React.Component<{ authVerification: Partial<User>; status: number }> {
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
					<Image
						height="250px"
						src={errorImage}
						alt={status ? `An error ${status} occurred on server` : "An error occurred on client"}
					/>
					<ErrorText>{status ? `An error ${status} occurred on server` : "An error occurred on client"}</ErrorText>
					<Button type="primary" onClick={redirectToLocation.bind(null, routeParameters)}>
						Go to Dashboard
					</Button>
				</ErrorWrapper>
			</Layout>
		);
	}
}

export default Error;
