import { updateProjectPhase, notifyCustomerApi, editProjectApi } from "@api/projectApi";
import Image from "@components/Image";
import {
	DesignInterface,
	DetailedProject,
	Packages,
	PhaseInternalNames,
	PackageDetails,
	DesignImgTypes,
} from "@customTypes/dashboardTypes";
import { cookieNames } from "@utils/config";

import { Status, Role } from "@customTypes/userType";
import { getHumanizedActivePhase, getValueSafely } from "@utils/commonUtils";
import fetcher from "@utils/fetcher";
import { Button, Card, Col, message, Row, Tag, Typography, Icon, Modal, Popconfirm, Select } from "antd";
import React, { useMemo, useState } from "react";
import styled from "styled-components";
import { deleteDesignApi } from "@api/designApi";
import getCookie from "@utils/getCookie";
import { CapitalizedText } from "@sections/AssetStore/styled";
import CopyDesignModal from "./CopyDesignModal";

const { Text } = Typography;
const { Option } = Select;
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

	const cardText = getValueSafely(
		() =>
			projectData.currentPhase.name.internalName === PhaseInternalNames.designsInRevision
				? "Add Revision design"
				: "Add Design",
		""
	);

	const warnUser = (): void => {
		Modal.confirm({
			title: "Are you sure?",
			content: "Please double check the Project phase is marked as 'Design Ready' before sending out this mail.",
			onOk: emailCustomer,
		});
	};

	const deleteDesign = async (id: string): Promise<void> => {
		const endPoint = deleteDesignApi(id);
		await fetcher({ endPoint, method: "DELETE" });
		setProjectData({
			...projectData,
			designs: [...projectData.designs.filter(design => design.design._id !== id)],
		});
	};
	const confirmDelete = (id: string): void => {
		Modal.confirm({
			title: "Are you sure?",
			content: "This action is irreversible",
			onOk: () => deleteDesign(id),
		});
	};

	const userRole = getCookie(null, cookieNames.userRole);

	const onStatusChange = async (value): Promise<void> => {
		const endpoint = editProjectApi(projectData._id);
		const response = await fetcher({
			endPoint: endpoint,
			method: "PUT",
			body: {
				data: {
					status: value,
				},
			},
		});
		setProjectData({
			...projectData,
			status: response.data.status,
		});
	};

	return (
		<Row gutter={[0, 16]}>
			<Col span={24}>
				<Row type="flex" align="stretch" gutter={[8, 8]}>
					{projectData.designs.map(design => {
						return (
							<Col sm={24} md={12} lg={8} xl={6} key={design._id}>
								<Card
									hoverable
									onClick={(): void => onSelectDesign(design.design._id)}
									actions={[
										<Icon
											type="delete"
											key="delete"
											onClick={(e): void => {
												e.stopPropagation();
												confirmDelete(design.design._id);
											}}
										/>,
									]}
									cover={
										<Row>
											<Col span={24}>
												<Image
													width="100%"
													src={`q_80/${getValueSafely(
														() =>
															design.design.designImages.filter(image => image.imgType === DesignImgTypes.Render)[0]
																.cdn,
														process.env.NODE_ENV === "production"
															? "v1574869657/shared/Illustration_mffq52.svg"
															: "v1578482972/shared/Illustration_mffq52.svg"
													)}`}
												/>
											</Col>
										</Row>
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
							</Col>
						);
					})}
					<Col sm={24} md={12} lg={8} xl={6} onClick={toggleCopyDesignModal}>
						<HoverCard>
							<Row style={{ height: "100%", flexDirection: "column" }} type="flex" justify="center" align="middle">
								<Col span="24">
									<Row type="flex" justify="center" align="middle">
										<Icon style={{ fontSize: "36px" }} type="file-add" />
									</Row>
								</Col>
								<Col span="24">
									<Row style={{ padding: "15px" }} type="flex" justify="center" align="middle">
										<Text>{cardText}</Text>
									</Row>
								</Col>
							</Row>
						</HoverCard>
					</Col>
				</Row>
			</Col>
			<Col span={24}>
				<Row gutter={[8, 8]}>
					<Col sm={12} md={8}>
						<Row type="flex" justify="center">
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
						</Row>
					</Col>
					<Col sm={12} md={8}>
						<Row type="flex" justify="center">
							<Popconfirm
								title="Are you sure?"
								onConfirm={sendToRevision}
								disabled={projectData.currentPhase.name.internalName !== PhaseInternalNames.designReady}
							>
								<OrangeButton disabled={projectData.currentPhase.name.internalName !== PhaseInternalNames.designReady}>
									Send to Revision
								</OrangeButton>
							</Popconfirm>
						</Row>
					</Col>
					<Col sm={12} md={8}>
						<Row type="flex" justify="center">
							<CyanButton
								disabled={projectData.currentPhase.name.internalName !== PhaseInternalNames.designReady}
								onClick={warnUser}
							>
								Email Customer
							</CyanButton>
						</Row>
					</Col>
				</Row>
			</Col>
			<Col span={24}>
				{(numberOfActiveProjects !== numberOfDesigns ||
					projectData.currentPhase.name.internalName === PhaseInternalNames.designReady) && (
					<Row type="flex" justify="center">
						<Text>
							Submit Disabled? The project is either already marked complete or the required number designs are not yet
							ready.
						</Text>
					</Row>
				)}
			</Col>
			<Col span={24}>
				{(userRole === Role.Admin || userRole === Role.Owner) && (
					<Row type="flex" justify="center">
						<Select onChange={onStatusChange} style={{ width: 200 }} defaultValue={projectData.status}>
							{Object.keys(Status).map(key => {
								return (
									<Option key={key} value={key}>
										<CapitalizedText>{key}</CapitalizedText>
									</Option>
								);
							})}
						</Select>
					</Row>
				)}
			</Col>
			<CopyDesignModal
				projectData={projectData}
				toggleModal={toggleCopyDesignModal}
				copyDesignModalVisible={copyDesignModalVisible}
				setProjectData={setProjectData}
			/>
		</Row>
	);
};

export default DesignSelection;
