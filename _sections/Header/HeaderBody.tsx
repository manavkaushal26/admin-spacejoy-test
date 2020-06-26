import Logo from "@components/Logo";
import SVGIcon from "@components/SVGIcon";
import User, { Role } from "@customTypes/userType";
import { logout } from "@utils/auth";
import { Col, Row, Typography } from "antd";
import { useRouter } from "next/router";
import React, { useState } from "react";
import Button from "@components/Button";
import ActiveLink from "./ActiveLink";
import navCenter from "./navCenter";
import navRight from "./navRight";
import {
	HorizontalListStyled,
	MobileHiddenStyled,
	MobileNavVisibleStyled,
	MobileVisibleStyled,
	OverlayStyled,
	PaddedButton,
	PaddedDiv,
} from "./styled";

const { Text } = Typography;

interface HeaderBody {
	authVerification: Partial<User>;
	pageName?: string;
}

const HeaderBody: React.FC<HeaderBody> = ({ authVerification, pageName }) => {
	const [mobileNavStatus, updateMobileNavStatus] = useState(false);

	const handleClick = () => updateMobileNavStatus(!mobileNavStatus);
	const Router = useRouter();
	return (
		<PaddedDiv>
			<Row>
				<MobileHiddenStyled>
					<Row justify="space-around" align="middle">
						<Col span={8}>
							<ActiveLink href="/launchpad" as="/launchpad">
								<Row align="middle" gutter={[4, 0]}>
									<Col>
										<Logo md />
									</Col>
									{pageName && (
										<>
											<Col>
												<Text type="secondary">|</Text>
											</Col>
											<Col>
												<Text type="secondary">{pageName}</Text>
											</Col>
										</>
									)}
								</Row>
							</ActiveLink>
						</Col>
						<Col span={16}>
							<Row justify="end" gutter={[32, 0]}>
								<Col>{navCenter(authVerification, Router.pathname)}</Col>
								<Col> {navRight(authVerification)}</Col>
							</Row>
						</Col>
					</Row>
				</MobileHiddenStyled>
			</Row>
			<Row>
				<MobileVisibleStyled>
					<Row justify="space-around">
						<Col span={18}>
							<ActiveLink href="/launchpad" as="/launchpad">
								<Row align="middle" gutter={[4, 0]}>
									<Col>
										<Logo md />
									</Col>
									{pageName && (
										<>
											<Col>
												<Text type="secondary">|</Text>
											</Col>
											<Col>
												<Text type="secondary">{pageName}</Text>
											</Col>
										</>
									)}
								</Row>
							</ActiveLink>
						</Col>
						<Col span={6}>
							<HorizontalListStyled align="right">
								<PaddedButton variant="clean" size="xs" fill="clean" onClick={handleClick}>
									<SVGIcon name="menu" width={20} height={20} fill={mobileNavStatus ? "#e84393" : ""} />
								</PaddedButton>
							</HorizontalListStyled>
						</Col>
					</Row>
				</MobileVisibleStyled>
				<MobileNavVisibleStyled className={`${mobileNavStatus ? "active" : ""}`}>
					<Row>
						<Col span={24} className={`${mobileNavStatus ? "active" : ""}`}>
							{navCenter(authVerification, Router.pathname)}
						</Col>
						<Col span={24} className={`${mobileNavStatus ? "active" : ""}`}>
							{navRight(authVerification)}
						</Col>
					</Row>
				</MobileNavVisibleStyled>

				<Row>
					<OverlayStyled className={mobileNavStatus ? "active" : ""} onClick={handleClick} />
				</Row>
			</Row>
		</PaddedDiv>
	);
};

HeaderBody.defaultProps = {
	authVerification: {
		name: "",
		role: Role.Guest,
	},
};

export default React.memo(HeaderBody);
