import { scrapeAssetById } from "@api/scraperApi";
import { ScrapedAssetType } from "@customTypes/moodboardTypes";
import { pusherConfig } from "@utils/config";
import fetcher from "@utils/fetcher";
import { notification } from "antd";
import Pusher from "pusher-js";
import { useEffect, useState } from "react";

const pusher = new Pusher(pusherConfig.key, {
	cluster: pusherConfig.cluster,
});

const channelNameGenerator = () => {
	const randomNumber = Math.floor(Math.random() * 10000) + 100;
	return "scrape-" + randomNumber;
};

const pusherChannel = "scrape-" + channelNameGenerator();

interface useScraper {
	(key: string, assetIds: string[], immediate?: boolean): {
		scrapedData: Record<string, ScrapedAssetType>;
		error: boolean;
		scraping: boolean;
		triggerScraping: () => void;
	};
}
export const useScraper: useScraper = (key, assetIds, immediate) => {
	const [scrapedData, setScrapedData] = useState({});
	const [scraping, setScraping] = useState(false);
	const [error, setError] = useState(false);
	const [startScraping, setStartScraping] = useState<boolean>(false);

	const initPusher = () => {
		const channel = pusher.subscribe(pusherChannel);
		channel.bind("Scrape:Response:Single", data => {
			setScrapedData(prevData => {
				return { ...prevData, ...{ [data._id]: data } };
			});
			setTimeout(() => {
				setScraping(false);
			}, 5000);
		});

		channel.bind("Scrape:Error", () => {
			setScraping(false);
			setError(true);
		});
	};

	const fetchCurrentDataForAssets = async () => {
		setScraping(true);
		initPusher();

		const endPoint = scrapeAssetById();
		try {
			if (assetIds.length) {
				const response = await fetcher({ endPoint, method: "POST", body: { ids: assetIds, requestId: pusherChannel } });
				if (response.statusCode > 300) {
					throw new Error();
				}
			}
		} catch (e) {
			notification.error({ message: "Failed to get scraped data" });
			setScraping(false);
		}
	};

	useEffect(() => {
		fetchCurrentDataForAssets();
	}, [startScraping]);

	useEffect(() => {
		if (startScraping) {
			setStartScraping(false);
		}
	}, [startScraping]);

	const triggerScraping = () => {
		setStartScraping(true);
	};
	useEffect(() => {
		if (immediate && !scrapedData) triggerScraping();
	}, [immediate]);

	return { scrapedData, error, scraping, triggerScraping };
};
