import PropTypes from "prop-types";
import React from "react";
import OrderConcept from "../OrderConcept";

function Designs({ authVerification, project }) {
	return <OrderConcept authVerification={authVerification} project={project} />;
}

Designs.defaultProps = {
	project: {},
	authVerification: {
		name: "",
		email: ""
	}
};

Designs.propTypes = {
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

export default Designs;
