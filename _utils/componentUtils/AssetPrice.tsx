import { ScrapedAssetType } from "@customTypes/moodboardTypes";
import { Tooltip } from "antd";
import React from "react";

const PriceData: React.FC<{ scrapedData: ScrapedAssetType }> = ({ scrapedData }) => {
	if (scrapedData?.scrape?.available) {
		if (scrapedData?.scrape?.price) {
			return <> ${scrapedData?.scrape?.price}</>;
		} else if (scrapedData?.scrape?.prices) {
			return <> ${scrapedData?.scrape?.prices?.join("-")}</>;
		} else {
			return "-";
		}
	} else {
		return (
			<Tooltip title='Not Available'>
				<span>N/A</span>
			</Tooltip>
		);
	}
};

export default PriceData;
