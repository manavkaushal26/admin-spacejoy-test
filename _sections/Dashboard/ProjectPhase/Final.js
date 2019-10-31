import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";
import OrderConcept from "../OrderConcept";

const FinalBanner = styled.div`
	background: ${({ theme }) => theme.colors.mild.green};
	padding: 2rem;
	text-align: center;
	color: ${({ theme }) => theme.colors.green};
`;

function Final({ authVerification, project }) {
	return (
		<>
			<FinalBanner>Here is the final design of your living room</FinalBanner>
			<OrderConcept authVerification={authVerification} project={project} final />
		</>
	);
}

Final.defaultProps = {
	project: {},
	authVerification: {
		name: "",
		email: ""
	}
};

Final.propTypes = {
	authVerification: PropTypes.shape({
		name: PropTypes.string,
		email: PropTypes.string
	}),
	project: PropTypes.shape({
		currentPhase: PropTypes.string.isRequired,
		designs: PropTypes.arrayOf(
			PropTypes.shape({
				designId: PropTypes.string,
				designConcept: PropTypes.number,
				designName: PropTypes.string,
				designDescription: PropTypes.string,
				designBanner: PropTypes.string
			})
		)
	})
};

export default Final;
