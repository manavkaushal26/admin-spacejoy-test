import SectionHeader from "@sections/SectionHeader";
import React from "react";
import styled from "styled-components";
import SignupForm from "../SignupForm";

const FormBoxWrapperStyled = styled.div`
	position: relative;
	padding: 2rem;
	border-radius: 2px;
	&:before,
	&:after {
		content: "";
		position: absolute;
		height: 200px;
		width: 150px;
	}
	&:before {
		top: 10%;
		left: -120px;
		background: url("https://res.cloudinary.com/spacejoy/image/upload/w_220/v1570339630/web/plant_mkgn6l.png") no-repeat
			center;
		background-size: contain;
	}
	&:after {
		top: 30%;
		right: -120px;
		background: url("https://res.cloudinary.com/spacejoy/image/upload/w_220/v1570339631/web/chair_nf2h0q.png") no-repeat
			center;
		background-size: contain;
	}
	@media (max-width: 740px) {
		padding: 0;
		&:before,
		&:after {
			display: none;
		}
	}
`;

function Question6() {
	return (
		<div className="container">
			<div className="grid text-center">
				<div className="col-12 col-md-6 col-lg-4">
					<SectionHeader
						title="Please enter your contact details"
						description="Let's start by helping your designers understand which rooms you prefer."
					/>
					<div className="grid align-center">
						<div className="col-12">
							<FormBoxWrapperStyled>
								<SignupForm />
							</FormBoxWrapperStyled>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Question6;
