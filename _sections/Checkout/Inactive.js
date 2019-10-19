import CTA from "@sections/CTA";
import React from "react";
import styled from "styled-components";

const InactiveStyled = styled.div`
	background: ${({ theme }) => theme.colors.mild.red};
	padding: 50px 0;
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
`;

export default function Inactive() {
	return (
		<InactiveStyled>
			<CTA
				variant="primary"
				shape="rounded"
				size="lg"
				action="StartFreeTrial"
				label="CheckoutInactiveState"
				event="StartFreeTrial"
				data={{ sectionName: "CheckoutInactiveState" }}
			/>
		</InactiveStyled>
	);
}
