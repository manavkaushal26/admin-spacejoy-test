import React from "react";
import styled from "styled-components";

const DividerStyled = styled.div`
	margin: 2rem 0;
	height: 1px;
	background: ${({ theme }) => theme.colors.bg.light2};
`;

function Divider() {
	return <DividerStyled />;
}

export default Divider;
