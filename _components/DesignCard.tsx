import { Card, Col, Icon, Row, Typography, Tag } from "antd";
import React from "react";
import Image from "./Image";

interface DesignCardProps {
	uniqueId: string;
	onSelectCard: (uniqueId: string) => void;
	coverImage: string;
	onDelete?: (uniqueId: string) => void;
	designName: string;
	phase: string;
}

const { Text } = Typography;

const DesignCard: React.FC<DesignCardProps> = ({ uniqueId, onSelectCard, onDelete, coverImage, designName, phase }) => {
	return (
		<Col style={{ display: "flex" }} xs={24} sm={12} md={8} lg={8} xl={6} key={uniqueId}>
			<Card
				hoverable
				onClick={(): void => onSelectCard(uniqueId)}
				actions={
					onDelete
						? [
								<Icon
									type="delete"
									key="delete"
									onClick={(e): void => {
										e.stopPropagation();
										onDelete(uniqueId);
									}}
								/>,
						  ]
						: null
				}
				cover={
					<Row>
						<Col span={24}>
							<Image width="100%" src={coverImage} />
						</Col>
					</Row>
				}
			>
				<Row type="flex" justify="space-between">
					<Col>
						<Text>{designName}</Text>
					</Col>
					<Col>
						<Tag>Status: {phase}</Tag>
					</Col>
				</Row>
			</Card>
		</Col>
	);
};

export default DesignCard;
