import DesignMySpaceForm from "@sections/Forms/DesignMySpaceForm";
import Question1 from "@sections/Forms/quiz/Question1";
import Question2 from "@sections/Forms/quiz/Question2";
import QuizStart from "@sections/Forms/quiz/QuizStart";
import Layout from "@sections/Layout";
import { withAuthVerification } from "@utils/auth";
import { company } from "@utils/config";
import IndexPageMeta from "@utils/meta";
import Head from "next/head";
import PropTypes from "prop-types";
import React, { PureComponent } from "react";

class designMySpace extends PureComponent {
	render() {
		const { plan, quiz, isServer, authVerification } = this.props;
		return (
			<Layout isServer={isServer} authVerification={authVerification}>
				<Head>
					{IndexPageMeta}
					<title>Design My Space | {company.product}</title>
				</Head>

				{!quiz && (
					<div className="container">
						<div className="grid">
							<div className="col-xs-12 col-sm-6 col-md-5">
								<h3>Submit A Design Request</h3>
								<DesignMySpaceForm plan={plan} name={authVerification.name} email={authVerification.email} />
							</div>
						</div>
					</div>
				)}
				{quiz === "start" && <QuizStart />}
				{quiz === "1" && <Question1 />}
				{quiz === "2" && <Question2 />}
				{quiz === "3" && <p>Quiz 3</p>}
			</Layout>
		);
	}
}

designMySpace.getInitialProps = async ({ query: { plan, quiz } }) => {
	return { plan, quiz };
};

designMySpace.defaultProps = {
	plan: "",
	quiz: "",
	authVerification: {
		name: "",
		email: ""
	}
};

designMySpace.propTypes = {
	isServer: PropTypes.bool.isRequired,
	authVerification: PropTypes.shape({
		name: PropTypes.string,
		email: PropTypes.string
	}),
	plan: PropTypes.string,
	quiz: PropTypes.string
};

export default withAuthVerification(designMySpace);
