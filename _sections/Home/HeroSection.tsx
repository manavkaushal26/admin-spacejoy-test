import Image from "@components/Image";
import React from "react";
import TextLoop from "react-text-loop";
import styled from "styled-components";
import { CustomDiv } from "@sections/Dashboard/styled";
import { Typography, Button } from "antd";
import { useRouter } from "next/router";
import { redirectToLocation } from "@utils/auth";
import { allowedRoles } from "@utils/constants";

const redirectObj = {
	pathname: "/dashboard",
	query: {},
	url: "/dashboard"
};

function HeroSection({ authVerification }) {
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
					{allowedRoles.includes(authVerification.role) ? (
						<Button onClick={redirectToLocation.bind(null, redirectObj)} type="primary">
							Go to Dashboard
						</Button>
					) : (
						<Button onClick={redirectToLogin} type="primary">
							Login
						</Button>
					)}
				</CustomDiv>
			</CustomDiv>
		</CustomDiv>
	);
}

export default HeroSection;
