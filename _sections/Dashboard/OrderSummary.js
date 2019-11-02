import PropTypes from "prop-types";
import React from "react";
import Brief from "./ProjectPhase/Brief";
import Designs from "./ProjectPhase/Designs";
import Final from "./ProjectPhase/Final";
import Requirement from "./ProjectPhase/Requirement";
import ProjectProgress from "./ProjectProgress";

const projectPhase = ["requirement", "brief", "designs", "final", "revision", "onhold", "cancelled", "rejected"];

function OrderSummary({ project, authVerification }) {
	const { currentPhase } = project;
	// const currentPhase = projectPhase[2];
	const renderProjectPhase = () => {
		switch (currentPhase) {
			case projectPhase[0]:
				return <Requirement project={project} authVerification={authVerification} />;
			case projectPhase[1]:
				return <Brief project={project} authVerification={authVerification} />;
			case projectPhase[2]:
				return <Designs project={project} authVerification={authVerification} />;
			case projectPhase[3]:
				return <Final project={project} authVerification={authVerification} />;
			default:
				return <Requirement project={project} authVerification={authVerification} />;
		}
	};
	return (
		<div>
			<h3>{project.name}</h3>
			{currentPhase !== "final" && <ProjectProgress currentPhase={currentPhase} />}
			{renderProjectPhase()}
		</div>
	);
}

OrderSummary.defaultProps = {
	project: {},
	authVerification: {
		name: "",
		email: ""
	}
};

OrderSummary.propTypes = {
	authVerification: PropTypes.shape({
		name: PropTypes.string,
		email: PropTypes.string
	}),
	project: PropTypes.shape({
		currentPhase: PropTypes.string.isRequired,
		name: PropTypes.string.isRequired,
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

export default OrderSummary;
