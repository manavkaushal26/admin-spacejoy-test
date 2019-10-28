import Button from "@components/Button";
import SVGIcon from "@components/SVGIcon";
import React from "react";
import styled from "styled-components";

const ConceptToolBarStyled = styled.div`
	text-align: center;
	svg {
		&:hover {
			path {
				fill: ${({ theme }) => theme.colors.accent};
			}
		}
		path {
			fill: ${({ theme }) => theme.colors.fc.dark2};
		}
	}
`;

export default function ConceptToolBar() {
	return (
		<ConceptToolBarStyled>
			<Button fill="clean">
				<SVGIcon name="heart" height={15} width={15} />
			</Button>
			<Button fill="clean">
				<SVGIcon name="download" height={15} width={15} />
			</Button>
			<Button fill="clean">
				<SVGIcon name="note" height={15} width={15} />
			</Button>
		</ConceptToolBarStyled>
	);
}
