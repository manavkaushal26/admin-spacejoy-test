import { Card, Col, Icon, Row, Typography, Tag } from "antd";
import React from "react";
import { DesignState, DesignImagesInterface } from "@customTypes/dashboardTypes";
import styled, { css, FlattenSimpleInterpolation } from "styled-components";
import { BiggerButtonCarousel } from "@sections/Dashboard/styled";
import Image from "./Image";

interface DesignCardProps {
	uniqueId: string;
	onSelectCard: (uniqueId: string) => void;
	coverImage: DesignImagesInterface[];
	onDelete?: (uniqueId: string) => void;
	designName: string;
	phase: string;
	state?: DesignState;
	feedbackPresent?: boolean;
}

const topRightTick = css`
	::after {
		position: absolute;
		top: 0;
		right: 0px;
		height: 40px;
		width: 40px;
		border-bottom-left-radius: 40px;
		background: #52c41a;
		content: "✓";
		padding: 0 0 8px 8px;
		display: flex;
		justify-content: center;
		align-items: center;
		color: white;
		font-size: 1.25em;
	}
`;

const StateAwareCards = styled(Card)<{ state: DesignState }>`
	${({ state }): FlattenSimpleInterpolation | null => (state === DesignState.Finalized ? topRightTick : null)}
`;

const { Text } = Typography;

const DesignCard: React.FC<DesignCardProps> = ({
	uniqueId,
	onSelectCard,
	onDelete,
	coverImage,
	designName,
	phase,
	state,
	feedbackPresent,
}) => {
	return (
		<Col
			style={{ display: "flex" }}
			onClick={(): void => onSelectCard(uniqueId)}
			xs={24}
			sm={12}
			md={8}
			lg={8}
			xl={6}
			key={uniqueId}
		>
			<StateAwareCards
				state={state}
				style={{ width: "100%" }}
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
					<Row
						{...(coverImage.length !== 1
							? { style: { cursor: "auto" }, onClick: (e): void => e.stopPropagation() }
							: {})}
					>
						<Col span={24}>
							<BiggerButtonCarousel autoplay>
								{coverImage.map(image => (
									<div key={image._id}>
										<Image nolazy width="100%" src={`q_80,w_300/${image.cdn}`} />
									</div>
								))}
							</BiggerButtonCarousel>
						</Col>
					</Row>
				}
			>
				<Row>
					<Col span={24}>
						<Text strong style={{ width: "100%" }} ellipsis>
							{designName}
						</Text>
					</Col>
					<Col span={12}>
						<Tag>Phase: {phase}</Tag>
					</Col>
					<Col span={12}>{feedbackPresent && <Tag color="orange">Feedback</Tag>}</Col>
				</Row>
			</StateAwareCards>
		</Col>
	);
};

export default DesignCard;
