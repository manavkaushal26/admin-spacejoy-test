import User, { Role } from "@customTypes/userType";
import GlobalStyle from "@theme/globalStyle";
import React, { ReactNode } from "react";
import styled from "styled-components";
import Header from "../Header";

const dev = process.env.NODE_ENV !== "production";

const MainStyled = styled.main<{ isServer: boolean }>`
	background-color: #f2f4f6;
	padding-top: 62px;
	min-height: calc(100vh - 62px);
	position: relative;
	&.client-server-identifier {
		&:after {
			content: "";
			position: fixed;
			z-index: 100;
			top: 0.5rem;
			left: 0.5rem;
			height: 0.5rem;
			width: 0.5rem;
			border-radius: 0.5rem;
			background: ${({ isServer, theme }) => (isServer ? theme.colors.red : theme.colors.green)};
		}
	}
`;
interface LayoutProps {
	isServer?: boolean | undefined;
	authVerification?: Partial<User>;
	children: ReactNode;
	pageName?: string;
}

const Layout: React.FC<LayoutProps> = ({ isServer, authVerification, children, pageName }) => {
	return (
		<>
			<GlobalStyle />
			<Header authVerification={authVerification} pageName={pageName} />
			<MainStyled isServer={isServer} className={dev ? "client-server-identifier" : ""}>
				{children}
			</MainStyled>
		</>
	);
};

Layout.defaultProps = {
	isServer: undefined,
	authVerification: {
		role: Role.Guest,
		name: "",
	},
};

export default Layout;
