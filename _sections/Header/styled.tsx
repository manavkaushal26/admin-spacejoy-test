import Button from "@components/Button";
import styled from 'styled-components';

export const PaddedDiv = styled.div`
	padding: ${({theme}) => `0 ${theme.spacing.xl}`};
`;

export const HorizontalListStyled = styled.ul<{ align: string }>`
	width: 100%;
	margin: 0;
	padding: 0;
	text-align: ${({ align = "center" }): string => align};
	li {
		line-height: normal;
		text-align: left;
		display: inline-block;
		list-style: none;
		margin: 0 1.5rem;
		&:first-child {
			margin-left: 0;
		}
		&:last-child {
			margin-right: 0;
		}
		span {
			display: block;
			font-weight: bold;
			padding-bottom: 2px;
			& + {
				small {
					color: ${({ theme }) => theme.colors.fc.dark2};
				}
			}
		}
		@media (max-width: 991px) {
			display: block;
			margin: 1.5rem 0;
			text-align: center;
		}
	}
`;

export const MobileHiddenStyled = styled.div`
	width: 100%;
	@media (max-width: 991px) {
		display: none;
	}
	img {
		padding: 20px 0 20px 0;
	}
`;

export const MobileVisibleStyled = styled.div`
	@media (min-width: 991px) {
		display: none;
	}
	img {
		padding: 20px 0 20px 0;
	}
`;

export const PaddedButton = styled(Button)`
	padding: 26px 0 26px 0;
`;

export const MobileNavVisibleStyled = styled.div`
	position: fixed;
	background-color: white;
	width: 100%;
	top: 50px;
	left: 0;
	right: 0;
	box-shadow: 0px 10px 10px 0px ${({ theme }) => theme.colors.mild.black};
	transition: all 0.2s ease-in-out;
	pointer-events: none;
	opacity: 0;
	&.active {
		opacity: 1;
		top: 60px;
		pointer-events: auto;
	}
	a {
		display: block;
	}
	img {
		display: inline-block;
	}
	@media (min-width: 990px) {
		display: block;
	}
`;

export const OverlayStyled = styled.div`
	position: relative;
	&:before {
		opacity: 0;
		content: "";
		position: fixed;
		z-index: -1;
		top: 60px;
		left: 0;
		right: 0;
		background: ${({ theme }) => theme.colors.mild.black};
		transition: opacity 0.2s ease-in-out;
	}
	&.active {
		&:before {
			opacity: 1;
			bottom: 0;
		}
	}
	@media (min-width: 991px) {
		display: none;
	}
`;
