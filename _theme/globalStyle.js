import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  body {
	  	min-height: 100vh;
		color: ${({ theme }) => theme.colors.fc.dark1};
		h1, h2, h3, h4, h5, h6 {
			font-family: "Airbnb Cereal App Medium";
		}
		a {
			text-decoration: none;
			color: ${({ theme }) => theme.colors.accent};
		}
		small{
			font-size: 85%;
		}
	}
`;
export default GlobalStyle;
