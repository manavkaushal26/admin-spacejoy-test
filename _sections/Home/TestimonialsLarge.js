import Carousel from "@components/Carousel";
import Image from "@components/Image";
import testimonialsMock from "@utils/testimonialsMock";
import React from "react";
import ReactCompareImage from "react-compare-image";
import styled from "styled-components";
import SectionHeader from "./SectionHeader";

const SectionWrapper = styled.section`
	position: relative;
	padding: 60px 0;
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
	&:hover {
		filter: grayscale(0);
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
						<div className="grid justify-center align-center" key={item.name}>
							<div className="col-12 col-md-4 text-left">
								<ImageStyled src={item.dp} size="120px" />
								<h3>
									{item.roomType} for {item.name}
								</h3>
								<small>{item.address}</small>
								<p>{item.description}</p>
							</div>
							<div className="col-12 col-md-7">
								<ReactCompareImage
									sliderPositionPercentage={0.2}
									leftImageLabel="Before"
									leftImage={item.before}
									rightImageLabel="After"
									rightImage={item.after}
								/>
							</div>
						</div>
					))}
				</Carousel>
			</div>
		</SectionWrapper>
	);
}
