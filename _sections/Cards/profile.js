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
	color: white;
	background-color: rgba(0, 0, 0, 0.2);
	transition: bottom linear 0.25s;
`;

const ProfileCardStyled = styled.div`
	position: relative;
	height: 400px;
	overflow: hidden;
	&:hover {
		${ProfileInfoStyled} {
			bottom: 0;
		}
	}
`;

const SocialStyled = styled.div`
	background: rgba(255, 255, 255, 0.85);
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

const DesignationStyled = styled.div`
	margin-top: 1rem;
	padding: 0 1rem;
`;

const UserNameStyled = styled.h2`
	padding: 0 1rem;
	margin: 0 0 1rem;
`;

const ProfileImageStyled = styled(Image)``;

class ProfileCard extends PureComponent {
	static Designation = ({ children }) => <DesignationStyled>{children}</DesignationStyled>;

	static UserName = ({ children }) => <UserNameStyled>{children}</UserNameStyled>;

	static Image = ({ source }) => <ProfileImageStyled src={source} />;

	static Social = ({ fb, tw, li, pi }) => (
		<SocialStyled>
			<a href={fb} height={20} target="_blank" rel="noopener noreferrer">
				<SVGIcon name="fb" className="fb" />
			</a>
			<a href={tw} height={20} target="_blank" rel="noopener noreferrer">
				<SVGIcon name="tw" className="tw" />
			</a>
			<a href={li} height={20} target="_blank" rel="noopener noreferrer">
				<SVGIcon name="li" className="li" />
			</a>
			<a href={pi} height={20} target="_blank" rel="noopener noreferrer">
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
