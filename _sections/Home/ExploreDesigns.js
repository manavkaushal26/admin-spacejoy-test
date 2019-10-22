import Button from "@components/Button";
import Image from "@components/Image";
import { redirectToLocation } from "@utils/auth";
import React from "react";
import styled from "styled-components";
import SectionHeader from "./SectionHeader";

const SectionWrapper = styled.section`
	background: ${({ theme }) => theme.colors.mild.red};
	position: relative;
	padding: 100px 0;
`;

const ImageStyled = styled(Image)`
	box-shadow: 0 0 10px ${({ theme }) => theme.colors.mild.black};
`;

function ExploreDesigns() {
	return (
		<SectionWrapper>
			<div className="container">
				<SectionHeader
					title="Look! We designed this"
					description="Explore spaces that spark ultimate joy! That’s not it, love something that you see? You can shop for products directly from each design"
				/>

				<div className="grid">
					<div className="col-12 col-xs-3">
						<ImageStyled
							width="100%"
							src="https://api.homefuly.com/projects/5d5116716ec2df1947e6280c/rooms/5d5f8a916815d405db09c294/versions/5d662007efc3af13c08b2283/designimages/1_c.jpg"
						/>
					</div>
					<div className="col-12 col-xs-3">
						<ImageStyled
							width="100%"
							src="https://api.homefuly.com/projects/5d5116716ec2df1947e6280c/rooms/5d78d0e628f3e47a6ee143d2/versions/5d9edf3cf791b977e03353cb/designimages/FINAL%201_c.png"
						/>
					</div>
					<div className="col-12 col-xs-3">
						<ImageStyled
							width="100%"
							src="https://api.homefuly.com/projects/5d5116716ec2df1947e6280c/rooms/5d6922e3efc3af13c08b6ea3/versions/5d7b57fd0eefdd279a564ff5/designimages/Final1_c.jpg"
						/>
					</div>
					<div className="col-12 col-xs-3">
						<ImageStyled
							width="100%"
							src="https://api.homefuly.com/projects/5d034041d843662a63efe63b/rooms/5d43e6843bce5454b812fcf8/versions/5d48640b9d8c14049e562188/designimages/2_c.jpg"
						/>
					</div>
					<div className="col-12 col-xs-3">
						<ImageStyled
							width="100%"
							src="https://api.homefuly.com/projects/5d5116716ec2df1947e6280c/rooms/5d7b3a0e0eefdd279a564f1a/versions/5da02283f791b977e0336c7d/designimages/final%202_c.png"
						/>
					</div>

					<div className="col-12 col-xs-3">
						<ImageStyled
							width="100%"
							src="https://api.homefuly.com/projects/5d4bbde1db029b18032e6076/rooms/5d53a74fe1c6ca40dbb4e45d/versions/5d5a4130cf48ed36d481fab5/designimages/1_c.png"
						/>
					</div>
					<div className="col-12 col-xs-3">
						<ImageStyled
							width="100%"
							src="https://api.homefuly.com/projects/5d5116716ec2df1947e6280c/rooms/5d95c6d4f791b977e032b8a2/versions/5da9ab7f82611669ed70b2f3/designimages/Natural%20oasis%20nursery_View%203_c.jpg"
						/>
					</div>
					<div className="col-12 col-xs-3">
						<ImageStyled
							width="100%"
							src="https://api.homefuly.com/projects/5d5116716ec2df1947e6280c/rooms/5d8b3d1f200a584ab21b7876/versions/5da9a3ff05e2e67d0c332024/designimages/Global%20Luxe_3_c.jpg"
						/>
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
						action="ExploreDesigns"
						label="ExploreDesigns"
						event="ExploreDesigns"
						data={{ sectionName: "ExploreDesigns" }}
					>
						Explore More
					</Button>
				</div>
			</div>
		</SectionWrapper>
	);
}

export default ExploreDesigns;
