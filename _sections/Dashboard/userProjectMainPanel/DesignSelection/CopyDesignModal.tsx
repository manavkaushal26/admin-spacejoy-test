import React, { useState } from "react";
import { Modal, Select, Input, Button, Row, Col, Typography, message } from "antd";
import { DesignInterface, DetailedProject, PhaseInternalNames, DesignState } from "@customTypes/dashboardTypes";
import { designCopyApi, createDesignApi } from "@api/designApi";
import fetcher from "@utils/fetcher";

const { Option } = Select;
const { Text } = Typography;

interface CopyDesignModal {
	projectData: DetailedProject;
	toggleModal: () => void;
	copyDesignModalVisible: boolean;
	setProjectData: React.Dispatch<React.SetStateAction<DetailedProject>>;
}

const Footer: React.FC<{
	roomName: string;
	selectedDesignId: string;
	toggleModal: () => void;
	onSubmit: () => void;
	phase: PhaseInternalNames;
	loading: boolean;
}> = ({ roomName, selectedDesignId, toggleModal, onSubmit, phase, loading }) => {
	const disabled: boolean = phase === PhaseInternalNames.designsInRevision ? !roomName || !selectedDesignId : !roomName;
	return (
		<>
			<Button onClick={toggleModal}>Cancel</Button>
			<Button type="primary" loading={loading} onClick={onSubmit} disabled={disabled}>
				Submit
			</Button>
		</>
	);
};

const CopyDesignModal: React.FC<CopyDesignModal> = ({
	projectData,
	toggleModal,
	setProjectData,
	copyDesignModalVisible,
}) => {
	const [selectedDesignId, setSelectedDesignId] = useState<string>(null);
	const [roomName, setRoomName] = useState<string>(null);
	const [loading, setLoading] = useState<boolean>(false);
	const onChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
		const {
			target: { value },
		} = e;
		setRoomName(value);
	};

	const onSelect = (value: string): void => {
		if (value) {
			const [id, name] = value.split(":");
			setSelectedDesignId(id);
			setRoomName(name);
		} else {
			setSelectedDesignId(null);
		}
	};

	const onSubmit = async (): Promise<void> => {
		setLoading(true);
		const endpoint =
			projectData.currentPhase.name.internalName === PhaseInternalNames.designsInRevision || selectedDesignId !== null
				? designCopyApi(selectedDesignId)
				: createDesignApi();
		const response = await fetcher({
			endPoint: endpoint,
			method: "POST",
			body: {
				data: {
					name: roomName,
					project: projectData._id,
				},
			},
		});
		if (response.statusCode <= 300) {
			const designData = response.data;
			const newDesign: DesignInterface = {
				state: DesignState.New,
				design: designData,
			};
			setProjectData({
				...projectData,
				designs: [...projectData.designs, newDesign],
			});
			message.success("Revision Design Created Succesfully");
			toggleModal();
		} else {
			message.error(response.message);
		}
		setLoading(false);
	};

	const placeholderText =
		projectData.currentPhase.name.internalName === PhaseInternalNames.designsInRevision
			? "Revision Room Name"
			: "Add Design";

	return (
		<Modal
			visible={copyDesignModalVisible}
			title="Choose a design to copy"
			onCancel={toggleModal}
			footer={
				<Footer
					roomName={roomName}
					selectedDesignId={selectedDesignId}
					toggleModal={toggleModal}
					onSubmit={onSubmit}
					loading={loading}
					phase={projectData.currentPhase.name.internalName}
				/>
			}
		>
			<Row>
				<Col>
					<Text>Design</Text>
				</Col>
				<Col>
					<Select placeholder="Select a Design" style={{ width: "100%" }} onSelect={onSelect}>
						<Option key={Math.random()} value={null}>
							Select Design
						</Option>
						{projectData.designs.map(design => {
							return (
								<Option key={design.design._id} value={`${design.design._id}:${design.design.name} copy`}>
									{design.design.name}
								</Option>
							);
						})}
					</Select>
				</Col>
			</Row>
			<Row style={{ height: "1rem" }} />
			<Row>
				<Col>
					<Text>Design Name</Text>
				</Col>
				<Col>
					<Input value={roomName} placeholder={placeholderText} onChange={onChange} />
				</Col>
			</Row>
		</Modal>
	);
};

export default CopyDesignModal;
