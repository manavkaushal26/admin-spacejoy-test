import { getAssetHistoryApi } from "@api/assetApi";
import { AssetHistory, HumanizeAssetHistoryType } from "@customTypes/assetInfoTypes";
import fetcher from "@utils/fetcher";
import { Card, Col, Drawer, Empty, notification, Row, Timeline, Typography } from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";

const { Text, Paragraph } = Typography;

interface AssetHistoryComponent {
	assetId: string;
	open: boolean;
	closeModal: () => void;
}

const AssetHistoryDrawer: React.FC<AssetHistoryComponent> = ({ assetId, open, closeModal }) => {
	const [assetHistory, setAssetHistory] = useState<AssetHistory[]>([]);

	const fetchAndPopulateHistory = async (): Promise<void> => {
		const endPoint = `${getAssetHistoryApi(assetId)}?sort=-1`;
		try {
			const response = await fetcher({ endPoint, method: "GET" });
			if (response) {
				setAssetHistory(response.data.data);
			} else {
				notification.error({ message: "Failed to fetch Asset history" });
			}
		} catch (e) {
			notification.error({ message: "Failed to fetch Asset history" });
		}
	};

	useEffect(() => {
		if (assetId) {
			fetchAndPopulateHistory();
		}
	}, [assetId, open]);

	return (
		<Drawer
			title={`${assetHistory[0]?.assetName || "Asset"} Edit history`}
			visible={open}
			onClose={() => closeModal()}
			width={360}
		>
			<Row>
				{assetHistory?.length ? (
					<Col span={24}>
						<Timeline mode='left'>
							{assetHistory.map(historyItem => {
								return (
									<Timeline.Item key={historyItem._id}>
										<Card size='small'>
											<Row gutter={[8, 8]}>
												<Col span={24}>
													<Row gutter={[4, 4]}>
														<Col span={24}>
															<Text strong>Name of Artist</Text>
														</Col>
														<Col span={24}>{historyItem.userName}</Col>
													</Row>
												</Col>
												<Col span={24}>
													<Row gutter={[4, 4]}>
														<Col span={24}>
															<Text strong>Action</Text>
														</Col>
														<Col span={24}>{HumanizeAssetHistoryType[historyItem.type]}</Col>
													</Row>
												</Col>
												<Col span={24}>
													<Row gutter={[4, 4]}>
														<Col span={24}>
															<Text strong>Update payload</Text>
														</Col>
														<Col span={24}>
															<Paragraph code ellipsis={{ rows: 2, expandable: true }}>
																{JSON.stringify(JSON.parse(historyItem.meta), null, 2)}
															</Paragraph>
														</Col>
													</Row>
												</Col>
												<Col span={24}>
													<Row gutter={[4, 4]}>
														<Col span={24}>
															<Text strong>At</Text>
														</Col>
														<Col span={24}>{moment(historyItem.createdAt).format("MM-DD-YYYY hh:mm a")}</Col>
													</Row>
												</Col>
											</Row>
										</Card>
									</Timeline.Item>
								);
							})}
						</Timeline>
					</Col>
				) : (
					<Col span={24}>
						<Empty description='No history found' />
					</Col>
				)}
			</Row>
		</Drawer>
	);
};

export default AssetHistoryDrawer;
