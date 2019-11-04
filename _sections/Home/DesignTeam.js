import Image from "@components/Image";
import ProfileCard from "@sections/Cards/profile";
import CTA from "@sections/CTA";
import React from "react";
import styled from "styled-components";
import SectionHeader from "./SectionHeader";

const SectionWrapper = styled.section`
	position: relative;
	padding: 100px 0;
	background: ${({ theme }) => theme.colors.bg.light1};
`;

function DesignTeam() {
	return (
		<SectionWrapper>
			<div className="container">
				<SectionHeader
					title="Our deck of designers"
					description="Our team of incredible designers can’t wait to get started. They’ll design your space and take it to the next level while working with you, for you"
				/>
				<div className="grid align-center">
					<div className="col-xs-12">
						<div className="grid">
							<div className="col-6 col-md-2">
								<ProfileCard>
									<ProfileCard.Designation />
									<ProfileCard.UserName />
									<ProfileCard.Image source="https://res.cloudinary.com/spacejoy/image/upload/v1571384835/web/Spacejoy_Designers_Reeba_mlj7vc.jpg" />
									<ProfileCard.Social fb="" tw="" li="" pi="" />
								</ProfileCard>
							</div>
							<div className="col-6 col-md-2">
								<ProfileCard>
									<ProfileCard.Designation />
									<ProfileCard.UserName />
									<ProfileCard.Image source="https://res.cloudinary.com/spacejoy/image/upload/w_400/v1572423047/web/Spacejoy_Designers_Irina_ifgasy.jpg" />
									<ProfileCard.Social fb="" tw="" li="" pi="" />
								</ProfileCard>
							</div>
							<div className="col-12 col-md-4 text-center align-self-center">
								<div>
									<Image
										src="https://res.cloudinary.com/spacejoy/image/upload/w_400/v1571054987/web/quote_fqabdm.png"
										width="150px"
									/>
									<p>Let&apos;s get started</p>
									<CTA
										fill="ghost"
										shape="flat"
										size="md"
										action="StartFreeTrial"
										label="MeetDesigners"
										event="StartFreeTrial"
										data={{ sectionName: "MeetDesigners" }}
									/>
								</div>
							</div>
							<div className="col-6 col-md-2">
								<ProfileCard>
									<ProfileCard.Designation />
									<ProfileCard.UserName />
									<ProfileCard.Image source="https://res.cloudinary.com/spacejoy/image/upload/v1572620082/web/Spacejoy_Designers_Maria_cwx91q.jpg" />
									<ProfileCard.Social />
								</ProfileCard>
							</div>
							<div className="col-6 col-md-2">
								<ProfileCard>
									<ProfileCard.Designation />
									<ProfileCard.UserName />
									<ProfileCard.Image source="https://res.cloudinary.com/spacejoy/image/upload/v1571384835/web/Spacejoy_Designers_Lauren_kgxftf.jpg" />
									<ProfileCard.Social fb="" tw="" li="" pi="" />
								</ProfileCard>
							</div>
						</div>
					</div>
				</div>
			</div>
		</SectionWrapper>
	);
}

export default DesignTeam;
