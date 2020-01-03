import Logo from "@components/Logo";
import SVGIcon from "@components/SVGIcon";
import React, { useState } from "react";
import { Row, Col } from "antd";
import ActiveLink from "./ActiveLink";
import {
	HorizontalListStyled,
	PaddedDiv,
	MobileHiddenStyled,
	MobileNavVisibleStyled,
	OverlayStyled,
	PaddedButton,
	MobileVisibleStyled
} from "./styled";
import navRight from "./navRight";
import navCenter from "./navCenter";
import User, { Role } from "@customTypes/userType";

interface HeaderBody {
	authVerification: Partial<User>;
}

const HeaderBody = ({ authVerification }: HeaderBody) => {
	const [mobileNavStatus, updateMobileNavStatus] = useState(false);

	const handleClick = () => updateMobileNavStatus(!mobileNavStatus);

	return (
		<PaddedDiv>
			<Row>
				<MobileHiddenStyled>
					<Row type="flex" justify="space-around" align="middle">
						<Col span={8}>
							<a href="/">
								<Logo md />
							</a>
						</Col>
						<Col span={13}>{navCenter(authVerification)}</Col>
						<Col span={3}> {navRight(authVerification)}</Col>
					</Row>
				</MobileHiddenStyled>
			</Row>
			<Row>
				<MobileVisibleStyled>
					<Row type="flex" justify="space-around">
						<Col span={18}>
							<ActiveLink href="/" as="/">
								<Logo md />
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
		role: Role.Guest
	}
};

export default React.memo(HeaderBody);
