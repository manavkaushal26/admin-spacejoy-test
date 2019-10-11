import Button from "@components/Button";
import Image from "@components/Image";
import { redirectToLocation } from "@utils/auth";
import React from "react";
import styled from "styled-components";
import SectionHeader from "./SectionHeader";

const SectionWrapper = styled.section`
	background: ${({ theme }) => theme.colors.mild.red};
	position: relative;
	padding: 40px 0;
`;

const ImageStyled = styled(Image)`
	box-shadow: 0 0 10px ${({ theme }) => theme.colors.mild.black};
`;

function ExploreDesigns() {
	return (
		<SectionWrapper>
			<div className="container">
				<SectionHeader
					title="Explore Our Designs"
					description="Take a look for yourself at spaces that brought joy to others. Shop for furniture and décor directly from the designs"
				/>
				<div className="grid">
					<div className="col-12 col-xs-3">
						<ImageStyled src="https://api.homefuly.com/projects/5d5116716ec2df1947e6280c/rooms/5d7b3a0e0eefdd279a564f1a/versions/5da02283f791b977e0336c7d/designimages/final%202_c.png" />
					</div>
					<div className="col-12 col-xs-3">
						<ImageStyled src="https://api.homefuly.com/projects/5d5116716ec2df1947e6280c/rooms/5d78d0e628f3e47a6ee143d2/versions/5d9edf3cf791b977e03353cb/designimages/FINAL%201_c.png" />
					</div>
					<div className="col-12 col-xs-3">
						<ImageStyled src="https://api.homefuly.com/projects/5d5116716ec2df1947e6280c/rooms/5d89bbd8200a584ab21b4b9b/versions/5d89c200200a584ab21b4c65/designimages/1_c.jpg" />
					</div>
					<div className="col-12 col-xs-3">
						<ImageStyled src="https://api.homefuly.com/projects/5d5116716ec2df1947e6280c/rooms/5d724b29d948dc2acd9c9431/versions/5d75fcad28f3e47a6ee0f989/designimages/Final_1_c.jpg" />
					</div>
					<div className="col-12 col-xs-3">
						<ImageStyled src="https://api.homefuly.com/projects/5d5116716ec2df1947e6280c/rooms/5d5f8a916815d405db09c294/versions/5d662007efc3af13c08b2283/designimages/1_c.jpg" />
					</div>
					<div className="col-12 col-xs-3">
						<ImageStyled src="https://api.homefuly.com/projects/5d4bbde1db029b18032e6076/rooms/5d53a74fe1c6ca40dbb4e45d/versions/5d5a4130cf48ed36d481fab5/designimages/1_c.png" />
					</div>
					<div className="col-12 col-xs-3">
						<ImageStyled src="https://api.homefuly.com/projects/5d5116716ec2df1947e6280c/rooms/5d568a73e1c6ca40dbb5413d/versions/5d568a76e1c6ca40dbb5413e/designimages/1_c.png" />
					</div>
					<div className="col-12 col-xs-3">
						<ImageStyled src="https://api.homefuly.com/projects/5d01f7e8dd88be3f17fa5e04/rooms/5d0247eed843662a63efae11/versions/5d0247efd843662a63efae12/designimages/1_c.jpg" />
					</div>
				</div>
				<div className="col-12 text-center">
					<Button
						fill="ghost"
						shape="flat"
						size="md"
						onClick={() =>
							redirectToLocation({
								pathname: "/designProjects",
								query: {},
								url: "/designProjects"
							})
						}
					>
						Explore More
					</Button>
				</div>
			</div>
		</SectionWrapper>
	);
}

export default ExploreDesigns;
