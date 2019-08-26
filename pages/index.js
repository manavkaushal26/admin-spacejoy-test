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
			<div className="row">
				<div className="col-xs-7">
					<div className="box box-container">
						<div className="row">
							<div className="col-xs-9">
								<div className="box-first box-container">
									<div className="row">
										<div className="col-xs-4">
											<div className="box-nested" />
										</div>
										<div className="col-xs-8">
											<div className="box-nested" />
										</div>
									</div>
								</div>
							</div>
							<div className="col-xs-3">
								<div className="box-first box-container">
									<div className="row">
										<div className="col-xs">
											<div className="box-nested" />
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="col-xs-5">
					<div className="box box-container">
						<div className="row">
							<div className="col-xs-12">
								<div className="box-first box-container">
									<div className="row">
										<div className="col-xs-6">
											<div className="box-nested" />
										</div>
										<div className="col-xs-6">
											<div className="box-nested" />
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="row">
				<div className="col-xs-12">
					<div className="box">Hi</div>
				</div>
			</div>
		</Layout>
	);
}

export default index;
