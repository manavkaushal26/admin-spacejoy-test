import { getAssetsInDesignApi } from "@api/designApi";
import Image from "@components/Image";
import fetcher from "@utils/fetcher";
import { Card, Col, notification, Row, Typography, Spin, Skeleton, Empty } from "antd";
import React, { useEffect, useState, useMemo } from "react";
import { getValueSafely } from "@utils/commonUtils";
import styled from "styled-components";

const { Text } = Typography;

interface Assetype {
	price: string;
	currency: string;
	retailer: string;
	_id: string;
	name: string;
	retailLink: string;
	cdn: string;
	quantity: number;
}

const ModifiedCard = styled(Card)`
	display: flex;
	flex-direction: column;
	flex-wrap: wrap;
	height: 100%;
	> .ant-card-cover {
		display: flex;
		justify-content: center;
		overflow: hidden;
	}
	> .ant-card-body {
		flex-grow: 1;
		width: 100%;
	}
`;

const DesignWiseSelectedProductCards: React.FC<{
	revisionRetainedAssets: string[];
	designId: string;
}> = ({ revisionRetainedAssets, designId }) => {
	const [assetList, setAssetList] = useState<Record<string, Assetype>>({});

	const [loading, setLoading] = useState(false);

	const fetchAssetsInDesign = async (): Promise<void> => {
		setLoading(true);
		const endPoint = getAssetsInDesignApi(designId);

		try {
			const response = await fetcher({ endPoint, method: "GET" });
			if (response.statusCode <= 300) {
				setAssetList(response.data.assets);
			}
		} catch (e) {
			notification.error({ message: "Failed to fetch assets" });
		}
		setLoading(false);
	};

	useEffect(() => {
		if (revisionRetainedAssets) {
			setAssetList({});
			fetchAssetsInDesign();
		}
	}, [revisionRetainedAssets, designId]);

	const retainedProducts = useMemo(() => {
		return revisionRetainedAssets.filter(retainedAsset => {
			return !!assetList[retainedAsset];
		});
	}, [assetList]);

	return !retainedProducts.length ? (
		<Col span={24}>
			<Row type="flex" justify="center">
				<Spin spinning={loading}>
					<Col span={24}>
						<Row type="flex" justify="center">
							<Empty description="No Products Selected from design" />
						</Row>
					</Col>
				</Spin>
			</Row>
		</Col>
	) : (
		<>
			{[...retainedProducts].map(assetId => {
				if (assetList[assetId]) {
					const { name, price, cdn, _id } = assetList[assetId];
					return (
						<Col sm={12} lg={12} xl={6}>
							<ModifiedCard
								key={_id}
								cover={
									<Image
										src={getValueSafely(
											() => cdn,
											process.env.NODE_ENV !== "production"
												? "v1581080070/admin/productImagePlaceholder.jpg"
												: "v1581080111/admin/productImagePlaceholder.jpg"
										)}
										autoAdjust
									/>
								}
							>
								<Card.Meta
									title={name}
									description={
										<Row>
											<Col span={24}>
												<Text type="secondary">Price:</Text>
											</Col>
											<Col span={24}>
												<Text strong>{price}</Text>
											</Col>
										</Row>
									}
								/>
							</ModifiedCard>
						</Col>
					);
				}
				return <Skeleton key="skeleton" active />;
			})}
		</>
	);
};

export default DesignWiseSelectedProductCards;
