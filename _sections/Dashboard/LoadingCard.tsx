import { Card, Skeleton } from "antd";
import React from "react";

const LoadingCard = () => {
	return (
		<Card>
			<Skeleton loading avatar active />
		</Card>
	);
};

export default LoadingCard;
