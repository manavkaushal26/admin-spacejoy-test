import Layout from "@sections/Layout";
import PropTypes from "prop-types";
import React from "react";

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
				<div className="container">
					<div className="grid">
						<div className="col-xs-12">
							<p>{status ? `An error ${status} occurred on server` : "An error occurred on client"}</p>
						</div>
					</div>
				</div>
			</Layout>
		);
	}
}

Error.propTypes = {
	status: PropTypes.number.isRequired
};

export default Error;
