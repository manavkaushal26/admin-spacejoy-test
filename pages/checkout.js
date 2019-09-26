import Layout from "@sections/Layout";
import { withAuthSync } from "@utils/auth";
import fetcher from "@utils/fetcher";
import IndexPageMeta from "@utils/meta";
import dynamic from "next/dynamic";
import Head from "next/head";
import PropTypes from "prop-types";
import React, { Fragment } from "react";

const Checkout = dynamic(() => import("@sections/Checkout"), { ssr: false });

const endPoint = "/formuser?source=designmyspace";

function checkout({ isServer, data }) {
	return (
		<Layout isServer={isServer}>
			<Head>
				{IndexPageMeta}
				<title>Checkout</title>
			</Head>
			<div className="container">
				<div className="grid text-center">
					<div className="col-6">
						<h3>Your Preferences</h3>
						{data && data.package}-{data && data.packageAmount}
						<div className="grid">
							{data &&
								data.form &&
								data.form.formdata.map(item => (
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
	const isServer = !!ctx.req;
	const res = await fetcher({ ctx, endPoint, method: "GET" });
	if (res.status <= 300) {
		const resData = await res.json();
		if (resData.status === "success") {
			const { data } = resData;
			return { isServer, data };
		}
	}
	return { isServer };
};

checkout.defaultProps = {
	data: {}
};

checkout.propTypes = {
	isServer: PropTypes.bool.isRequired,
	data: PropTypes.shape({
		form: PropTypes.shape({
			userEmail: PropTypes.string,
			formdata: PropTypes.arrayOf(
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

checkout.propTypes = {};

export default withAuthSync(checkout);
