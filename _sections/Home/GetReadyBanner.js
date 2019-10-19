import CTA from "@sections/CTA";
import React from "react";
import styled from "styled-components";
import SectionHeader from "./SectionHeader";

const CTAStyled = styled(CTA)`
	border: 1px solid white;
	background-color: white;
`;

const SectionWrapper = styled.section`
	position: relative;
	padding: 100px 0;
	background-image: ${({ theme }) => `linear-gradient(135deg,${theme.colors.accent} 0%,#F9C17A 100%)`};
`;

export default function GetReadyBanner() {
	return (
		<SectionWrapper>
			<div className="container">
				<SectionHeader
					light
					title="Ready to get started?"
					description="When your budget and style meet our designers, you get 3D designs of your space that you can edit, finalize and shop on our app"
				/>
				<div className="grid align-center text-center">
					<CTAStyled
						shape="rounded"
						fill="ghost"
						action="StartFreeTrial"
						label="ReadyToStart"
						event="StartFreeTrial"
						data={{ sectionName: "ReadyToStart" }}
					/>
				</div>
			</div>
		</SectionWrapper>
	);
}
