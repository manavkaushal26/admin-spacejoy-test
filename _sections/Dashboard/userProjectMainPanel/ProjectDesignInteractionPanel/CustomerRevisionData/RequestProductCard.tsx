import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { getMoodboardApi } from "@api/designApi";
import fetcher from "@utils/fetcher";
import { Button, Card, Col, notification, Popconfirm, Row, Tooltip, Typography } from "antd";
import React from "react";

const { Text } = Typography;

const RequestProductCard: React.FC<{
	designId: string;
	url: string;
	comment: string;
	id: string;
	deleteCard: (id: string) => void;
}> = ({ url, comment, id, deleteCard, designId }) => {
	const addAsset = async (): Promise<void> => {
		const endpoint = getMoodboardApi(designId);
		try {
			const response = await fetcher({
				endPoint: endpoint,
				method: "POST",
				body: {
					data: {
						assets: [],
						assetUrls: [url],
					},
				},
			});
			if (response.statusCode <= 300) {
				notification.success({ message: "Product URL added successfully" });
			} else {
				notification.error({ message: "Failed to add Missing Asset" });
			}
		} catch (e) {
			notification.error({ message: "Failed to add Missing Asset" });
		}
	};

	return (
		<Card
			actions={[
				<Popconfirm key='missing' title='Are you sure?' onConfirm={addAsset}>
					<Tooltip title='Add as Missing asset'>
						<Button
							onClick={(e): void => {
								e.stopPropagation();
							}}
							block
							type='link'
							icon={<PlusOutlined />}
						/>
					</Tooltip>
				</Popconfirm>,
				<Popconfirm
					title='Are you sure?'
					key='delete'
					onConfirm={(e): void => {
						e.stopPropagation();
						deleteCard(id);
					}}
				>
					<Tooltip title='Delete'>
						<Button
							block
							onClick={(e): void => {
								e.stopPropagation();
							}}
							type='link'
							icon={<DeleteOutlined />}
						/>
					</Tooltip>
				</Popconfirm>,
			]}
		>
			<Card.Meta
				title={
					<>
						<Row gutter={[4, 4]}>
							<Col>
								<Text type='secondary'>
									<small>URL:</small>
								</Text>
							</Col>
							<Col>
								<a target='_blank' rel='noopener noreferrer' href={url}>
									{url}
								</a>
							</Col>
						</Row>
					</>
				}
				description={
					<Row gutter={[4, 4]}>
						<Col>
							<Text type='secondary'>
								<small>Comment:</small>
							</Text>
						</Col>
						<Col>{comment || "No Comment"}</Col>
					</Row>
				}
			/>
		</Card>
	);
};

export default RequestProductCard;
