import { CopyOutlined, DeleteOutlined } from "@ant-design/icons";
import { DesignImagesInterface, DesignState } from "@customTypes/dashboardTypes";
import { Role } from "@customTypes/userType";
import { BiggerButtonCarousel } from "@sections/Dashboard/styled";
import { Card, Col, Row, Tag, Typography } from "antd";
import React, { ReactNode, useEffect, useState } from "react";
import styled, { css, FlattenSimpleInterpolation } from "styled-components";
import Image from "./Image";

interface DesignCardProps {
	uniqueId: string;
	onSelectCard: (uniqueId: string) => void;
	coverImage: DesignImagesInterface[];
	onDelete?: (uniqueId: string) => void;
	designName: string;
	phase: string;
	state?: DesignState;
	role?: Role;
	creatorRole?: Role;
	feedbackPresent?: boolean;
	revisionDesignId?: string;
	onCopyAsDesignExampleClick?: (data: string) => void;
	parentDesign?: string;
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

const StateAwareCards = styled(Card)<{ state: DesignState; revisionDesign: boolean }>`
	${({ state }): FlattenSimpleInterpolation | null => (state === DesignState.Finalized ? topRightTick : null)}
	background-color: ${({ revisionDesign }): string | null => (revisionDesign ? "#fff7e6" : null)};
	> .ant-card-body {
		flex-grow: 1;
	}
`;

const { Meta } = Card;

const { Text } = Typography;

const CopyDesignAsDesignExampleRoles = [Role.Admin, Role.Owner, Role.Designer, Role["Account Manager"]];

const DesignCard: React.FC<DesignCardProps> = ({
	uniqueId,
	onSelectCard,
	onDelete,
	coverImage,
	designName,
	phase,
	creatorRole,
	state,
	feedbackPresent,
	onCopyAsDesignExampleClick,
	role,
	revisionDesignId,
	parentDesign,
}) => {
	const [actions, setActions] = useState<ReactNode[]>([]);

	useEffect(() => {
		const listOfActions = [];

		if (onDelete) {
			listOfActions.push(
				<DeleteOutlined
					key='delete'
					onClick={(e): void => {
						e.stopPropagation();
						onDelete(uniqueId);
					}}
				/>
			);
		}
		if (onCopyAsDesignExampleClick && CopyDesignAsDesignExampleRoles.includes(role)) {
			listOfActions.push(
				<CopyOutlined
					key='copy'
					onClick={(e): void => {
						e.stopPropagation();
						onCopyAsDesignExampleClick(uniqueId);
					}}
				/>
			);
		}
		setActions(listOfActions);
		return (): void => {
			setActions([]);
		};
	}, [onDelete, onCopyAsDesignExampleClick, role]);

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
				actions={actions}
				revisionDesign={uniqueId === revisionDesignId}
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
										<Image nolazy width='100%' src={`q_80,w_300/${image.cdn}`} />
									</div>
								))}
							</BiggerButtonCarousel>
						</Col>
					</Row>
				}
			>
				<Meta
					title={designName}
					description={
						<Row gutter={[4, 4]}>
							<Col>
								<Tag>
									<Text strong>Phase:</Text>
									{phase}
								</Tag>
							</Col>
							{feedbackPresent && (
								<Col>
									<Tag color='orange'>Feedback</Tag>
								</Col>
							)}
							{creatorRole && (
								<Col>
									<Tag color='blue'>
										<Text strong>Owner:</Text> {creatorRole}
									</Tag>
								</Col>
							)}
							{revisionDesignId === uniqueId && (
								<Col>
									<Tag color='red'>Revision</Tag>
								</Col>
							)}
							{parentDesign && (
								<Col>
									<Tag>
										<Text strong>Parent:</Text> {parentDesign}
									</Tag>
								</Col>
							)}
						</Row>
					}
				/>
			</StateAwareCards>
		</Col>
	);
};

export default DesignCard;
