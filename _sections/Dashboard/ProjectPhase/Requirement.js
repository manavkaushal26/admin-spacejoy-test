import Button from "@components/Button";
import SectionHeader from "@sections/SectionHeader";
import { company } from "@utils/config";
import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";

const TypeFormLinkStyled = styled.div`
	margin-top: 2rem;
`;

const Requirement = ({ authVerification, project }) => {
	console.log("project", project);
	return (
		<div className="grid">
			<div className="col-xs-8">
				<SectionHeader title={`Welcome ${authVerification.name}`} description="" />
				<div className="text-left">
					<h4>Thanks so much for signing up with {company.product}!</h4>
					<p>
						We are dedicated to helping you build out the perfect space {project.name ? ` for ${project.name}.` : "."}
					</p>
					<p>We&apos;d love to set up a time for a phone call to meet and discuss the project.</p>
					<p>
						In the meantime, we&apos;ve compiled a handful of{" "}
						<a href="https://spacejoy.typeform.com/to/LewAOP" target="_blank" rel="noopener noreferrer">
							questions
						</a>{" "}
						to give us a better idea of your existing room and furniture, aesthetics, and how you want to use the space.
						Feel free to begin filling it out prior to our call.
					</p>
					<strong>
						Your designer will connect with you once you complete the questionnaire. Looking forward to speaking and
						starting to bring your vision to life.
					</strong>
					<TypeFormLinkStyled>
						<a href="https://spacejoy.typeform.com/to/LewAOP" target="_blank" rel="noopener noreferrer">
							<Button variant="primary" size="sm">
								Start Questionnaire
							</Button>
						</a>
					</TypeFormLinkStyled>
				</div>
			</div>
		</div>
	);
};

Requirement.defaultProps = {
	project: {},
	authVerification: {
		name: "",
		email: ""
	}
};

Requirement.propTypes = {
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

export default Requirement;
