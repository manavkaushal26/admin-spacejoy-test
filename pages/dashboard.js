import BreadCrumb from "@components/BreadCrumb";
import SVGIcon from "@components/SVGIcon";
import OrderSummary from "@sections/Dashboard/OrderSummary";
import Layout from "@sections/Layout";
import { withAuthSync, withAuthVerification } from "@utils/auth";
import { company } from "@utils/config";
import fetcher from "@utils/fetcher";
import IndexPageMeta from "@utils/meta";
import Head from "next/head";
import PropTypes from "prop-types";
import React, { useState } from "react";
import styled from "styled-components";

const endPoint = "/user/dashboard/projects";

const OrderSummaryTilesStyled = styled.div`
	border-right: 1px solid ${({ theme }) => theme.colors.bg.dark2};
	height: 100%;

	@media (max-width: 576px) {
		border-right: none;
	}
`;

const OrderSummaryTileStyled = styled.div`
	border-right: 1px solid transparent;
	padding: 1rem;
	border-radius: 2px 0 0 2px;
	margin-right: -1px;
	cursor: pointer;
	&:hover {
		background: ${({ theme }) => theme.colors.mild.blue};
	}
	&.active {
		background: ${({ theme }) => theme.colors.mild.blue};
		border-right: 1px solid ${({ theme }) => theme.colors.blue};
	}
	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		h4 {
			margin: 0;
			flex: 5;
		}
		svg {
			flex: 1;
		}
	}
`;

const dashboard = ({ isServer, authVerification, data }) => {
	const [activeTab, setActiveTab] = useState(data.projects[0].id);

	const handleTabClick = e => setActiveTab(e.currentTarget.getAttribute("data-id"));

	return (
		<Layout isServer={isServer} authVerification={authVerification}>
			<Head>
				{IndexPageMeta}
				<title>Dashboard | {company.product}</title>
			</Head>
			<div>
				<BreadCrumb />
				<div className="container">
					<div className="grid">
						<div className="col-xs-4 col-lg-3">
							<OrderSummaryTilesStyled>
								<h3>My Orders</h3>
								{data &&
									data.projects.map(project => (
										<OrderSummaryTileStyled
											key={project.id}
											data-id={project.id}
											onClick={handleTabClick}
											className={project.id === activeTab ? "active" : ""}
										>
											<div className="header">
												<h4>{project.name}</h4>
												<SVGIcon name="arrow-right" height={12} width={12} />
											</div>
										</OrderSummaryTileStyled>
									))}
							</OrderSummaryTilesStyled>
						</div>
						<div className="col-xs-8 col-lg-9">
							{data.projects.map(project => {
								return project.id === activeTab ? (
									<OrderSummary project={project} authVerification={authVerification} key={`project-${project.id}`} />
								) : null;
							})}
						</div>
					</div>
				</div>
			</div>
		</Layout>
	);
};

dashboard.getInitialProps = async ctx => {
	const res = await fetcher({ ctx, endPoint, method: "GET" });
	if (res.statusCode <= 300) {
		if (res.status === "success") {
			const { data } = res;
			return { data };
		}
	}
	return {};
};

dashboard.defaultProps = {
	data: {},
	authVerification: {
		name: "",
		email: ""
	}
};

dashboard.propTypes = {
	isServer: PropTypes.bool.isRequired,
	authVerification: PropTypes.shape({
		name: PropTypes.string,
		email: PropTypes.string
	}),
	data: PropTypes.shape({
		projects: PropTypes.arrayOf(
			PropTypes.shape({
				name: PropTypes.string,
				id: PropTypes.string
			})
		)
	})
};

export default withAuthVerification(withAuthSync(dashboard));
