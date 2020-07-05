import { FileAddOutlined } from "@ant-design/icons";
import { deleteDesignApi, designCopyApi } from "@api/designApi";
import { editProjectApi, notifyCustomerApi, updateProjectPhase } from "@api/projectApi";
import { CapitalizedText } from "@components/CommonStyledComponents";
import DesignCard from "@components/DesignCard";
import EditDesignModal from "@components/EditDesignModal";
import {
	DesignImgTypes,
	DesignInterface,
	DetailedDesign,
	DetailedProject,
	PackageDetails,
	Packages,
	PhaseInternalNames,
} from "@customTypes/dashboardTypes";
import { Role, Status } from "@customTypes/userType";
import { getHumanizedActivePhase, getValueSafely } from "@utils/commonUtils";
import { cookieNames } from "@utils/config";
import fetcher from "@utils/fetcher";
import getCookie from "@utils/getCookie";
import { Button, Col, message, Modal, notification, Popconfirm, Row, Select, Typography } from "antd";
import React, { useMemo, useState } from "react";
import styled from "styled-components";
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
	revisionDesign: string;
}

const getNumberOfDesigns = (items: Packages[]): number => {
	const packageNames = getValueSafely(() => items.map(item => item.name), []);
	if (packageNames.includes(PackageDetails.euphoria.name)) {
		return PackageDetails.euphoria.designs;
	}
	if (packageNames.includes(PackageDetails.bliss.name)) {
		return PackageDetails.bliss.designs;
	}
	if (packageNames.includes(PackageDetails.delight.name)) {
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

const DesignSelection: React.FC<DesignSelection> = ({
	projectData,
	onSelectDesign,
	setProjectData,
	revisionDesign,
}) => {
	const [copyDesignModalVisible, setCopyDesignModalVisible] = useState<boolean>(false);
	const [editDesignModalVisible, setEditDesignModalVisible] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(false);
	const [designToBeCopied, setDesignToBeCopied] = useState<Partial<DetailedDesign>>(null);

	const toggleCopyDesignModal = (): void => {
		setCopyDesignModalVisible(!copyDesignModalVisible);
	};

	const items = getValueSafely(() => projectData.order.items, []);

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
		updateStatus(PhaseInternalNames.designReady);
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

	const userRole: Role = getCookie(null, cookieNames.userRole) as Role;

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

	const onCopyAsDesignExampleClick = (data?: string): void => {
		if (data) {
			const designData = getValueSafely(
				() =>
					projectData.designs.find(design => {
						return design.design._id === data;
					}).design,
				null
			);
			setDesignToBeCopied(designData);
			setEditDesignModalVisible(true);
		} else {
			setDesignToBeCopied(null);
			setEditDesignModalVisible(false);
		}
	};

	const onClose = (): void => {
		setCopyDesignModalVisible(false);
		setDesignToBeCopied(null);
		setEditDesignModalVisible(false);
	};

	const designIdToNameMap = useMemo(() => {
		if (projectData) {
			return projectData.designs.reduce((acc, design) => {
				return { ...acc, [design.design.id]: design.design.name };
			}, {});
		}
		return {};
	}, [projectData]);

	const onOkClickInCopyDesignModal = async (data): Promise<void> => {
		setLoading(true);
		const endPoint = `${designCopyApi(designToBeCopied._id)}?designScope=portfolio`;
		const response = await fetcher({ endPoint, method: "POST", body: { data: { ...data } } });
		if (response.statusCode <= 300) {
			notification.success({ message: "Design has been copied as Design Example" });
		} else {
			notification.error({ message: "Failed to copy" });
		}
		setLoading(false);
		onCopyAsDesignExampleClick();
	};

	return (
		<Row gutter={[0, 16]}>
			<Col span={24}>
				<Row align='stretch' gutter={[8, 8]}>
					{projectData.designs.map(design => {
						const feedback = projectData.feedback.filter(designFeedback => {
							if (design) return designFeedback.reference === design.design._id;
							return false;
						});

						return (
							<DesignCard
								key={design._id}
								uniqueId={design.design._id}
								onSelectCard={onSelectDesign}
								feedbackPresent={!!feedback.length}
								role={userRole}
								creatorRole={design.design?.owner?.role}
								onCopyAsDesignExampleClick={onCopyAsDesignExampleClick}
								coverImage={getValueSafely(
									() => {
										const renderImages = design.design.designImages.filter(
											image => image.imgType === DesignImgTypes.Render
										);
										if (renderImages.length) {
											return renderImages;
										}
										throw Error;
									},
									process.env.NODE_ENV === "production"
										? [
												{
													cdn: "/v1581057410/admin/designImagePlaceholder.jpg",
													_id: "1",
													imgType: DesignImgTypes.Render,
												},
										  ]
										: [
												{
													cdn: "/v1581057545/admin/designImagePlaceholder.jpg",
													_id: "1",
													imgType: DesignImgTypes.Render,
												},
										  ]
								)}
								onDelete={confirmDelete}
								designName={design.design.name}
								state={design.state}
								parentDesign={getValueSafely(() => designIdToNameMap[design.parent], undefined)}
								revisionDesignId={revisionDesign}
								phase={getHumanizedActivePhase(design.design.phases)}
							/>
						);
					})}
					<Col xs={24} sm={12} md={8} lg={8} xl={6} onClick={toggleCopyDesignModal}>
						<HoverCard>
							<Row style={{ height: "100%" }} justify='center' align='middle'>
								<Col span={24}>
									<Row justify='center' align='middle'>
										<FileAddOutlined style={{ fontSize: "3rem" }} />
									</Row>
									<Row style={{ padding: "15px" }} justify='center' align='middle'>
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
						<Row justify='center'>
							<Button
								onClick={onSubmit}
								disabled={
									numberOfActiveProjects < numberOfDesigns ||
									projectData.currentPhase.name.internalName === PhaseInternalNames.designReady
								}
								type='primary'
							>
								Submit Project
							</Button>
						</Row>
					</Col>
					<Col sm={12} md={8}>
						<Row justify='center'>
							<Popconfirm
								title='Are you sure?'
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
						<Row justify='center'>
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
					<Row justify='center'>
						<Text>
							Submit Disabled? The project is either already marked complete or the required number designs are not yet
							ready.
						</Text>
					</Row>
				)}
			</Col>
			<Col span={24}>
				{(userRole === Role.Admin || userRole === Role.Owner) && (
					<Row justify='center'>
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
			<EditDesignModal
				onOk={onOkClickInCopyDesignModal}
				visible={editDesignModalVisible}
				onCancel={onClose}
				confirmLoading={loading}
				designData={designToBeCopied}
			/>
			<CopyDesignModal
				projectData={projectData}
				toggleModal={onClose}
				copyDesignModalVisible={copyDesignModalVisible}
				setProjectData={setProjectData}
			/>
		</Row>
	);
};

export default DesignSelection;
