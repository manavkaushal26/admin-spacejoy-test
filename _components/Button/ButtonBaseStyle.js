import styled from "styled-components";

const ButtonBase = styled.button`
	padding: 0;
	display: inline-block;
	cursor: pointer;
	user-select: none;
	touch-action: manipulation;
	-webkit-appearance: none;
	outline: none;
	white-space: nowrap;
	border: none;
	position: relative;
	text-align: unset;
	background: transparent;
`;

const ButtonNormalStyled = styled(ButtonBase)`
	font-size: 1rem;
`;

export { ButtonBase, ButtonNormalStyled };
