import Button from "@components/Button";
import React from "react";
import styled from "styled-components";
import SectionHeader from "./SectionHeader";

const ButtonStyled = styled(Button)`
	border: 1px solid white;
	background-color: white;
`;
const SectionWrapper = styled.section`
	position: relative;
	padding: 40px 0;
	background-image: ${({ theme }) => `linear-gradient(135deg,${theme.colors.accent} 0%,#F9C17A 100%)`};
`;

export default function GetReadyBanner() {
	return (
		<SectionWrapper>
			<div className="container">
				<SectionHeader
					light
					title="Ready to get started?"
					description="Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore"
				/>
				<div className="grid align-center text-center">
					<ButtonStyled shape="rounded" fill="ghost">
						Start your free trial
					</ButtonStyled>
				</div>
			</div>
		</SectionWrapper>
	);
}
