import React from "react";
import { CustomDiv } from "../styled";
import { Card, Row, Col, Typography, Tag } from "antd";
import Image from "@components/Image";
import { DetailedProject } from "@customTypes/dashboardTypes";
import { getValueSafely, getHumanizedActivePhase } from "@utils/commonUtils";

const { Text } = Typography;

interface DesignSelection {
	projectData: DetailedProject;
	onSelectDesign: (id: string) => void;
}

const DesignSelection: React.FC<DesignSelection> = ({ projectData, onSelectDesign }) => {
	return (
		<>
			{projectData.designs.map(design => {
				return (
					<React.Fragment key={design._id}>
						<CustomDiv inline overflow="visible" width="300px" mt="2rem" mr="1rem">
							<Card
								style={{ width: "300px" }}
								hoverable
								onClick={() => onSelectDesign(design.design._id)}
								cover={
									<CustomDiv>
										<Image
											width="300px"
											height="175px"
											src={`q_80,w_298/${getValueSafely(
												() => design.design.designImages[0].cdn,
												"v1574869657/shared/Illustration_mffq52.svg"
											)}`}
										/>
									</CustomDiv>
								}
							>
								<Row type="flex" justify="space-between">
									<Col>
										<Text>{design.design.name}</Text>
									</Col>
									<Col>
										<Tag>Status: {getHumanizedActivePhase(design.design.phases)}</Tag>
									</Col>
								</Row>
							</Card>
						</CustomDiv>
					</React.Fragment>
				);
			})}
		</>
	);
};

export default DesignSelection;
