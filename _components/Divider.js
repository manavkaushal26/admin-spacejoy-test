import React from "react";
import styled from "styled-components";

const DividerStyled = styled.div`
	margin: 2rem 0;
	height: 1px;
	background: #ececec;
`;

function Divider() {
	return <DividerStyled />;
}

export default Divider;
