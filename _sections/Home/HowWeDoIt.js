// import { redirectToLocation } from "@utils/auth";
import Button from "@components/Button";
import Image from "@components/Image";
import React from "react";
import styled from "styled-components";
import SectionHeader from "./SectionHeader";

const SectionWrapper = styled.div`
	position: relative;
	background: ${({ theme }) => theme.colors.bg.light1};
	padding: 100px 0;
	h4 {
		font-family: inherit;
	}
`;

function HowWeDoIt() {
	return (
		<SectionWrapper>
			<div className="container">
				<SectionHeader
					title="How we do it"
					description="Get your room designed in 3D by designers. Get a glimpse of what it can look like. Upgrade to get access to the design and the shopping list in our App, Make/Request Changes, finalize a design and shop"
				/>
				<div className="grid align-center justify-space-around">
					<div className="col-4">
						<h4>01</h4>
						<h2>Set your budget & style</h2>
						<p>
							Start your free trial by uploading images of your room and tell us your budget, your requirements and most
							of all, your unique style and taste
						</p>
					</div>
					<div className="col-7">
						<Image src="https://res.cloudinary.com/spacejoy/image/upload/v1570619193/web/step-1_s3ljeg.png" full />
					</div>
					<div className="col-12 text-center">
						<Button fill="ghost">How it works</Button>
					</div>
				</div>
			</div>
		</SectionWrapper>
	);
}

export default HowWeDoIt;
