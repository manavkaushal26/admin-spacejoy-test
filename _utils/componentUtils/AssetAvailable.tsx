import { ScrapedAssetType } from "@customTypes/moodboardTypes";
import { Tooltip } from "antd";
import React from "react";

const AssetAvailability: React.FC<{ scrapedData: ScrapedAssetType }> = ({ scrapedData }) => {
	if (scrapedData?.scrape) {
		if (scrapedData.scrape?.available) {
			return <>Available</>;
		} else {
			return <>Out Of Stock</>;
		}
	} else {
		return (
			<Tooltip title='Not Available'>
				<span>N/A</span>
			</Tooltip>
		);
	}
};

export default AssetAvailability;
