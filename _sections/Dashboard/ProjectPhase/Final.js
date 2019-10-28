import PropTypes from "prop-types";
import React from "react";

function Final() {
	return <div>Final</div>;
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
