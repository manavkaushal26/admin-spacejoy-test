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
			<a>Design My Space</a>
		</Link>
	</li>
);

const QZ = () => (
	<li key="qz">
		<Link href={{ pathname: "/designMySpace", query: { quiz: "start", plan: "free" } }} as="/designMySpace?quiz=start">
			<a>Quiz</a>
		</Link>
	</li>
);

const ACTIVE = query => (
	<li key="active">
		{query.quiz === "start" && "Intro"}
		{query.quiz === "1" && "Which room are you designing"}
		{query.quiz === "2" && "Have a budget in mind"}
		{query.quiz === "3" && "How does your room look today"}
		{query.quiz === "4" && "Please enter your contact details"}
		{query.quiz === "success" && "Done"}
	</li>
);

const PRICING = () => <li key="pricing">Pricing</li>;

function index({ router }) {
	const getCrumbs = () => {
		const crumbs = [];
		const { pathname, query } = router;
		switch (pathname) {
			case "/designMySpace":
				if (query.quiz) {
					crumbs.push(DMS(), QZ(), ACTIVE(query));
				} else {
					crumbs.push(DMS());
				}
				return crumbs;
			case "/pricing":
				crumbs.push(PRICING());
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
									<a>
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
