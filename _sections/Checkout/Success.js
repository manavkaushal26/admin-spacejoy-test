import SVGIcon from "@components/SVGIcon";
import React from "react";
import styled from "styled-components";

const SuccessStyled = styled.div`
	background: ${({ theme }) => theme.colors.mild.green};
	color: ${({ theme }) => theme.colors.green};
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

export default function Success() {
	return (
		<SuccessStyled>
			<SVGIcon name="tick" height={45} width={45} />
			<h3>Order placed successfully</h3>
		</SuccessStyled>
	);
}
