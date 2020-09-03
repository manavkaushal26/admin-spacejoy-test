import { scrapeAssetById } from "@api/scraperApi";
import { ScrapedAssetType } from "@customTypes/moodboardTypes";
import { getValueSafely } from "@utils/commonUtils";
import { page } from "@utils/config";
import fetcher from "@utils/fetcher";
import { notification } from "antd";
import { useEffect, useState } from "react";
import useWebSocket from "react-use-websocket";
import { useLocalStorage } from "./useLocalStorage";

const returnSocketId = (lastMessage: MessageEvent) => {
	if (lastMessage.data.includes("42")) return getValueSafely(() => JSON.parse(lastMessage.data.replace("42", "")), "");
	return [];
};

interface useScraper {
	(key: string, assetIds: string[], immediate?: boolean): {
		scrapedData: Record<string, ScrapedAssetType>;
		error: boolean;
		scraping: boolean;
		triggerScraping: () => void;
	};
}
export const useScraper: useScraper = (key, assetIds, immediate) => {
	const [scrapeURL, setScrapeURL] = useState(null);
	const [requestId, setRequestId] = useState("");
	const [scrapedData, setScrapedData] = useLocalStorage<Record<string, ScrapedAssetType>>(key, null);
	const [scraping, setScraping] = useState(false);
	const [error, setError] = useState(false);

	const { lastMessage } = useWebSocket(scrapeURL);

	const fetchCurrentDataForAssets = async () => {
		setScraping(true);

		const endPoint = scrapeAssetById();
		try {
			if (assetIds.length) {
				const response = await fetcher({ endPoint, method: "POST", body: { ids: assetIds, requestId } });
				if (response.statusCode <= 300) {
					notification.info({ message: "Scraping products data. This might take a while" });
				} else {
					throw new Error();
				}
			}
		} catch (e) {
			notification.error({ message: "Failed to get scraped data" });
			setScraping(false);
		}
	};

	useEffect(() => {
		if (requestId) fetchCurrentDataForAssets();
	}, [requestId]);

	const triggerScraping = () => {
		setScrapeURL(page.WssUrl);
	};
	useEffect(() => {
		if (immediate && !scrapedData) triggerScraping();
	}, [immediate]);

	useEffect(() => {
		try {
			if (!!assetIds && !!lastMessage && scrapeURL !== "") {
				const [event, data] = returnSocketId(lastMessage);
				if (event === "OAuthCrossLogin.CONNECTION") {
					setRequestId(prevState => data?.id || prevState);
				} else if (event === "Scrape:Response") {
					setScrapedData(data);
					setScrapeURL(null);
					setRequestId(null);
					setScraping(false);
				} else if (event === "Scrape:Error") {
					setRequestId(null);

					setScraping(false);
					setError(true);
				}
			}
		} catch (e) {
			setRequestId(null);

			setScrapeURL(null);
			setScraping(false);
			setError(true);
		}
	}, [assetIds, lastMessage]);

	return { scrapedData, error, scraping, triggerScraping };
};
