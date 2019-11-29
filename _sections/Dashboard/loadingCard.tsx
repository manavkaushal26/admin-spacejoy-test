import React from 'react';
import { Card, Skeleton, Spin } from 'antd';

const LoadingCard = () => {
    return <Spin spinning><Card>
        <Skeleton loading avatar active/>
    </Card></Spin>
}

export default LoadingCard;