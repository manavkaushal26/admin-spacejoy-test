import Button from "@components/Button";
import { CustomDiv } from "@sections/Dashboard/styled";
import { redirectToLocation } from "@utils/authContext";
import { allowedRoles } from "@utils/constants";
import { Typography } from "antd";
import Link from "next/link";
import React from "react";

const redirectObj = {
	pathname: "/dashboard",
	url: "/dashboard",
};

function HeroSection({ authVerification }) {
	return (
		<CustomDiv>
			<CustomDiv py='0.5em' mx='auto' maxWidth='1200px' flexDirection='column' justifyContent='space-around'>
				<CustomDiv justifyContent='center' py='1em'>
					<Typography.Title level={2}>Spacejoy Admin</Typography.Title>
				</CustomDiv>
				<CustomDiv justifyContent='center' py='1em'>
					{allowedRoles.includes(authVerification.role) ? (
						<Button variant='primary' onClick={redirectToLocation.bind(null, redirectObj)} type='primary'>
							Go to Dashboard
						</Button>
					) : (
						<Link href='/auth/login'>
							<a href='/auth/login'>
								<Button variant='primary' type='primary'>
									Login
								</Button>
							</a>
						</Link>
					)}
				</CustomDiv>
			</CustomDiv>
		</CustomDiv>
	);
}

export default HeroSection;
