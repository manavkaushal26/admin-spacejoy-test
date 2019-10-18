import Carousel from "@components/Carousel";
import Image from "@components/Image";
import testimonialsMock from "@utils/testimonialsMock";
import React from "react";
import ReactCompareImage from "react-compare-image";
import styled from "styled-components";
import SectionHeader from "./SectionHeader";

const SectionWrapper = styled.section`
	position: relative;
	padding: 100px 0;
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
	display: inline;
	box-shadow: 0 0 10px ${({ theme }) => theme.colors.mild.black};
	filter: grayscale(0);
	border-radius: 2px;
	&:hover {
		filter: grayscale(1);
	}
`;

export default function TestimonialsLarge() {
	return (
		<SectionWrapper>
			<div className="container">
				<SectionHeader
					title="Joyous homes, Happy customers"
					description="They’ll tell you why they love us. Hear it straight from our beloved customers"
				/>
				<Carousel slidesToShow={1} slidesToScroll={1} draggable={false}>
					{testimonialsMock.map(item => (
						<div key={item.name}>
							<div className="grid justify-center">
								<div className="col-md-3">
									<ImageStyled src={item.dp} width="80px" />
									<h3>
										{`${item.name}'s`} {item.roomType}
									</h3>
									<small>{item.address}</small>
									<p>&quot;{item.description}&quot;</p>
								</div>
								<div className="col-md-7">
									<ReactCompareImage
										sliderPositionPercentage={0.2}
										leftImageLabel="Before"
										leftImage={item.before}
										rightImageLabel="After"
										rightImage={item.after}
									/>
								</div>
							</div>
						</div>
					))}
				</Carousel>
			</div>
		</SectionWrapper>
	);
}
