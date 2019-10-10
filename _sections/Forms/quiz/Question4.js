import FormBox from "@components/Form";
import Field from "@components/Form/Field";
import { company } from "@utils/config";
import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";
import QuizHeader from "./QuizHeader";

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

function Question4({ name, email }) {
	return (
		<div className="container">
			<div className="grid text-center">
				<div className="col-12 col-md-6 col-lg-4">
					<QuizHeader
						title="Please enter your contact details"
						description="Let's start by helping your designers understand which rooms you prefer."
					/>
					<div className="grid align-center">
						<div className="col-12">
							<FormBoxWrapperStyled>
								<FormBox
									redirectUrl="/checkout"
									destination="/forms"
									description="Submit your requirements"
									name="designmyspacequiz"
								>
									<Field
										name="userName"
										type="text"
										label="Name"
										value={name}
										readonly={!!name}
										placeholder="Username"
										error="Please enter a valid username"
										hint="should contain valid text"
									/>
									<Field
										name="userEmail"
										type="email"
										label="Email"
										value={email}
										readonly={!!email}
										placeholder="Email"
										error="Please enter a valid email"
										hint="should contain valid email"
										required
									/>
									<Field
										name="userMobile"
										type="tel"
										label="Mobile"
										placeholder="Mobile"
										error="Please enter a valid Mobile"
										hint="should contain valid Mobile"
										required
									/>
									<Field
										name="userCommutePermissionGranted"
										type="checkbox"
										label={`By signing up to a free trial of ${company.product}, you agree to our
										Terms and privacy policy`}
										error="Please select checkbox"
										required
									/>
									<Field name="userSubmit" type="submit" label="Submit" />
								</FormBox>
							</FormBoxWrapperStyled>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

Question4.defaultProps = {
	name: "",
	email: ""
};

Question4.propTypes = {
	name: PropTypes.string,
	email: PropTypes.string
};

export default Question4;