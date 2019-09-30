import Image from "@components/Image";
import SVGIcon from "@components/SVGIcon";
import PropTypes from "prop-types";
import React, { PureComponent } from "react";
import styled from "styled-components";

const ProfileInfoStyled = styled.div`
	position: absolute;
	left: 0;
	right: 0;
	bottom: -50px;
	background-image: linear-gradient(0deg, black, transparent);
	transition: bottom linear 0.25s;
	white-space: nowrap;
`;

const ProfileCardStyled = styled.div`
	position: relative;
	overflow: hidden;
	&:hover {
		${ProfileInfoStyled} {
			bottom: 0;
		}
	}
`;

const SocialStyled = styled.div`
	background: white;
	padding: 1rem;
	display: flex;
	justify-content: flex-end;
	a {
		margin-left: 1rem;
		.fb {
			&:hover path {
				fill: #4267b2;
			}
		}
		.tw {
			&:hover path {
				fill: #1ca1f1;
			}
		}
		.pi {
			&:hover path {
				fill: #e60023;
			}
		}
		.li {
			&:hover path {
				fill: #0077b5;
			}
		}
	}
`;

const DesignationStyled = styled.small`
	margin-top: 1rem;
	padding: 0 1rem;
	color: ${({ theme }) => theme.colors.primary2};
`;

const UserNameStyled = styled.h2`
	padding: 0 1rem;
	margin: 0 0 1rem;
	color: ${({ theme }) => theme.colors.fc.light1};
`;

const ProfileImageStyled = styled(Image)``;

class ProfileCard extends PureComponent {
	static Designation = ({ children }) => <DesignationStyled>{children}</DesignationStyled>;

	static UserName = ({ children }) => <UserNameStyled>{children}</UserNameStyled>;

	static Image = ({ source }) => <ProfileImageStyled src={source} />;

	static Social = ({ fb, tw, li, pi }) => (
		<SocialStyled>
			<a href={fb} height={50} target="_blank" rel="noopener noreferrer">
				<SVGIcon name="fb" className="fb" />
			</a>
			<a href={tw} height={50} target="_blank" rel="noopener noreferrer">
				<SVGIcon name="tw" className="tw" />
			</a>
			<a href={li} height={50} target="_blank" rel="noopener noreferrer">
				<SVGIcon name="li" className="li" />
			</a>
			<a href={pi} height={50} target="_blank" rel="noopener noreferrer">
				<SVGIcon name="pi" className="pi" />
			</a>
		</SocialStyled>
	);

	render() {
		const { children } = this.props;
		return (
			<ProfileCardStyled>
				<div className="image">{children[2]}</div>
				<ProfileInfoStyled>
					<div className="designation">{children[0]}</div>
					<div className="name">{children[1]}</div>
					<div className="social">{children[3]}</div>
				</ProfileInfoStyled>
			</ProfileCardStyled>
		);
	}
}

ProfileCard.propTypes = {
	children: PropTypes.node.isRequired
};

export default ProfileCard;
