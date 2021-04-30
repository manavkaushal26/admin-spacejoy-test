import Image from "@components/Image";
import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";

const SectionHeaderStyled = styled.div`
	margin: ${({ size }) => `${size > 3 ? 3 : size}rem`} 0;
	text-align: ${({ align }) => align};
	color: ${({ theme, light }) => (light ? theme.colors.white : theme.colors.fc.dark1)};
	h1,
	h2,
	h3,
	h4,
	h5,
	h6 {
		margin: ${({ size }) => `${size === 0 ? 0 : "0.35rem 0"}`};
		line-height: ${({ mini }) => (mini ? "1.1rem" : "auto")};
		& + {
			span,
			small {
				color: ${({ theme, light }) => (light ? theme.colors.fc.light2 : theme.colors.fc.dark2)};
			}
		}
	}
`;

const MiniGrid = styled.div`
	display: flex;
	justify-content: ${({ align }) => (align === "center" ? "center" : "normal")};
`;

const ImageWrapper = styled.div`
	margin-right: 1rem;
	align-self: center;
	flex-basis: 40px;
`;
const TextWrapper = styled.div``;

function SectionHeader({ title, description, icon, size, hgroup, align, mini, light }) {
	return (
		<SectionHeaderStyled size={size} mini={mini} light={light} align={align} className='sectionHeader'>
			<MiniGrid align={align}>
				{icon && (
					<ImageWrapper>
						<Image src={icon} width='100%' alt={title} />
					</ImageWrapper>
				)}
				<TextWrapper>
					{hgroup === 1 && <h1>{title}</h1>}
					{hgroup === 2 && <h2>{title}</h2>}
					{hgroup === 3 && <h3>{title}</h3>}
					{hgroup === 4 && <h4>{title}</h4>}
					{hgroup === 5 && <h5>{title}</h5>}
					{hgroup === 6 && <h6>{title}</h6>}
					{description && (mini ? <small>{description}</small> : <span>{description}</span>)}
				</TextWrapper>
			</MiniGrid>
		</SectionHeaderStyled>
	);
}

SectionHeader.defaultProps = {
	description: "",
	icon: "",
	size: 3,
	hgroup: 2,
	mini: false,
	light: false,
	align: "left",
};

SectionHeader.propTypes = {
	title: PropTypes.string.isRequired,
	description: PropTypes.string,
	icon: PropTypes.string,
	size: PropTypes.number,
	hgroup: PropTypes.number,
	mini: PropTypes.bool,
	light: PropTypes.bool,
	align: PropTypes.string,
};

export default SectionHeader;
