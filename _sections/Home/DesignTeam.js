import Image from "@components/Image";
import ProfileCard from "@sections/Cards/profile";
import React from "react";
import styled from "styled-components";
import CTA from "./homeUtil";
import SectionHeader from "./SectionHeader";

const ExtraCardStyled = styled.div``;

const SectionWrapper = styled.section`
	position: relative;
	padding: 100px 0;
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
									<ProfileCard.Image source="https://res.cloudinary.com/spacejoy/image/upload/v1571156013/web/designer1_t65axo.jpg" />
									<ProfileCard.Social fb="" tw="" li="" pi="" />
								</ProfileCard>
							</div>
							<div className="col-6 col-md-2">
								<ProfileCard>
									<ProfileCard.Designation />
									<ProfileCard.UserName />
									<ProfileCard.Image source="https://res.cloudinary.com/spacejoy/image/upload/c_fill,g_center,h_300,w_200/v1569933570/web/designer-1_pw7lsf.jpg" />
									<ProfileCard.Social fb="" tw="" li="" pi="" />
								</ProfileCard>
							</div>
							<div className="col-12 col-md-4 text-center align-self-center">
								<ExtraCardStyled>
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
								</ExtraCardStyled>
							</div>
							<div className="col-6 col-md-2">
								<ProfileCard>
									<ProfileCard.Designation />
									<ProfileCard.UserName />
									<ProfileCard.Image source="https://res.cloudinary.com/spacejoy/image/upload/c_fill,g_face,h_300,q_100,w_200/v1569914893/web/designer-2_kdi9o4.jpg" />
									<ProfileCard.Social />
								</ProfileCard>
							</div>
							<div className="col-6 col-md-2">
								<ProfileCard>
									<ProfileCard.Designation />
									<ProfileCard.UserName />
									<ProfileCard.Image source="https://res.cloudinary.com/spacejoy/image/upload/c_fill,g_center,h_300,w_200/v1569933569/web/designer-5_rf3y3j.jpg" />
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
