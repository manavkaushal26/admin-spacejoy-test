import Button from "@components/Button";
import Image from "@components/Image";
import Link from "next/link";
import React from "react";
import styled from "styled-components";

const ClosedStyled = styled.div`
	background: ${({ theme }) => theme.colors.white};
	padding: 50px 0;
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	svg {
		path {
			fill: ${({ theme }) => theme.colors.green};
		}
	}
`;

export default function Closed() {
	return (
		<>
			<ClosedStyled>
				<Image
					src="https://res.cloudinary.com/spacejoy/image/upload/v1568649903/shared/Illustration_ajvkhk.svg"
					height="150px"
					alt="We have received your order."
				/>
				<h3>We have received your order.</h3>
				<p>We will call you</p>
				<Link href={{ pathname: "/dashboard", query: {} }} as="/dashboard">
					<a href="/dashboard">
						<Button fill="ghost" shape="rounded" size="sm">
							Dashboard
						</Button>
					</a>
				</Link>
			</ClosedStyled>
		</>
	);
}
