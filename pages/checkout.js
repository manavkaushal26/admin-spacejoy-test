import Layout from "@sections/Layout";
import { withAuthSync, withAuthVerification } from "@utils/auth";
import fetcher from "@utils/fetcher";
import IndexPageMeta from "@utils/meta";
import dynamic from "next/dynamic";
import Head from "next/head";
import PropTypes from "prop-types";
import React, { Fragment } from "react";

const Checkout = dynamic(() => import("@sections/Checkout"), { ssr: false });

const endPoint = "/forms-user?source=designmyspace";

function checkout({ isServer, data, authVerification }) {
	return (
		<Layout isServer={isServer} authVerification={authVerification}>
			<Head>
				{IndexPageMeta}
				<title>Checkout</title>
			</Head>
			<div className="container">
				<div className="grid">
					<div className="col-12">
						<h3>Your Preferences</h3>
						<div className="grid">
							{data &&
								data.form &&
								data.form.formData.map(item => (
									<Fragment key={item.key}>
										<div className="col-6">{item.key}</div>
										<div className="col-6">{item.value}</div>
									</Fragment>
								))}
						</div>
					</div>
					<div className="col-6">
						<Checkout />
					</div>
				</div>
			</div>
		</Layout>
	);
}

checkout.getInitialProps = async ctx => {
	const res = await fetcher({ ctx, endPoint, method: "GET" });
	if (res.status <= 300) {
		const resData = await res.json();
		if (resData.status === "success") {
			const { data } = resData;
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
		form: PropTypes.shape({
			userEmail: PropTypes.string,
			formData: PropTypes.arrayOf(
				PropTypes.shape({
					key: PropTypes.string,
					value: PropTypes.string
				})
			)
		}),
		package: PropTypes.string,
		packageAmount: PropTypes.number
	})
};

export default withAuthVerification(withAuthSync(checkout));
