// import Button from "@components/Button";
import Divider from "@components/Divider";
import Image from "@components/Image";
import React from "react";
// import SVGIcon from "@components/SVGIcon";
// import { redirectToLocation } from "@utils/auth";
// import { company } from "@utils/config";
import styled from "styled-components";

const SectionWrapperStyled = styled.div`
	padding: 100px 0;
	h2 {
		font-family: inherit;
		color: ${({ theme }) => theme.colors.fc.dark2};
	}
	h3 {
		margin-bottom: 0rem;
		& + small {
			margin-top: 0;
			color: ${({ theme }) => theme.colors.fc.dark2};
		}
	}
`;

export default function Testimonials() {
	return (
		<SectionWrapperStyled>
			<div className="container">
				<div className="grid text-center">
					<div className="col-8">
						<h2>
							“ Incredibly happy with our designer who took our brief and transformed our bedroom to match the vision ”
						</h2>
						<Image
							src="https://res.cloudinary.com/spacejoy/image/upload/v1568876294/web/customer3_z2vvn2.jpg"
							size="120px"
							circle
						/>
						<div>
							<Divider fancy size="7px" />
							<h3>Erika Lee</h3>
							<small>Denver, Colarado</small>
						</div>
					</div>
				</div>
			</div>
		</SectionWrapperStyled>
	);
}
