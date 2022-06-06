import { Button, Card, Col, Row, Typography } from "antd";
import React from "react";

const { Text } = Typography;

interface ActionViewCardInterface {
	label: string;
	btnText: string;
	count?: number;
	dollar?: boolean;
	onClick: () => void;
}

const ActionViewCard: React.FC<ActionViewCardInterface> = ({ label, btnText, count, dollar, onClick }) => {
	return (
		<Card
			hoverable
			actions={[
				<Button key='apply' type='link'>
					{btnText}
				</Button>,
			]}
			onClick={onClick}
		>
			<Row gutter={[8, 8]}>
				<Col span={24}>
					<Text strong>{label}</Text>
				</Col>
				<Col span={24}>
					{dollar && "$"}
					{count}
				</Col>
			</Row>
		</Card>
	);
};

export default ActionViewCard;
