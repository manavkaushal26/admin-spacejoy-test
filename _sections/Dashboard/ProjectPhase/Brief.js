import Image from "@components/Image";
import PropTypes from "prop-types";
import React from "react";

function Brief() {
	return (
		<div className="grid text-center">
			<div className="col-12">
				<Image
					height="200px"
					src="https://res.cloudinary.com/spacejoy/image/upload/v1568649903/shared/Illustration_ajvkhk.svg"
					alt="Dashboard Landing"
				/>
			</div>
			<div className="col-xs-6">
				Our designers are working on your designs. Hang on for just a little longer... They will appear here once they
				are ready.
			</div>
		</div>
	);
}

Brief.defaultProps = {
	project: {},
	authVerification: {
		name: "",
		email: ""
	}
};

Brief.propTypes = {
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

export default Brief;
