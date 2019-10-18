import BenefitList from "@components/BenefitList";
import Divider from "@components/Divider";
import Image from "@components/Image";
import List from "@components/List";
import { cloudinary, company } from "@utils/config";
import React from "react";
import styled from "styled-components";
import SectionHeader from "./SectionHeader";

const SectionWrapper = styled.section`
	position: relative;
	padding: 100px 0;
`;

export default function GetReadyBanner() {
	return (
		<SectionWrapper>
			<div className="container">
				<div className="grid align-center justify-space-between">
					<div className="col-md-5">
						<div className="video-container">
							<div className="filter" />
							<video
								autoPlay
								loop
								muted
								playsinline
								src="https://res.cloudinary.com/spacejoy/video/upload/v1571392240/web/app-demo_nqubhu.mp4"
							/>
							<div className="poster hidden">
								<img src="PATH_TO_JPEG" alt="" />
							</div>
						</div>
					</div>
					<div className="col-md-5 text-left">
						<SectionHeader title="Download our 3D interactive App" />
						<BenefitList>
							<BenefitList.Item icon="tick" nature="positive">
								Access your designs anytime, anywhere
							</BenefitList.Item>
							<BenefitList.Item icon="tick" nature="positive">
								Keep track of project progress
							</BenefitList.Item>
							<BenefitList.Item icon="tick" nature="positive">
								Add comments and suggest changes
							</BenefitList.Item>
							<BenefitList.Item icon="tick" nature="positive">
								Edit, move, swap and rotate products
							</BenefitList.Item>
							<BenefitList.Item icon="tick" nature="positive">
								Shop with ease
							</BenefitList.Item>
						</BenefitList>
						<Divider />
						<List direction="horizontal">
							<li>
								<a href={company.app.ios}>
									<Image
										width="150px"
										src={`${cloudinary.baseDeliveryURL}/image/upload/c_scale,h_60/v1571050296/shared/app-store_dvz21i.png`}
										alt="app store"
									/>
								</a>
							</li>
							<li>
								<a href={company.app.android}>
									<Image
										width="150px"
										src={`${cloudinary.baseDeliveryURL}/image/upload/c_scale,h_60/v1571050296/shared/play-store_ncfocx.png`}
										alt="play store"
									/>
								</a>
							</li>
						</List>
					</div>
				</div>
			</div>
		</SectionWrapper>
	);
}
