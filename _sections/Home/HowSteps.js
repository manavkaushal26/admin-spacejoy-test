import Logo from "@components/Logo";
import React from "react";
import styled from "styled-components";

const SectionWrapper = styled.div`
	position: relative;
	background: url("https://res.cloudinary.com/spacejoy/image/upload/v1569620131/web/pink-sofa_hp7wvg.jpg") no-repeat
		center;
	background-size: cover;
	background-attachment: fixed;
	box-shadow: 0 0 10px 0px ${({ theme }) => theme.colors.mild.black} inset;
	padding: 100px 0;
	&:before,
	&:after {
		content: "";
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.25);
	}
`;

const StepWrapperStyled = styled.div`
	position: relative;
	z-index: 1;
	background-color: ${({ theme }) => theme.colors.white};
	height: 300px;
	box-shadow: 0 0 10px 0px ${({ theme }) => theme.colors.mild.black};
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
`;

export default function HowSteps() {
	return (
		<SectionWrapper>
			<div className="container">
				<div className="grid text-center">
					<div className="col-12">
						<StepWrapperStyled>
							<Logo md />
						</StepWrapperStyled>
					</div>
				</div>
			</div>
		</SectionWrapper>
	);
}
