import React from "react";
import styled from "styled-components";
import SectionHeader from "./SectionHeader";

const SectionWrapper = styled.section`
	position: relative;
	padding: 100px 0;
`;

export default function GetReadyBanner() {
	return (
		<SectionWrapper>
			<div className="container">
				<div className="grid align-center text-center">
					<div className="col-md-6">s</div>
					<div className="col-md-6">
						<SectionHeader title="Download our 3D interactive App" />
					</div>
				</div>
			</div>
		</SectionWrapper>
	);
}
