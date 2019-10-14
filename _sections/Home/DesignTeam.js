import Button from "@components/Button";
import Image from "@components/Image";
import ProfileCard from "@sections/Cards/profile";
import { redirectToLocation } from "@utils/auth";
import React from "react";
import styled from "styled-components";
import SectionHeader from "./SectionHeader";

const ExtraCardStyled = styled.div``;

const SectionWrapper = styled.section`
	position: relative;
	padding: 60px 0;
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
									<ProfileCard.Image source="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=200&q=100" />
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
										src="https://res.cloudinary.com/spacejoy/image/upload/v1571054987/web/quote_fqabdm.png"
										size="170px"
									/>
									<p>Let&apos;s get started</p>
									<Button
										fill="ghost"
										shape="flat"
										size="md"
										onClick={() =>
											redirectToLocation({
												pathname: "/designMySpace",
												query: {},
												url: "/designMySpace"
											})
										}
										action="designMySpace"
										label="MeetDesigners"
										event="Design My Space"
										data={{ sectionName: "MeetDesigners" }}
									>
										Start Your Free Trial
									</Button>
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
