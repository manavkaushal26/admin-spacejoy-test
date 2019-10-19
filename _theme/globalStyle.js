import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  body {
		color: ${({ theme }) => theme.colors.fc.dark1};
		a {
			text-decoration: none;
			color: ${({ theme }) => theme.colors.primary1};
		}
		small{
			font-size: 85%;
		}
	}
`;
export default GlobalStyle;
