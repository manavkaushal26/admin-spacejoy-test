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
	fill?: {
		retailLink?: string;
	};
}

export const useSkuIdFetcher = () => {
	const [skuIds, setSkuIds] = useState<SkuData[]>([]);
	const [loading, setLoading] = useState(false);
	const [retailerUrl, setRetailerUrl] = useState("");
	const [socketEventName, setSocketEventName] = useState("");
	const [urlMightHaveProblem, setUrlMightHaveProblem] = useState({
		hasProblem: false,
		message: "",
		fill: { retailLink: null },
	});
	const socket = useMemo(() => io("https://socket.spacejoy.com"), []);
	const startFetching = async () => {
		const endPoint = startSkuFetchingApi();
		const response = await fetcher({
			endPoint,
			method: "POST",
			body: { socketId: socket.id, url: retailerUrl },
		});

		if (!(response.statusCode <= 300)) {
			setLoading(false);
			notification.error({ message: response.data?.message || "Failed to initate Socket response for SKU Id" });
		}
	};

	const resetState = () => {
		setSkuIds([]);
		setSocketEventName("");
		setUrlMightHaveProblem({ hasProblem: false, message: "", fill: { retailLink: null } });
		setLoading(false);
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
						fill: { retailLink: data?.fill?.retailLink },
					});
				}
				setLoading(false);
			});
			startFetching();
		}
		return () => {
			socket.off(socketEventName);
		};
	}, [socketEventName]);

	const fetchSkuId = async (urlParam?: string) => {
		resetState();
		setLoading(true);
		const endPoint = getSkuSocketEventNameApi();
		const response = await fetcher({ endPoint, method: "POST", body: { url: urlParam || retailerUrl, type: "sku" } });
		if (response.statusCode === 200) {
			setSocketEventName(response.data?.socketEvent);
		} else {
			notification.error({ message: response.data?.message || "Failed to scrape SKU's. Please contact tech team" });
		}
	};

	useEffect(() => {
		return () => {
			resetState();
		};
	}, [retailerUrl]);

	const debouncedSetUrl = useCallback(debounce(setRetailerUrl, 400), []);

	return { setRetailerUrl: debouncedSetUrl, loading, skuIds, urlMightHaveProblem, fetchSkuId };
};
