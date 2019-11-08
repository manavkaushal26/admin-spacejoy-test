import BenefitList from "@components/BenefitList";
import Image from "@components/Image";
import { company } from "@utils/config";
import React from "react";
import styled from "styled-components";

const ThanksStyled = styled.div`
	background-color: ${({ theme }) => theme.colors.bg.light1};
	position: sticky;
	top: 100px;
	padding: 2rem 3rem 3rem 2rem;
	svg {
		path {
			fill: ${({ theme }) => theme.colors.accent};
		}
	}
`;

export default function Thanks() {
	return (
		<ThanksStyled>
			<h3>Thank you for choosing {company.product}</h3>
			<p>We hope you love your designs, but what&apos;s next?</p>
			<BenefitList>
				<BenefitList.Item icon="dot" nature="positive">
					Go through your designs
				</BenefitList.Item>
				<BenefitList.Item icon="dot" nature="positive">
					Pick one that you like the most
				</BenefitList.Item>
				<BenefitList.Item icon="dot" nature="positive">
					If you are happy with it, click on <b> Finalize</b>
				</BenefitList.Item>
				<BenefitList.Item icon="dot" nature="positive">
					If you like a little bit of both or simply need <br />
					&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;to revise, pick one of them and click on <br />
					&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>Revise </b>
					<b>Design</b> to provide your feedback
				</BenefitList.Item>
				<BenefitList.Item icon="dot" nature="positive">
					Our designer will get to work right away
				</BenefitList.Item>
			</BenefitList>
			<p>We&apos;ll work on it until you land on a design you love.</p>
			<p>
				Regards
				<br />
				Team {company.product}!
			</p>
			<Image
				src="https://res.cloudinary.com/spacejoy/image/upload/v1571403289/web/thankyou_augsq4.svg"
				width="100%"
				alt="thankyou"
			/>
		</ThanksStyled>
	);
}
