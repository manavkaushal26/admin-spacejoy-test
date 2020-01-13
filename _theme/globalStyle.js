import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  body {
		color: ${({ theme }) => theme.colors.fc.dark1};
		h1, h2, h3, h4, h5, h6 {
			font-family: "AirbnbCerealBold";
		}
		a {
			text-decoration: none;
			color: ${({ theme }) => theme.colors.primary1};
		}
		.text-normal{
			font-weight:normal;
			font-family: "AirbnbCerealBook";
		}
		.text-primary1{
			color: ${({ theme }) => theme.colors.primary1};
		}
		.text-primary2{
			color: ${({ theme }) => theme.colors.primary2};
		}
		.text-red{
			color: ${({ theme }) => theme.colors.red};
		}
		.text-green{
			color: ${({ theme }) => theme.colors.green};
		}
		.text-yellow{
			color: ${({ theme }) => theme.colors.yellow};
		}
		.text-blue{
			color: ${({ theme }) => theme.colors.blue};
		}
		.stroke-primary1{
			stroke: ${({ theme }) => theme.colors.primary1};
		}
		.stroke-primary2{
			stroke: ${({ theme }) => theme.colors.primary2};
		}
		.stroke-red{
			stroke: ${({ theme }) => theme.colors.red};
		}
		.stroke-green{
			stroke: ${({ theme }) => theme.colors.green};
		}
		.stroke-teal{
			stroke: ${({ theme }) => theme.colors.teal};
		}
		.stroke-blue{
			stroke: ${({ theme }) => theme.colors.blue};
		}
		.fill-primary1{
			fill: ${({ theme }) => theme.colors.primary1};
		}
		.fill-primary2{
			fill: ${({ theme }) => theme.colors.primary2};
		}
		.fill-red{
			fill: ${({ theme }) => theme.colors.red};
		}
		.fill-green{
			fill: ${({ theme }) => theme.colors.green};
		}
		.fill-teal{
			fill: ${({ theme }) => theme.colors.teal};
		}
		.fill-blue{
			fill: ${({ theme }) => theme.colors.blue};
		}
		.text-center {
			text-align: center;
			justify-content: center;
		}
		.text-left {
			text-align: left;
		}
		.text-right {
			text-align: right;
		}
		.h-flip{
			transform: rotate(180deg);
		}
		.text-ellipsis{
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}
		.affix{
			position:sticky;
			&.bottom{
				bottom:0;
			}
		}
		.progress {
			transform: rotate(-90deg);
		}
		.loading{
			.loader-ring{
				display:flex;
			}
		}
		.loader-ring {
			position: fixed;
			left: 50%;
			top: 50%;
			height: 50px;
			width: 50px;
			margin-top: -25px;
			margin-left: -25px;
			display:none;
			justify-content: center;
			align-items: center;
			backdrop-filter: blur(5px);
			z-index: 100;
			border-radius: 25px;
			box-shadow:0 0 6px ${({ theme }) => theme.colors.mild.black};
		}
	}
`;

export default GlobalStyle;
