import Logo from "@components/Logo";
import SVGIcon from "@components/SVGIcon";
import useAuth from "@utils/authContext";
import { Col, Row, Typography } from "antd";
import { useRouter } from "next/router";
import React, { useState } from "react";
import ActiveLink from "./ActiveLink";
import navCenter from "./navCenter";
import NavRight from "./NaviRight";
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
	pageName?: string;
}

const HeaderBody: React.FC<HeaderBody> = ({ pageName }) => {
	const [mobileNavStatus, updateMobileNavStatus] = useState(false);
	const { user: authVerification, logout } = useAuth();
	const handleClick = () => updateMobileNavStatus(!mobileNavStatus);
	const Router = useRouter();
	return (
		<PaddedDiv>
			<Row style={{ height: "62px" }}>
				<MobileHiddenStyled>
					<Row justify='space-around' align='middle'>
						<Col span={8}>
							<ActiveLink href='/launchpad' as='/launchpad'>
								<Row align='middle' gutter={[4, 0]}>
									<Col>
										<Logo md />
									</Col>
									{pageName && (
										<>
											<Col>
												<Text type='secondary'>|</Text>
											</Col>
											<Col>
												<Text type='secondary'>{pageName}</Text>
											</Col>
										</>
									)}
								</Row>
							</ActiveLink>
						</Col>
						<Col span={16}>
							<Row justify='end' gutter={[32, 0]}>
								<Col>{navCenter(authVerification, Router.pathname)}</Col>
								<Col>
									<NavRight authVerification={authVerification} logout={logout} />
								</Col>
							</Row>
						</Col>
					</Row>
				</MobileHiddenStyled>
			</Row>
			<Row>
				<Col span={24}>
					<MobileVisibleStyled>
						<Row justify='space-around'>
							<Col span={20}>
								<ActiveLink href='/launchpad' as='/launchpad'>
									<Row align='middle' gutter={[4, 0]}>
										<Col>
											<Logo md />
										</Col>
										{pageName && (
											<>
												<Col>
													<Text type='secondary'>|</Text>
												</Col>
												<Col>
													<Text type='secondary'>{pageName}</Text>
												</Col>
											</>
										)}
									</Row>
								</ActiveLink>
							</Col>
							<Col span={4}>
								<Row justify='end'>
									<HorizontalListStyled align='right'>
										<PaddedButton variant='clean' size='xs' fill='clean' onClick={handleClick}>
											<SVGIcon name='menu' width={20} height={20} fill={mobileNavStatus ? "#e84393" : ""} />
										</PaddedButton>
									</HorizontalListStyled>
								</Row>
							</Col>
						</Row>
					</MobileVisibleStyled>
				</Col>
				<MobileNavVisibleStyled className={`${mobileNavStatus ? "active" : ""}`}>
					<Row>
						<Col span={24} className={`${mobileNavStatus ? "active" : ""}`}>
							{navCenter(authVerification, Router.pathname)}
						</Col>
						<Col span={24} className={`${mobileNavStatus ? "active" : ""}`}>
							<NavRight authVerification={authVerification} logout={logout} />
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

export default React.memo(HeaderBody);
