import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { MaxHeightDiv, CustomDiv, SilentDivider } from "@sections/Dashboard/styled";
import { SingleAssetType } from "@customTypes/moodboardTypes";
import { getSingleAssetApi } from "@api/designApi";
import fetcher from "@utils/fetcher";
import { Button, Typography, Spin, Icon, Anchor, Statistic } from "antd";
import Image from "@components/Image";
import { getValueSafely } from "@utils/commonUtils";

const { Link } = Anchor;
const { Title, Text } = Typography;

const CenteredTitle = styled(Title)`
	text-align: center;
`;

const JustifiedText = styled(Text)`
	text-align: justify;
`;

const PositionFixedMaxHeightDiv = styled(MaxHeightDiv)<{ assetId: string }>`
	position: fixed;
	right: 0;
	transition: transform 0.2s;
	background-color: #f2f4f6;
	width: 300px;
	transform: translateX(${({ assetId }) => (assetId === "" ? "300px" : 0)});
	box-shadow: ${({ assetId }) => (assetId ? "-2px 0px 10px 0px rgba(0,0,0,0.2)" : "")};
`;

const FullWidthSpin = styled(Spin)`
    width: 100%;
    height: 100%;
`;

interface AssetDescriptionPanelProps {
	assetId: string;
}

const AssetDescriptionPanel: (props: AssetDescriptionPanelProps) => JSX.Element = ({ assetId }) => {
	const [singleAssetData, setSingleAssetData] = useState<SingleAssetType>(null);
	const [loading, setLoading] = useState<boolean>(false);
	const fetchAndPopulate = async () => {
		setLoading(true);
		const endpoint = getSingleAssetApi(assetId);
		const responseData = await fetcher({ endPoint: endpoint, method: "GET" });
		if (responseData.data) {
			setSingleAssetData(responseData.data);
		}
		setLoading(false);
	};

	useEffect(() => {
		if (assetId !== "") {
			fetchAndPopulate();
			return;
		}
		setSingleAssetData(null);
	}, [assetId]);

	return (
		<PositionFixedMaxHeightDiv assetId={assetId}>
			{singleAssetData ? (
				<CustomDiv type="flex" flexDirection="column" width="100%" px="16px" overY="scroll">
					<CustomDiv type="flex" justifyContent="center">
						<Image src={`q_100,h_200//${singleAssetData.cdn}`} />
					</CustomDiv>
					<CustomDiv pt="0.5em" type="flex" justifyContent="center">
						<CenteredTitle level={3}>{singleAssetData.name}</CenteredTitle>
					</CustomDiv>
					<SilentDivider />

					<CustomDiv py="0.5em" type="flex" justifyContent="baseline" align="baseline">
						<CustomDiv type="flex" pr="5px">
							<Icon type="dollar-circle" theme="filled" />
						</CustomDiv>
						<CustomDiv>
							<Text type="secondary">{"Cost: $"}</Text> <Text strong>{singleAssetData.price}</Text>
						</CustomDiv>
					</CustomDiv>
					<SilentDivider />

					<CustomDiv py="0.5em" type="flex" justifyContent="baseline" align="baseline">
						<CustomDiv type="flex" pr="5px">
							<Icon type="drag" />
						</CustomDiv>
						<CustomDiv>
							<Text type="secondary">Dimensions</Text>
							<CustomDiv py="0.25em">
								<CustomDiv>
									<Text>Height: </Text>
									<Text>{getValueSafely<string | number>(() => singleAssetData.dimension.height, "N/A")} Feet</Text>
								</CustomDiv>

								<CustomDiv>
									<Text>Width: </Text>
									<Text>{getValueSafely<string | number>(() => singleAssetData.dimension.width, "N/A")} Feet</Text>
								</CustomDiv>
								<CustomDiv>
									<Text>Depth: </Text>
									<Text>{getValueSafely<string | number>(() => singleAssetData.dimension.depth, "N/A")} Feet</Text>
								</CustomDiv>
							</CustomDiv>
						</CustomDiv>
					</CustomDiv>
					<SilentDivider />
					<CustomDiv py="0.5em" type="flex" justifyContent="baseline" align="baseline">
						<CustomDiv type="flex" pr="5px">
							<Icon type="link" />
						</CustomDiv>
						<CustomDiv>
							<Text type="secondary">
								<a target="_blank" href={getValueSafely(() => singleAssetData.retailLink, "#")}>
									{getValueSafely(() => singleAssetData.retailer.name, "N/A")}
								</a>
							</Text>
						</CustomDiv>
					</CustomDiv>
					<CustomDiv flexGrow={1} type="flex" flexDirection='column' justifyContent='flex-end'>
                        <CustomDiv py='0.5em' width='100%'><Button block type='default'>Add Recommendation</Button></CustomDiv>
                        <CustomDiv py='0.5em' width='100%'><Button block type='primary'>Add to Design</Button></CustomDiv>
                    </CustomDiv>
				</CustomDiv>
			) : (
				<FullWidthSpin spinning />
			)}
		</PositionFixedMaxHeightDiv>
	);
};

export default AssetDescriptionPanel;
