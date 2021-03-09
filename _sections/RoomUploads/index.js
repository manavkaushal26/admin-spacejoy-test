import fetcher from "@utils/fetcher";
import { Button, Col, Input, Modal, notification, Row, Typography } from "antd";
import React, { useRef } from "react";
const { Title } = Typography;
export default function index({
	createRoomModalVisible,
	roomType,
	setCreateRoomModalVisible,
	fetchRoomData,
	roomData,
}) {
	const roomName = useRef(null);
	const roomHeight = useRef(0);
	const roomWidth = useRef(0);
	const roomDepth = useRef(0);
	const roomCoverImage = useRef(null);
	const roomGlbFile = useRef(null);
	const roomSourceFile = useRef(null);

	const { spatialData } = roomData || {};
	const handleSave = async () => {
		if (roomName?.current && roomName?.current?.state.value) {
			const payload = {
				name: roomName?.current?.state.value,
				description: null,
				scope: "template",
				roomType: roomType,
				spatialData: {
					dimension3D: {
						depth: roomDepth?.current?.state.value || 0,
						width: roomWidth?.current?.state.value || 0,
						height: roomHeight?.current?.state.value || 0,
					},
				},
			};
			const response = await fetcher({ endPoint: "/room", method: "POST", body: { data: payload } });
			if (response.statusCode <= 300) {
				notification.success({ message: "Successfully created" });
				fetchRoomData();
				setCreateRoomModalVisible(false);
				flushLocalData();
			} else {
				notification.error({ message: "Failed to create" });
			}
		}
	};

	const flushLocalData = () => {
		roomDepth.current.state.value = "";
		roomWidth.current.state.value = "";
		roomHeight.current.state.value = "";
		roomName.current.state.value = "";
	};

	return (
		<Modal
			visible={createRoomModalVisible}
			zIndex={9999}
			footer={[
				<Button type='primary' onClick={handleSave} key='button-save'>
					Create
				</Button>,
			]}
			onCancel={() => setCreateRoomModalVisible(false)}
			width={500}
		>
			{Object.keys(roomData).length ? (
				<Row>
					<Col span={12}>
						<p>Room Cover Image</p>
						<Input ref={roomCoverImage} placeholder='Room Cover Image' type='file' />
					</Col>
					<Col span={12}>
						<p>Room 3D File (glb)</p>
						<Input ref={roomGlbFile} placeholder='Room 3D File (glb)' type='file' />
					</Col>
					<br></br>
					<br></br>
					<Col span={12}>
						<p>Room 3D File (source)</p>
						<Input ref={roomSourceFile} placeholder='Room 3D File (source)' type='file' />
					</Col>
				</Row>
			) : (
				<>
					<Row>
						<Col span={24}>
							<Title level={3}> Create a new Room</Title>
						</Col>
					</Row>
					<br></br>
					<Row>
						<Col span={24}>
							<p>Room Name</p>
							<Input ref={roomName} value={roomData?.name} />
						</Col>
					</Row>
					<br></br>
					<Row>
						<p>Spatial Data</p>
					</Row>
					<Row>
						<Col span={12}>
							<Input ref={roomDepth} placeholder='depth' type='number' value={spatialData?.dimension3D?.depth} />
						</Col>
						<br></br>
						<Col span={12}>
							<Input ref={roomWidth} placeholder='width' type='number' value={spatialData?.dimension3D?.width} />
						</Col>
						<br></br>
						<Col span={12}>
							<Input ref={roomHeight} placeholder='height' type='number' value={spatialData?.dimension3D?.height} />
						</Col>
					</Row>
				</>
			)}
		</Modal>
	);
}
