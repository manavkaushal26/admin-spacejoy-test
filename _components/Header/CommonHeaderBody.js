import Button from "@components/Button";
import Logo from "@components/Logo";
import React from "react";
import styled from "styled-components";
import ActiveLink from "./ActiveLink";

const HorizontalListStyled = styled.ul`
	margin: 0;
	padding: 0;
	li {
		display: inline-block;
		list-style: none;
		margin-right: 2.5rem;
		&:last-child {
			margin-right: 0rem;
		}
	}
`;

const CommonHeaderBody = () => {
	return (
		<div className="container">
			<div className="grid">
				<div className="col-xs-3 align-left align-middle">
					<ActiveLink href="/" as="/">
						<Logo md />
					</ActiveLink>
				</div>
				<div className="col-xs-6 align-center align-middle">
					<nav>
						<HorizontalListStyled>
							<li>
								<ActiveLink href="/designProjects" as="/designProjects">
									Design Projects
								</ActiveLink>
							</li>
							<li>
								<ActiveLink href="/faq" as="/faq">
									FAQ
								</ActiveLink>
							</li>
							<li>
								<ActiveLink href="/pricing" as="/pricing">
									Pricing
								</ActiveLink>
							</li>
						</HorizontalListStyled>
					</nav>
				</div>
				<div className="col-xs-3 align-right align-middle">
					<nav>
						<HorizontalListStyled>
							<li>
								<ActiveLink href="/designMySpace" as="/designMySpace">
									Design My Space
								</ActiveLink>
							</li>
							<li>
								<Button type="danger" shape="round" onClick={() => {}}>
									Signin
								</Button>
							</li>
						</HorizontalListStyled>
					</nav>
				</div>
			</div>
		</div>
	);
};

export default CommonHeaderBody;
