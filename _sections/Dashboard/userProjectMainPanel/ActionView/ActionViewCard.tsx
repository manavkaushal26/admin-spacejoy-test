import { Button, Card, Col, Row, Spin, Typography } from "antd";
import React from "react";

const { Text } = Typography;

interface ActionViewCardInterface {
	label: string;
	btnText: string;
	count?: number | string;
	dollar?: boolean;
	onClick: () => void;
	loader?: boolean;
}

const ActionViewCard: React.FC<ActionViewCardInterface> = ({ label, btnText, count, dollar, onClick, loader }) => {
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
					{loader ? (
						<Spin />
					) : (
						<span>
							{dollar && "$"}
							{count}
						</span>
					)}
				</Col>
			</Row>
		</Card>
	);
};

export default ActionViewCard;
