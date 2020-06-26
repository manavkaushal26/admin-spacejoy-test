import { Col, Typography, Row } from "antd";
import React from "react";

const { Text } = Typography;

const DetailText: React.FC<{ name: string; value: any }> = ({ name, value }) => {
	return (
		<Col sm={12} md={8} lg={6}>
			<Row style={{ whiteSpace: "pre", flexFlow: "row" }} gutter={[4, 4]}>
				<Text strong>{name}: </Text>
				<Text ellipsis>{value}</Text>
			</Row>
		</Col>
	);
};

export default DetailText;
