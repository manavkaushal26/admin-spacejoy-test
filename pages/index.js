import Image from "@components/Image";
import Layout from "@components/Layout";
import Head from "next/head";
import Link from "next/link";
import React from "react";

function index() {
	return (
		<Layout header="solid">
			<Head>
				<title>My page title</title>
			</Head>
			<div className="container">
				<div className="grid">
					<div className="col-xs-12 align-center no-pad-vertical">
						<Image src="https://res.cloudinary.com/spacejoy/image/upload/v1567069731/web/couch_zwbuzf.png" />
					</div>
					<div className="col-xs-12 no-pad-vertical">
						<h2>Home Designs</h2>
						<h1>Made Easy</h1>
						<p>Experience the joy of designing your home in 3D using products from brands you can buy immediately!</p>
						PLANS STARTING AT $19
					</div>
				</div>
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
			</div>
		</Layout>
	);
}

export default index;
