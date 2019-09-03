import Image from "@components/Image";
import Layout from "@components/Layout";
import Head from "next/head";
import React from "react";

export default function checkout() {
	return (
		<Layout header="solid">
			<Head>
				<title>FAQ</title>
			</Head>
			<div className="container">
				<Image size="354px" src="https://res.cloudinary.com/spacejoy/image/upload/v1567248692/web/faq_dgczvi.jpg" />
				<div className="grid">
					<div className="col-xs-12">checkout</div>
				</div>
			</div>
		</Layout>
	);
}
