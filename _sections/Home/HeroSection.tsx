import Button from "@components/Button";
import { CustomDiv } from "@sections/Dashboard/styled";
import { redirectToLocation } from "@utils/auth";
import { allowedRoles } from "@utils/constants";
import { Typography } from "antd";
import { useRouter } from "next/router";
import React from "react";

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
						<Button variant="primary" onClick={redirectToLocation.bind(null, redirectObj)} type="primary">
							Go to Dashboard
						</Button>
					) : (
						<Button variant="primary" onClick={redirectToLogin} type="primary">
							Login
						</Button>
					)}
				</CustomDiv>
			</CustomDiv>
		</CustomDiv>
	);
}

export default HeroSection;
