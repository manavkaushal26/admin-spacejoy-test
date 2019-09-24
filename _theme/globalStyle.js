import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
	*,
	*:before,
	*:after {
		box-sizing: border-box;
	}
  body {
		color: ${({ theme }) => theme.colors.fc.dark1};
		a {
			text-decoration: none;
			color: ${({ theme }) => theme.colors.primary1};
		}

	}
`;
export default GlobalStyle;
