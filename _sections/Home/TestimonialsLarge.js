import Image from "@components/Image";
import React from "react";
import ReactCompareImage from "react-compare-image";
import styled from "styled-components";
import SectionHeader from "./SectionHeader";

const SectionWrapper = styled.section`
	position: relative;
	padding: 40px 0;
	h3 {
		margin-bottom: 0rem;
		& + small {
			margin-top: 0;
			color: ${({ theme }) => theme.colors.fc.dark2};
		}
	}
	p {
		color: ${({ theme }) => theme.colors.fc.dark2};
	}
`;

const ImageStyled = styled(Image)`
	box-shadow: 0 0 10px ${({ theme }) => theme.colors.mild.black};
	filter: grayscale(1);
	border-radius: 2px;
`;

export default function TestimonialsLarge() {
	return (
		<SectionWrapper>
			<div className="container">
				<SectionHeader
					title="What Our Customers Say"
					description="Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore"
				/>
				<div className="grid text-center align-center">
					<div className="col-12 col-xs-3 text-left">
						<ImageStyled
							src="https://res.cloudinary.com/spacejoy/image/upload/v1568876294/web/customer3_z2vvn2.jpg"
							size="120px"
						/>
						<h3>Living room for Erika Lee</h3>
						<small>Denver, Colarado</small>
						<p>
							Our designer from Spacejoy immediately caught on to our vision and delivered. The execution was flawless.
							We couldn’t be happier with how amazing our home looks right now.
						</p>
					</div>
					<div className="col-12 col-xs-7">
						<ReactCompareImage
							sliderPositionPercentage={0.2}
							leftImageLabel="Before"
							leftImage="https://res.cloudinary.com/spacejoy/image/upload/c_fill,g_center,h_420,w_840/v1568876295/web/Design_2_before_igjbzg.jpg"
							rightImageLabel="After"
							rightImage="https://res.cloudinary.com/spacejoy/image/upload/c_fill,g_center,h_420,w_840/v1568876295/web/Design_2_after_m2grcx.jpg"
						/>
					</div>
				</div>
			</div>
		</SectionWrapper>
	);
}
