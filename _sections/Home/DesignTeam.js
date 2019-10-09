import Button from "@components/Button";
import ProfileCard from "@sections/Cards/profile";
import React from "react";
import styled from "styled-components";
import SectionHeader from "./SectionHeader";

const SectionWrapper = styled.div`
	position: relative;
	background: ${({ theme }) => theme.colors.bg.white};
	padding: 100px 0;
`;

function DesignTeam() {
	return (
		<SectionWrapper>
			<div className="container">
				<SectionHeader
					title="Meet Our Design Experts"
					description="Our designers will transform your space into a stunningly beautiful room"
				/>
				<div className="grid align-center">
					<div className="col-xs-12">
						<div className="grid">
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
									<ProfileCard.Image source="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=200&q=100" />
									<ProfileCard.Social fb="" tw="" li="" pi="" />
								</ProfileCard>
							</div>
							<div className="col-6 col-md-2">
								<ProfileCard>
									<ProfileCard.Designation />
									<ProfileCard.UserName />
									<ProfileCard.Image source="https://res.cloudinary.com/spacejoy/image/upload/c_scale,q_100,w_200/v1569914892/web/designer-3_f6xfm0.jpg" />
									<ProfileCard.Social fb="" tw="" li="" pi="" />
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
							<div className="col-6 col-md-2">
								<ProfileCard>
									<ProfileCard.Designation />
									<ProfileCard.UserName />
									<ProfileCard.Image source="https://res.cloudinary.com/spacejoy/image/upload/c_fill,g_center,h_300,w_200/v1569933571/web/designer-4_tz7i2j.jpg" />
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
						</div>
					</div>
					<div className="col-12">
						<Button fill="ghost" shape="rounded" size="md">
							DESIGN MY SPACE
						</Button>
					</div>
				</div>
			</div>
		</SectionWrapper>
	);
}

export default DesignTeam;
