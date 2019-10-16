import Layout from "@sections/Layout";
import { withAuthSync, withAuthVerification } from "@utils/auth";
import fetcher from "@utils/fetcher";
import IndexPageMeta from "@utils/meta";
import dynamic from "next/dynamic";
import Head from "next/head";
import PropTypes from "prop-types";
import React, { Fragment } from "react";

const Checkout = dynamic(() => import("@sections/Checkout"), { ssr: false });

const endPoint = "/form/user";

function checkout({ isServer, data, authVerification }) {
	return (
		<Layout isServer={isServer} authVerification={authVerification}>
			<Head>
				{IndexPageMeta}
				<title>Checkout</title>
			</Head>
			<div className="container">
				<div className="grid">
					<div className="col-xs-12">
						<h3>Your Preferences</h3>
						<div className="grid">
							{data &&
								data.formData.map(item => (
									<Fragment key={item.entry}>
										<div className="col-6">{item.question}</div>
										<div className="col-6">{item.answer}</div>
									</Fragment>
								))}
						</div>
					</div>
					<div className="col-xs-6">
						<Checkout />
					</div>
				</div>
			</div>
		</Layout>
	);
}

checkout.getInitialProps = async ctx => {
	const res = await fetcher({ ctx, endPoint, method: "GET" });
	if (res.statusCode <= 300) {
		if (res.status === "success") {
			const { data } = res;
			return { data };
		}
	}
	return {};
};

checkout.defaultProps = {
	data: {},
	authVerification: {
		name: "",
		email: ""
	}
};

checkout.propTypes = {
	isServer: PropTypes.bool.isRequired,
	authVerification: PropTypes.shape({
		name: PropTypes.string,
		email: PropTypes.string
	}),
	data: PropTypes.shape({
		formData: PropTypes.arrayOf(
			PropTypes.shape({
				key: PropTypes.string,
				value: PropTypes.string
			})
		),
		package: PropTypes.string,
		packageAmount: PropTypes.number
	})
};

export default withAuthVerification(withAuthSync(checkout));
