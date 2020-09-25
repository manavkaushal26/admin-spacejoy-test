import GlobalStyle from "@theme/globalStyle";
import { Layout as AntdLayout } from "antd";
import React, { ReactNode } from "react";
import styled from "styled-components";
import Header from "../Header";

const dev = process.env.NODE_ENV !== "production";

const MainStyled = styled(AntdLayout)<{ isServer: boolean }>`
	padding-top: 70px;
	height: calc(100vh);
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
	children: ReactNode;
	pageName?: string;
}

const Layout: React.FC<LayoutProps> = ({ isServer, children, pageName }) => {
	return (
		<>
			<GlobalStyle />
			<Header pageName={pageName} />
			<MainStyled isServer={isServer} className={dev ? "client-server-identifier" : ""}>
				{children}
			</MainStyled>
		</>
	);
};

export default Layout;
