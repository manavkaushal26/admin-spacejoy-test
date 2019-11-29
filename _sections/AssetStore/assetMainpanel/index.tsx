import React, { useState, useEffect } from "react";
import { getAssetApi } from "@api/designApi";
import fetcher from "@utils/fetcher";
import { AssetType } from "@customTypes/moodboardTypes";
import { Card, Row, Col, Typography } from "antd";
import Image from "@components/Image";
import { CustomDiv, MaxHeightDiv, SilentDivider } from "@sections/Dashboard/styled";
import styled from "styled-components";
import AssetDescriptionPanel from "./assetDescriptionPanel";

const { Text } = Typography;

const AssetCard = styled(Card)`
	.ant-card-body {
		padding: 0px 0px;
		height: 100%;
	}
`;

const AssetMainPanel = () => {
    const [assetData, setAssetData] = useState<AssetType[]>([]);
    const [selectedAsset, setSelectedAsset] = useState<string>('');
	const fetchAndPopulate = async () => {
		const endPoint = getAssetApi();
		const responseData = await fetcher({ endPoint: endPoint, method: "GET" });
		if (responseData.data) {
			if (responseData.data.data) {
				setAssetData(responseData.data.data);
			}
		}
    };
    
    const onCardClick = (assetId) => {
        setSelectedAsset(assetId)
    }

	useEffect(() => {
		fetchAndPopulate();
	}, []);
	console.log(assetData);
	return (
		<>
			<Row type="flex" justify="start" align="middle">
				{assetData.map(asset => {
					return (
						<Col sm={12} md={8} lg={8} xl={6} xxl={4}>
							<CustomDiv width="100%" type="flex" px="10px" py="10px" justifyContent="center">
								<AssetCard onClick={()=>onCardClick(asset._id)} hoverable style={{ width: "225px" }}>
									<CustomDiv height="100%" type="flex" flexDirection="column">
										<CustomDiv height="70%" overflow="hidden" justifyContent="space-around" type="flex">
											<Image height="100%" src={`q_100,h_200/${asset.cdn}`} />
										</CustomDiv>
                                        <SilentDivider/>
										<CustomDiv type='flex' justifyContent='center' flexDirection='column' height="30%" px="15px">
											<CustomDiv><Text strong>{asset.retailer.name}</Text></CustomDiv>
											<CustomDiv whiteSpace='nowrap'><Text ellipsis strong>{asset.name}</Text></CustomDiv>
										</CustomDiv>
									</CustomDiv>
								</AssetCard>
							</CustomDiv>
						</Col>
					);
				})}
                <AssetDescriptionPanel assetId={selectedAsset}/>
			</Row>
		</>
	);
};

export default AssetMainPanel;
