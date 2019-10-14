// import Button from "@components/Button";
import Image from "@components/Image";
import React from "react";
import styled from "styled-components";

const SectionWrapper = styled.section`
	padding: 50px 0;
	background: ${({ theme }) => theme.colors.mild.yellow};
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
		<SectionWrapper>
			<div className="container">
				<div className="grid text-center">
					<div className="col-12 col-xs-8">
						<h2>
							&quot;Incredibly happy with our designer who took our brief and transformed our living room to match the
							vision&quot;
						</h2>
						<Image
							src="https://res.cloudinary.com/spacejoy/image/upload/v1568876294/web/customer3_z2vvn2.jpg"
							size="120px"
							circle
						/>
						<div>
							<h3>Erika Lee</h3>
							<small>Denver, Colarado</small>
						</div>
					</div>
				</div>
			</div>
		</SectionWrapper>
	);
}
