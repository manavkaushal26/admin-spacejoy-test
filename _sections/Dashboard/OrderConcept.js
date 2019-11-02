import Button from "@components/Button";
import Image from "@components/Image";
import Link from "next/link";
import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";

const OrderConceptStyled = styled.div`
	height: 100%;
	h3 {
		color: ${({ theme }) => theme.colors.accent};
		margin-bottom: 0;
		& + {
			h5 {
				color: ${({ theme }) => theme.colors.fc.dark2};
				font-weight: normal;
				text-transform: uppercase;
			}
		}
	}
`;

function OrderConcept({ project, final }) {
	const renderConcept = design => (
		<div className={project.currentPhase === "final" ? "col-xs-12" : "col-xs-6 rounded"} key={design.designId}>
			<h3>Concept #{design.designConcept}</h3>
			<h5>
				<strong>CONCEPT Name : </strong> {design.designName} <br />
				<strong>CONCEPT ID : </strong> {design.designId}
			</h5>
			<Link
				href={{ pathname: "/dashboard/designView", query: { pid: project.id, did: design.designId } }}
				as={`/dashboard/designView/pid/${project.id}/did/${design.designId}`}
			>
				<a href={`/dashboard/designView/pid/${project.id}/did/${design.designId}`}>
					<div>
						<Image
							width="100%"
							src={`https://api.spacejoy.com/api/file/download?url=${design.designBanner}`}
							shape="rounded"
						/>
					</div>
				</a>
			</Link>
			<p>{design.designDescription}</p>
			<div className="grid">
				<div className="col-12">
					<Link
						href={{ pathname: "/dashboard/designView", query: { pid: project.id, did: design.designId } }}
						as={`/dashboard/designView/pid/${project.id}/did/${design.designId}`}
					>
						<a href={`/dashboard/designView/pid/${project.id}/did/${design.designId}`}>
							<Button fill="ghost" size="sm" shape="flat">
								Explore {design.designName}
							</Button>
						</a>
					</Link>
				</div>
			</div>
		</div>
	);

	return (
		<OrderConceptStyled>
			<div className="grid">
				{project.designs.map(design =>
					final ? design.state === "finalized" && renderConcept(design) : renderConcept(design)
				)}
			</div>
		</OrderConceptStyled>
	);
}

OrderConcept.defaultProps = {
	project: {},
	final: false,
	authVerification: {
		name: "",
		email: ""
	}
};

OrderConcept.propTypes = {
	authVerification: PropTypes.shape({
		name: PropTypes.string,
		email: PropTypes.string
	}),
	project: PropTypes.shape({
		id: PropTypes.string,
		currentPhase: PropTypes.string,
		designs: PropTypes.arrayOf(
			PropTypes.shape({
				designId: PropTypes.string,
				designConcept: PropTypes.number,
				designName: PropTypes.string,
				designDescription: PropTypes.string,
				designBanner: PropTypes.string
			})
		)
	}),
	final: PropTypes.bool
};

export default OrderConcept;
