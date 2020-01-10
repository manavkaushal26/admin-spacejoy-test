import { updateProjectPhase, notifyCustomerApi } from "@api/projectApi";
import Image from "@components/Image";
import {
	DesignInterface,
	DetailedProject,
	Packages,
	PhaseInternalNames,
	PackageDetails,
} from "@customTypes/dashboardTypes";
import { Status } from "@customTypes/userType";
import { getHumanizedActivePhase, getValueSafely } from "@utils/commonUtils";
import fetcher from "@utils/fetcher";
import { Button, Card, Col, message, Row, Tag, Typography, Icon, Modal, Popconfirm } from "antd";
import React, { useMemo, useState } from "react";
import styled from "styled-components";
import { CustomDiv } from "@sections/Dashboard/styled";
import CopyDesignModal from "./CopyDesignModal";

const { Text } = Typography;

const OrangeButton = styled(Button)`
	background: #faad14;
	border: ${(): string => "#faad14"};
	:hover {
		background: #ffc53d;
		border: ${(): string => "#ffc53d"};
	}
`;

const CyanButton = styled(Button)`
	background: #13c2c2;
	border: ${(): string => "#36cfc9"};
	:hover {
		background: #36cfc9;
		border: ${(): string => "#36cfc9"};
		color: rgba(0, 0, 0, 0.65);
	}
	:focus {
		background: #36cfc9;
		color: rgba(0, 0, 0, 0.65);
		border: ${({ theme }): string => theme.colors.primary2};
	}
`;

const HoverCard = styled.div`
	border: 1px solid #e8e8e8;
	height: 100%;
	padding: 24px;
	background: white;

	:hover {
		cursor: pointer;

		border-color: rgba(0, 0, 0, 0.09);
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.09);
	}
`;

interface DesignSelection {
	projectData: DetailedProject;
	onSelectDesign: (id: string) => void;
	refetchData: () => void;
	setProjectData: React.Dispatch<React.SetStateAction<DetailedProject>>;
}

const getNumberOfDesigns = (items: Packages[]): number => {
	if (items.includes(Packages.euphoria)) {
		return PackageDetails.euphoria.designs;
	}
	if (items.includes(Packages.bliss)) {
		return PackageDetails.bliss.designs;
	}
	if (items.includes(Packages.delight)) {
		return PackageDetails.delight.designs;
	}
	return 1;
};

const getNumberOfActiveProjects = (designs: DesignInterface[]): number => {
	return designs.reduce((acc, design) => {
		if (design.design.phases.ready.status === Status.active) {
			return acc + 1;
		}
		return acc;
	}, 0);
};

