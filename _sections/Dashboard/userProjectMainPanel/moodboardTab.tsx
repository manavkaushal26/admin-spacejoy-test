import React from "react";
import { CustomDiv } from "../styled";
import { Button } from "antd";
import Router from "next/router";

interface MoodboardTabProps {
    designId: string;
}

const MoodboardTab:(props:MoodboardTabProps) => JSX.Element = ({designId}) => {

    const goToStore = () => {
        Router.push({pathname: '/assetstore', query: {designId}}, `/dashboard/did/${designId}`);
    }

	return (<CustomDiv width='100%'>
        <CustomDiv justifyContent='center'>
            <Button onClick={goToStore}>Open Asset Store</Button>
        </CustomDiv>
    </CustomDiv>);
};

export default MoodboardTab;
