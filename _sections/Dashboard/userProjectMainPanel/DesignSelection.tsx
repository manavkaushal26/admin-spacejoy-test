import Image from "@components/Image";
import {
	DetailedProject,
	Packages,
	PackageDesignValue,
	DesignInterface,
	PhaseInternalNames
} from "@customTypes/dashboardTypes";
import { getHumanizedActivePhase, getValueSafely } from "@utils/commonUtils";
import { Card, Col, Row, Tag, Typography, Button, message } from "antd";
import React, { useMemo } from "react";
import { CustomDiv } from "../styled";
import { Status } from "@customTypes/userType";
import { updateProjectPhase } from "@api/projectApi";
import fetcher from "@utils/fetcher";

const { Text } = Typography;

interface DesignSelection {
	projectData: DetailedProject;
	onSelectDesign: (id: string) => void;
	refetchData: () => void;
	setProjectData: React.Dispatch<React.SetStateAction<DetailedProject>>;
}

const getNumberOfDesigns = (items: Packages[]) => {
	if (items.includes(Packages.euphoria)) {
		return PackageDesignValue.euphoria;
	}
	if (items.includes(Packages.bliss)) {
		return PackageDesignValue.bliss;
	}
	if (items.includes(Packages.delight)) {
		return PackageDesignValue.delight;
	}
};

const getNumberOfActiveProjects = (designs: DesignInterface[]) => {
	return designs.reduce((acc, design) => {
		if (design.design.phases.ready.status === Status.active) {
			return acc + 1;
		}
		return acc;
	}, 0);
};

const DesignSelection: React.FC<DesignSelection> = ({ projectData, onSelectDesign, refetchData }) => {
	const {
		order: { items }
	} = projectData;

	const onSubmit = async () => {
		const endpoint = updateProjectPhase(projectData._id);

		const response = await fetcher({ endPoint: endpoint, method: "PUT" });
		if (response.statusCode === 200) {
			const projectData: DetailedProject = response.data;
			if (projectData.currentPhase.name.internalName === PhaseInternalNames.designReady) {
				message.success("Project Ready");
			} else {
				message.warning("Project not Marked as Ready");
			}
			refetchData();
		}
	};

	const numberOfDesigns = useMemo(() => {
		return getNumberOfDesigns(items);
	}, [items]);

	const numberOfActiveProjects = getNumberOfActiveProjects(projectData.designs);

	return (
		<CustomDiv>
			<CustomDiv>
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
			</CustomDiv>
			<CustomDiv py="1rem" width="100%" type="flex" flexWrap="wrap" justifyContent="center">
				<Button
					onClick={onSubmit}
					disabled={
						numberOfActiveProjects !== numberOfDesigns ||
						projectData.currentPhase.name.internalName === PhaseInternalNames.designReady
					}
					type="primary"
				>
					Submit Project
				</Button>
				{(numberOfActiveProjects !== numberOfDesigns ||
					projectData.currentPhase.name.internalName === PhaseInternalNames.designReady) && (
					<CustomDiv width="100%" type="flex" justifyContent="center" pt="1rem">
						<Text>
							Disabled? The project is either already marked complete or the required number designs are not yet ready.
						</Text>
					</CustomDiv>
				)}
			</CustomDiv>
		</CustomDiv>
	);
};

export default DesignSelection;
