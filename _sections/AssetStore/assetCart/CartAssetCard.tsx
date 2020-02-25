import Image from "@components/Image";
import { AssetType } from "@customTypes/moodboardTypes";
import { getValueSafely } from "@utils/commonUtils";
import { Button, Icon, message, Popconfirm, Typography, Row, Col, Card } from "antd";
import { useRouter } from "next/router";
import React, { useState } from "react";
import styled, { FlattenSimpleInterpolation } from "styled-components";
import { activeShadows } from "../styled";

const { Text } = Typography;

interface CartAssetCard {
	projectId: string;
	designId: string;
	asset: Partial<AssetType>;
	type: "primary" | "recommendation";
	onRecommendationClick?: (entryId: string) => void;
	entryId?: string;
	addRemoveAsset: (action: "ADD" | "DELETE", assetId: string, assetEntryId?: string) => void;
	currentlySelectingRecommendation?: boolean;
}

const BorderlessAssetCard = styled(Card)<{ active?: boolean }>`
	border: none;
	background: transparent;
	:hover {
		${activeShadows}
	}

	${({ active }): FlattenSimpleInterpolation => (active ? activeShadows : null)};

	> .ant-card-body {
		padding: 0px;
		margin: 1rem 0;
	}
`;

const StyledButton = styled(Button)`
	i.anticon {
		display: flex;
		justify-content: center;
		align-content: center;
	}
`;

const CartAssetCard: (props: CartAssetCard) => JSX.Element = ({
	projectId,
	designId,
	asset,
	type,
	onRecommendationClick,
	entryId,
	addRemoveAsset,
	currentlySelectingRecommendation,
}) => {
	const [loading, setLoading] = useState<boolean>(false);

	const Router = useRouter();

	const onClick = (): void => {
		setLoading(true);
		if (type === "primary") {
			addRemoveAsset("DELETE", entryId);
		}
		if (type === "recommendation") {
			addRemoveAsset("DELETE", asset._id, entryId);
		}
		message.success(type === "primary" ? "Primary Asset Removed" : "Recommendation Removed");
		setLoading(false);
	};

	const redirect = (e, typeOfCard: string): void => {
		if (typeOfCard === "primary" && !e.target.className.startsWith("ant"))
			Router.push(
				{ pathname: "/assetstore", query: { designId, assetEntryId: entryId, projectId } },
				`/assetstore/pid/${projectId}/did/${designId}/aeid/${entryId}`
			);
	};

	return (
		<Col onClick={(e): void => redirect(e, type)}>
			<BorderlessAssetCard id="cartCard" hoverable={type === "primary"} active={currentlySelectingRecommendation}>
				<Row gutter={[8, 4]} type="flex" align="middle">
					<Col span={8}>
						<Image
							width="100%"
							src={`q_80,h_185/${getValueSafely(
								() => asset.cdn,
								process.env.NODE_ENV === "production"
									? "v1581080070/admin/productImagePlaceholder.jpg"
									: "v1581080111/admin/productImagePlaceholder.jpg"
							)}`}
						/>
					</Col>
					<Col span={16} style={{ padding: "1rem 0px" }}>
						<Row gutter={[8, 4]}>
							<Col span={24}>
								<Text style={{ width: "100%" }} strong ellipsis>
									{getValueSafely(() => asset.name, "N/A")}
								</Text>
							</Col>
							<Col span={24}>
								<Row type="flex" gutter={[4, 4]}>
									<Col>
										<Icon type="link" />
									</Col>
									<Col>
										<Text type="secondary">
											<a target="_blank" rel="noopener noreferrer" href={getValueSafely(() => asset.retailLink, "#")}>
												{getValueSafely(() => asset.retailer.name, "N/A")}
											</a>
										</Text>
									</Col>
								</Row>
							</Col>
							<Col span={24}>
								<Row type="flex" gutter={[4, 4]}>
									<Col>
										<Icon type="dollar-circle" theme="filled" />
									</Col>
									<Col>
										<Text strong>{asset.price}</Text>
									</Col>
								</Row>
							</Col>
							<Col span={18}>
								{type === "primary" && (
									<Button
										block
										onClick={(e): void => {
											e.stopPropagation();
											onRecommendationClick(entryId);
										}}
									>
										Recommendations
									</Button>
								)}
							</Col>
							<Col span={5}>
								<Popconfirm
									placement="left"
									onConfirm={onClick}
									title="Are you sure?"
									okText="Yes"
									disabled={currentlySelectingRecommendation}
									cancelText="Cancel"
								>
									<StyledButton
										disabled={currentlySelectingRecommendation}
										loading={loading}
										icon="delete"
										onClick={(e): void => e.stopPropagation()}
										type="danger"
										block
									/>
								</Popconfirm>
							</Col>
						</Row>
					</Col>
				</Row>
			</BorderlessAssetCard>
		</Col>
	);
};
export default CartAssetCard;
