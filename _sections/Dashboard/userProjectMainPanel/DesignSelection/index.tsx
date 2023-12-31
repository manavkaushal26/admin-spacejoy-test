import { FileAddOutlined } from "@ant-design/icons";
import { deleteDesignApi, designCopyApi } from "@api/designApi";
import { editProjectApi, editRevisionFormAPI, notifyCustomerApi, updateProjectPhase } from "@api/projectApi";
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
import { cookieNames, imageKitConfig } from "@utils/config";
import fetcher from "@utils/fetcher";
import getCookie from "@utils/getCookie";
import { Alert, Button, Col, Modal, Popconfirm, Row, Select, Typography, message, notification } from "antd";
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
	border: 1px solid rgba(0, 0, 0, 0.09);
	height: 100%;
	padding: 24px;

	:hover {
		cursor: pointer;

		border-color: #e8e8e8;
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
	refetchData,
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
			setProjectData(prevState => ({
				...prevState,
				isDelivered: true,
			}));
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
		refetchData();
	};
	const confirmDelete = (id: string): void => {
		if (id === revisionDesign) {
			Modal.warning({
				title: "Cannot delete the design since it belongs to current revision version",
				content: "Please create a new design and mark it as revision to delete this design",
			});
		} else {
			Modal.confirm({
				title: "Are you sure?",
				content: "This action is irreversible",
				onOk: () => deleteDesign(id),
			});
		}
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
	const confirmChange = value => {
		Modal.confirm({ title: `Change status to ${value}?`, onOk: () => onStatusChange(value) });
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

	const onDesignMarkedAsRevision = async (id: string) => {
		const endPoint = editRevisionFormAPI(projectData?._id);
		const body = { revisedDesignId: id };
		try {
			const response = await fetcher({ endPoint, method: "PUT", body });
			if (response.statusCode <= 300) {
				refetchData();
			} else {
				throw new Error("Failed to set as revision design");
			}
		} catch (e) {
			notification.error(e.message);
		}
	};

	const confirmMarkAsRevision = id => {
		Modal.confirm({ title: "Mark design as revision?", onOk: () => onDesignMarkedAsRevision(id) });
	};

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

	const isRevisionDesignPresentInProject: boolean = useMemo(() => {
		if (revisionDesign === null) {
			return true;
		}
		try {
			return Boolean(
				projectData.designs.find(design => {
					return design.design._id === revisionDesign;
				})
			);
		} catch {
			return false;
		}
	}, [projectData?.designs, revisionDesign]);

	return (
		<Row gutter={[0, 16]}>
			<Col span={24}>
				{!isRevisionDesignPresentInProject &&
					projectData?.currentPhase?.name?.internalName === PhaseInternalNames.designsInRevision && (
						<Alert
							message='No Revision Design Found'
							description='Please mark one of the created designs as the revision design'
							type='error'
						/>
					)}
			</Col>
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
								projectPhase={projectData?.currentPhase.name.internalName}
								uniqueId={design.design._id}
								onSelectCard={onSelectDesign}
								feedbackPresent={!!feedback.length}
								role={userRole}
								creatorRole={design.design?.owner?.role}
								confirmMarkAsRevision={confirmMarkAsRevision}
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
													cdn: `${imageKitConfig.baseDeliveryURLStatic}/v1581057410/admin/designImagePlaceholder.jpg`,
													_id: "1",
													imgType: DesignImgTypes.Render,
												},
										  ]
										: [
												{
													cdn: `${imageKitConfig.baseDeliveryURLStatic}/v1581057410/admin/designImagePlaceholder.jpg`,
													_id: "1",
													imgType: DesignImgTypes.Render,
												},
										  ]
								)}
								onDelete={confirmDelete}
								designName={design.design.name}
								state={design.state}
								operationState={design.operationState}
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
									projectData.currentPhase.name.internalName === PhaseInternalNames.designReady ||
									!isRevisionDesignPresentInProject
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
								Email Customer {projectData?.isDelivered ? "(Already Notified)" : ""}
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
						<Select onChange={confirmChange} style={{ width: 200 }} defaultValue={projectData.status}>
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
				refetchData={refetchData}
				projectData={projectData}
				toggleModal={onClose}
				copyDesignModalVisible={copyDesignModalVisible}
			/>
		</Row>
	);
};

export default DesignSelection;
