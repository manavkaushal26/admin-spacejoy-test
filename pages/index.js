import Layout from "@components/Layout";
import Head from "next/head";
import Link from "next/link";
import React from "react";

function index() {
	return (
		<Layout header="auth">
			<Head>
				<title>My page title</title>
			</Head>
			<ul>
				<li>Home</li>
				<li>
					<Link href="/demo" as="/demo">
						<a href="/demo">demo Us</a>
					</Link>
					<Link href="/post?slug=something" as="/post/something">
						<a href="/post/something">post Us</a>
					</Link>
				</li>
			</ul>
			<h1>THIS IS OUR HOMEPAGE.</h1>
			<p>Text</p>
		</Layout>
	);
}

export default index;