const DesignSelection: React.FC<DesignSelection> = ({ projectData, onSelectDesign, setProjectData }) => {
	const [copyDesignModalVisible, setCopyDesignModalVisible] = useState<boolean>(false);

	const toggleCopyDesignModal = (): void => {
		setCopyDesignModalVisible(!copyDesignModalVisible);
	};

	const {
		order: { items },
	} = projectData;

	const updateStatus = async (phase?: PhaseInternalNames): Promise<void> => {
		const endpoint = updateProjectPhase(projectData._id, phase);
		const response = await fetcher({ endPoint: endpoint, method: "PUT" });
		if (response.statusCode <= 300) {
			const responseProjectData: DetailedProject = response.data;
			message.success("Project Status Updated");
			setProjectData({
				...projectData,
				currentPhase: { ...responseProjectData.currentPhase },
				completedPhases: [...responseProjectData.completedPhases],
			});
		} else {
			message.warning("Error Updating Project Status");
		}
	};

	const numberOfDesigns = useMemo(() => {
		return getNumberOfDesigns(items);
	}, [items]);

	const numberOfActiveProjects = getNumberOfActiveProjects(projectData.designs);

	const onSubmit = (): void => {
		updateStatus();
	};

	const sendToRevision = (): void => {
		updateStatus(PhaseInternalNames.designsInRevision);
	};

	const emailCustomer = async (): Promise<void> => {
		const endPoint = notifyCustomerApi(projectData._id);
		const response = await fetcher({ endPoint, method: "POST" });
		if (response.statusCode <= 300) {
			message.success(`Email sent to ${projectData.customer.profile.name}`);
		}
	};

	const warnUser = (): void => {
		Modal.confirm({
			title: "Are you sure?",
			content: "Please double check the Project phase is marked as 'Design Ready' before sending out this mail.",
			onOk: emailCustomer,
		});
	};

	return (
		<CustomDiv>
			<CustomDiv type="flex" flexWrap="wrap">
				{projectData.designs.map(design => {
					return (
						<React.Fragment key={design._id}>
							<CustomDiv inline overflow="visible" mt="2rem" mr="1rem">
								<Card
									style={{ width: "300px" }}
									hoverable
									onClick={(): void => onSelectDesign(design.design._id)}
									cover={
										<CustomDiv>
											<Image
												width="300px"
												height="175px"
												src={`q_80,w_298/${getValueSafely(
													() => design.design.designImages[0].cdn,
													process.env.NODE_ENV === "production"
														? "v1574869657/shared/Illustration_mffq52.svg"
														: "v1578482972/shared/Illustration_mffq52.svg"
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
				{projectData.currentPhase.name.internalName === PhaseInternalNames.designsInRevision && (
					<CustomDiv
						onClick={toggleCopyDesignModal}
						inline
						overflow="visible"
						width="300px"
						height="248px"
						mt="2rem"
						mr="1rem"
					>
						<HoverCard>
							<Row style={{ height: "100%", flexDirection: "column" }} type="flex" justify="center" align="middle">
								<Col span="24">
									<Row type="flex" justify="center" align="middle">
										<Icon style={{ fontSize: "36px" }} type="file-add" />
									</Row>
								</Col>
								<Col span="24">
									<Row style={{ padding: "15px" }} type="flex" justify="center" align="middle">
										<Text>Add revision design</Text>
									</Row>
								</Col>
							</Row>
						</HoverCard>
					</CustomDiv>
				)}
			</CustomDiv>
			<CustomDiv py="1rem" width="100%" type="flex" flexWrap="wrap" justifyContent="center">
				<Row type="flex" justify="end" style={{ width: "100%" }} gutter={1}>
					<Col span={7}>
						<Button
							onClick={onSubmit}
							disabled={
								numberOfActiveProjects < numberOfDesigns ||
								projectData.currentPhase.name.internalName === PhaseInternalNames.designReady
							}
							type="primary"
						>
							Submit Project
						</Button>
					</Col>
					<Col span={7}>
						<Popconfirm
							title="Are you sure?"
							onConfirm={sendToRevision}
							disabled={projectData.currentPhase.name.internalName !== PhaseInternalNames.designReady}
						>
							<OrangeButton disabled={projectData.currentPhase.name.internalName !== PhaseInternalNames.designReady}>
								Send to Revision
							</OrangeButton>
						</Popconfirm>
					</Col>
					<Col span={7}>
						<CyanButton
							disabled={projectData.currentPhase.name.internalName !== PhaseInternalNames.designReady}
							onClick={warnUser}
						>
							Email Customer
						</CyanButton>
					</Col>
				</Row>
				{(numberOfActiveProjects !== numberOfDesigns ||
					projectData.currentPhase.name.internalName === PhaseInternalNames.designReady) && (
					<CustomDiv width="100%" type="flex" justifyContent="center" pt="1rem">
						<Text>
							Disabled? The project is either already marked complete or the required number designs are not yet ready.
						</Text>
					</CustomDiv>
				)}
			</CustomDiv>
			<CopyDesignModal
				projectData={projectData}
				toggleModal={toggleCopyDesignModal}
				copyDesignModalVisible={copyDesignModalVisible}
				setProjectData={setProjectData}
			/>
		</CustomDiv>
	);
};

export default DesignSelection;
