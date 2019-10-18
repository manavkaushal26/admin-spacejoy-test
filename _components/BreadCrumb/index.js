import Link from "next/link";
import { withRouter } from "next/router";
import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";
import SVGIcon from "../SVGIcon";

const BreadCrumbStyled = styled.div`
	border-top: 1px solid ${({ theme }) => theme.colors.bg.light2};
	padding: 1rem 0;
	ul {
		margin: 0;
		padding: 0;
		li {
			margin: 0;
			list-style: none;
			display: inline-block;
			font-size: 0.8rem;
			&:last-child {
				&:after {
					content: "";
				}
			}
			&:after {
				content: "/";
				padding: 0 0.5rem;
			}
			a {
				color: ${({ theme }) => theme.colors.fc.dark1};
				&:hover {
					color: ${({ theme }) => theme.colors.primary1};
				}
			}
		}
	}
`;

const DMS = () => (
	<li key="dms">
		<Link href={{ pathname: "/designMySpace", query: {} }} as="/designMySpace">
			<a href="/designMySpace">Design My Space</a>
		</Link>
	</li>
);

const QZ = () => (
	<li key="qz">
		<Link href={{ pathname: "/designMySpace", query: { quiz: "start", plan: "free" } }} as="/designMySpace?quiz=start">
			<a href="/designMySpace?quiz=start">Design My Space - Quiz</a>
		</Link>
	</li>
);

const ACTIVE = query => (
	<li key="active">
		{query.quiz === "start" && "Intro"}
		{query.quiz === "1" && "Select Room"}
		{query.quiz === "2" && "Set Budget"}
		{query.quiz === "3" && "Design Purpose"}
		{query.quiz === "4" && "Timeline"}
		{query.quiz === "5" && "Decoration Iteration"}
	</li>
);

const PRICING = () => <li key="pricing">Pricing</li>;
const PROFILE = () => <li key="profile">Profile</li>;
const DASHBOARD = () => <li key="dashboard">Dashboard</li>;

function index({ router }) {
	const getCrumbs = () => {
		const crumbs = [];
		const { pathname, query } = router;
		switch (pathname) {
			case "/designMySpace":
				if (query.quiz) {
					crumbs.push(QZ(), ACTIVE(query));
				} else {
					crumbs.push(DMS());
				}
				return crumbs;
			case "/pricing":
				crumbs.push(PRICING());
				return crumbs;
			case "/profile":
				crumbs.push(PROFILE());
				return crumbs;
			case "/dashboard":
				crumbs.push(DASHBOARD());
				return crumbs;
			default:
				return crumbs;
		}
	};

	return (
		<div className="container">
			<div className="grid">
				<div className="col-12 col-bleed-y">
					<BreadCrumbStyled>
						<ul>
							<li>
								<Link href={{ pathname: "/", query: {} }} as="/">
									<a href="/">
										<SVGIcon name="logo" height={15} width={14} />
									</a>
								</Link>
							</li>
							{getCrumbs()}
						</ul>
					</BreadCrumbStyled>
				</div>
			</div>
		</div>
	);
}

index.propTypes = {
	router: PropTypes.shape({
		pathname: PropTypes.string,
		query: PropTypes.shape({
			quiz: PropTypes.string
		})
	}).isRequired
};

export default withRouter(index);
