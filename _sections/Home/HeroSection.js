import Image from "@components/Image";
import React from "react";
import TextLoop from "react-text-loop";
import styled from "styled-components";
import { CustomDiv } from "@sections/Dashboard/styled";
import { Typography, Button } from "antd";
import { useRouter } from "next/router";

const HeroWrapperStyled = styled.section`
	display: flex;
	align-items: center;
	min-height: calc(100vh - 270px);
	margin-bottom: 2rem;
`;

const StackImageStyled = styled.div`
	img:nth-child(2) {
		margin-top: 2rem;
	}
	@media (max-width: 576px) {
		img:nth-child(2) {
			margin-top: 1rem;
		}
	}
`;

const HeroCardStyled = styled.section`
	position: relative;
	@media (max-width: 576px) {
		margin: 3rem 0;
	}
`;

const HeroText = styled.h1`
	font-size: 3rem;
	line-height: 3.75rem;
	font-family: inherit;
	span {
		display: block;
		margin-right: 1rem;
		&:last-child {
			font-family: "Airbnb Cereal App Medium";
		}
	}
	@media (max-width: 576px) {
		font-size: 3.5rem;
		line-height: 4rem;
		span {
			display: block;
		}
	}
`;

function HeroSection() {
	const Router = useRouter();

	const redirectToLogin = () => {
		Router.push({ pathname: "/auth/login" });
	};

	return (
		<CustomDiv>
			<CustomDiv
				py="0.5em"
				mx="auto"
				maxWidth="1200px"
				type="flex"
				flexDirection="column"
				justifyContent="space-around"
			>
				<CustomDiv type="flex" justifyContent="center" py="1em">
					<Typography.Title level={2}>Spacejoy Admin</Typography.Title>
				</CustomDiv>
				<CustomDiv justifyContent="center" type="flex" py="1em">
					<Button onClick={redirectToLogin} type="primary">
						Login
					</Button>
				</CustomDiv>
			</CustomDiv>
		</CustomDiv>
	);
}

export default HeroSection;
