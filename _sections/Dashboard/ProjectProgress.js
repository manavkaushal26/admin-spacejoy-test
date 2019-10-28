import Stepper from "@components/Stepper";
import PropTypes from "prop-types";
import React, { useState } from "react";

function ProjectProgress({ currentPhase }) {
	const [stepActive] = useState(1);
	return (
		<div className="grid align-center text-center">
			<div className="col-12 col-xs-12">
				<Stepper>
					<Stepper.Step title="1" description={currentPhase} isActive={stepActive <= 3} />
					<Stepper.Step title="2" description="Get designs & revise" isActive={stepActive > 1 && stepActive <= 3} />
					<Stepper.Step title="3" description="Shop from your designs" isActive={stepActive === 3} />
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
