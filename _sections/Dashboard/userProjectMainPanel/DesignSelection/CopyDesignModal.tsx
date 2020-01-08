import React, { useState, useMemo } from "react";
import { Modal, Select, Input, Button, Row, Col, Typography, message } from "antd";
import { DesignInterface, DetailedProject } from "@customTypes/dashboardTypes";
import { designApi, designCopyApi } from "@api/designApi";
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
	loading: boolean;
}> = ({ roomName, selectedDesignId, toggleModal, onSubmit, loading }) => {
	return (
		<>
			<Button onClick={toggleModal}>Cancel</Button>
			<Button type="primary" loading={loading} onClick={onSubmit} disabled={!roomName || !selectedDesignId}>
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
		setSelectedDesignId(value);
	};

	const onSubmit = async (): Promise<void> => {
		setLoading(true);
		const endpoint = designCopyApi(selectedDesignId);
		const response = await fetcher({
			endPoint: endpoint,
			method: "POST",
			body: {
				data: {
					name: roomName,
				},
			},
		});
		if (response.statusCode <= 300) {
			const designData = response.data;
			const newDesign: DesignInterface = {
				state: "new",
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

	const footer = useMemo(
		() => (
			<Footer
				roomName={roomName}
				selectedDesignId={selectedDesignId}
				toggleModal={toggleModal}
				onSubmit={onSubmit}
				loading={loading}
			/>
		),
		[!!selectedDesignId, roomName]
	);

	return (
		<Modal visible={copyDesignModalVisible} title="Choose a design to copy" footer={footer}>
			<Row>
				<Col>
					<Text>Design</Text>
				</Col>
				<Col>
					<Select placeholder="Select a Room" style={{ width: "100%" }} onSelect={onSelect}>
						{projectData.designs.map(design => {
							return (
								<Option key={design.design._id} value={design.design._id}>
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
					<Text>Room Name</Text>
				</Col>
				<Col>
					<Input value={roomName} placeholder="Revision Room Name" onChange={onChange} />
				</Col>
			</Row>
		</Modal>
	);
};

export default CopyDesignModal;
