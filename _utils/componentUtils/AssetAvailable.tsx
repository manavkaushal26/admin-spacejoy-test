import { ScrapedAssetType } from "@customTypes/moodboardTypes";
import { Tooltip } from "antd";
import React from "react";
import styled from "styled-components";

const ColouredSpan = styled.span<{ bg: string }>`
	padding: 0.2rem;
	font-weight: 600;
	background: ${({ theme, bg }) => {
		if (bg === "green") {
			return theme.colors.mild.green;
		} else if (bg === "red") {
			return theme.colors.mild.red;
		} else if (bg === "yellow") {
			return theme.colors.mild.yellow;
		}
	}};
`;
const AssetAvailability: React.FC<{ scrapedData: ScrapedAssetType }> = ({ scrapedData }) => {
	if (scrapedData?.scrape) {
		if (scrapedData.scrape?.available) {
			return <ColouredSpan bg='green'>Available</ColouredSpan>;
		} else {
			return <ColouredSpan bg='red'>Out Of Stock</ColouredSpan>;
		}
	} else {
		return (
			<Tooltip title='Not Available'>
				<ColouredSpan bg='blue'>N/A</ColouredSpan>
			</Tooltip>
		);
	}
};

export default AssetAvailability;
