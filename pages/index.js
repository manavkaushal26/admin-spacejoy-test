import Image from "@components/Image";
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
			<Image src="https://res.cloudinary.com/spacejoy/image/upload/v1566896729/web/design-page-banner.jpg" />
			<section className="page-section">
				<div className="grid">
					<div className="col-xs-12">
						<div className="box-row" />
					</div>
				</div>
				<div className="grid">
					<div className="col-xs-1">
						<div className="box-row" />
					</div>
					<div className="col-xs-11">
						<div className="box-row" />
					</div>
				</div>
				<div className="grid">
					<div className="col-xs-2">
						<div className="box-row" />
					</div>
					<div className="col-xs-10">
						<div className="box-row" />
					</div>
				</div>
				<div className="grid">
					<div className="col-xs-3">
						<div className="box-row" />
					</div>
					<div className="col-xs-9">
						<div className="box-row" />
					</div>
				</div>
				<div className="grid">
					<div className="col-xs-4">
						<div className="box-row" />
					</div>
					<div className="col-xs-8">
						<div className="box-row" />
					</div>
				</div>
				<div className="grid">
					<div className="col-xs-5">
						<div className="box-row" />
					</div>
					<div className="col-xs-7">
						<div className="box-row" />
					</div>
				</div>
				<div className="grid">
					<div className="col-xs-6">
						<div className="box-row" />
					</div>
					<div className="col-xs-6">
						<div className="box-row" />
					</div>
				</div>
			</section>
		</Layout>
	);
}

export default index;
