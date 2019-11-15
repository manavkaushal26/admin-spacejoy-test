import React from 'react';
import { Card, Skeleton, Avatar } from 'antd';

const LoadingCard = () => {
    return <Card>
        <Skeleton loading>
            <Card.Meta>
                <Avatar>A</Avatar>
                <div>Name</div>
            </Card.Meta>
        </Skeleton>
    </Card>
}

export default LoadingCard;