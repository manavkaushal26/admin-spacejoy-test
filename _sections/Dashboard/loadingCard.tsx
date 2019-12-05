import { Card, Skeleton, Spin } from 'antd';
import React from 'react';

const LoadingCard = () => {
    return <Spin spinning><Card>
        <Skeleton loading avatar active/>
    </Card></Spin>
}

export default LoadingCard;