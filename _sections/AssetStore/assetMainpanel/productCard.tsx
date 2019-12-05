import Image from "@components/Image";
import { AssetType } from "@customTypes/moodboardTypes";
import { CustomDiv, SilentDivider } from "@sections/Dashboard/styled";
import { getValueSafely } from "@utils/commonUtils";
import { Typography } from "antd";
import React from 'react';
import { AssetCard } from "../styled";


const {Text} = Typography;

interface AssetCards {
    asset: Partial<AssetType>;
    onCardClick: (id:string) => void
    hoverable?: boolean;
}

const ProductCard:(props:AssetCards) => JSX.Element = ({asset, onCardClick, hoverable=true }) => {
    return <CustomDiv flexBasis='30ch' type="flex" px="10px" py="10px" inline justifyContent="center">
    <AssetCard onClick={() => onCardClick(asset._id)} hoverable={hoverable} style={{ width: "225px" }}>
        <CustomDiv height="100%" type="flex" flexDirection="column">
            <CustomDiv height="70%" overflow="hidden" justifyContent="space-around" type="flex">
                <Image height="200px" src={`q_80,h_200/${asset.cdn}`} />
            </CustomDiv>
            <SilentDivider />
            <CustomDiv type="flex" justifyContent="center" flexDirection="column" height="30%" px="15px">
                <CustomDiv>
                    <Text style={{width: '100%'}} strong>{getValueSafely(() => asset.retailer.name, "N/A")}</Text>
                </CustomDiv>
                <CustomDiv whiteSpace="nowrap">
                    <Text style={{width: '100%'}} ellipsis strong>
                        {getValueSafely(() => asset.name, "N/A")}
                    </Text>
                </CustomDiv>
            </CustomDiv>
        </CustomDiv>
    </AssetCard>
</CustomDiv>
}

export default ProductCard;