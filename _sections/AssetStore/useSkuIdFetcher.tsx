import { getSkuSocketEventNameApi, startSkuFetchingApi } from "@api/assetApi";
import { debounce } from "@utils/commonUtils";
import fetcher from "@utils/fetcher";
import { notification } from "antd";
import { useCallback, useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";

export interface SkuData {
	sku: string;
	title: string;
	img: string;
	price: number;
}

export const useSkuIdFetcher = () => {
	const [skuIds, setSkuIds] = useState<SkuData[]>([]);
	const [loading, setLoading] = useState(false);
	const [retailerUrl, setRetailerUrl] = useState("");
	const [socketEventName, setSocketEventName] = useState("");
	const [urlMightHaveProblem, setUrlMightHaveProblem] = useState({ hasProblem: false, message: "" });
	const socket = useMemo(() => io("https://socket.spacejoy.com"), []);

	const startFetching = async () => {
		const endPoint = startSkuFetchingApi();

		const response = await fetcher({ endPoint, method: "POST", body: { url: retailerUrl } });

		if (!(response.statusCode <= 300)) {
			setLoading(false);
			notification.error({ message: "Failed to initate Socket response for SKU Id" });
		}
	};

	useEffect(() => {
		if (socketEventName !== "") {
			socket.on(socketEventName, data => {
				if (data?.success) {
					if (data?.skuData?.length > 0) {
						setSkuIds(data?.skuData);
					}
				} else {
					setUrlMightHaveProblem({
						hasProblem: true,
						message: data?.message,
					});
				}
				setLoading(false);
			});
			startFetching();
		}
	}, [socketEventName]);

	const fetchSkuId = async () => {
		setLoading(true);

		const endPoint = getSkuSocketEventNameApi();
		const response = await fetcher({ endPoint, method: "POST", body: { url: retailerUrl, type: "sku" } });
		if (response.statusCode === 200) {
			setSocketEventName(response.data?.socketEvent);
		} else {
			notification.error({ message: "Failed to scrape SKU's. Please contact tech team" });
		}
	};

	useEffect(() => {
		if (retailerUrl !== "") {
			fetchSkuId();
		}
	}, [retailerUrl]);

	const debouncedSetUrl = useCallback(debounce(setRetailerUrl, 400), []);

	return { setRetailerUrl: debouncedSetUrl, loading, skuIds, urlMightHaveProblem };
};
