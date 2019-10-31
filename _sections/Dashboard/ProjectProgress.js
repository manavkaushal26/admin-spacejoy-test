import Stepper from "@components/Stepper";
import PropTypes from "prop-types";
import React from "react";

const projectPhase = ["requirement", "brief", "designs", "final"];

function ProjectProgress({ currentPhase }) {
	return (
		<div className="grid align-center text-center">
			<div className="col-12 col-xs-12">
				<Stepper>
					{projectPhase.map((phase, index) => (
						<Stepper.Step
							title={index + 1}
							description={phase}
							key={phase}
							isActive={projectPhase.indexOf(phase) <= projectPhase.indexOf(currentPhase)} // 0 < 1
						/>
					))}
				</Stepper>
			</div>
		</div>
	);
}

ProjectProgress.defaultProps = {
	currentPhase: ""
};

ProjectProgress.propTypes = {
	currentPhase: PropTypes.string
};

export default ProjectProgress;
