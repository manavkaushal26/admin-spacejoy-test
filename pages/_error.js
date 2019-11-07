import Image from "@components/Image";
import Layout from "@sections/Layout";
import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";

const ErrorWrapper = styled.div`
	min-height: 70vh;
	display: flex;
	align-items: center;
`;

class Error extends React.Component {
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
			<Layout>
				<ErrorWrapper>
					<div className="container">
						<div className="grid">
							<div className="col-xs-12 text-center">
								<Image
									height="250px"
									src="https://res.cloudinary.com/spacejoy/image/upload/v1573097106/shared/404_btqimw.svg"
									alt={status ? `An error ${status} occurred on server` : "An error occurred on client"}
								/>
								<p>{status ? `An error ${status} occurred on server` : "An error occurred on client"}</p>
							</div>
						</div>
					</div>
				</ErrorWrapper>
			</Layout>
		);
	}
}

Error.propTypes = {
	status: PropTypes.number.isRequired
};

export default Error;
