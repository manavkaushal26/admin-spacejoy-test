import fetcher from "@utils/fetcher";
import { Button, Col, Input, Modal, notification, Row, Spin, Typography } from "antd";
import React, { useRef, useState } from "react";
import styled from "styled-components";
const { Title } = Typography;

const Wrapper = styled.div`
	.ant-col {
		margin-bottom: 15px;
	}
	p {
		margin: 0;
	}
	input[type="file"],
	input[type="file"]::-webkit-file-upload-button {
		cursor: pointer;
		z-index: 12;
	}
`;

const StyledInput = styled(Input)`
	opacity: 0;
	position: absolute;
	left: 0;
	top: 0;
	cursor: pointer;
	z-index: 10;
`;

export default function index({
	createRoomModalVisible,
	roomType,
	setCreateRoomModalVisible,
	fetchRoomData,
	roomData,
}) {
	const roomName = useRef(null);
	const [roomCover, setRoomCover] = useState({});
	const [roomGlb, setRoomGlb] = useState({});
	const [roomSource, setRoomSource] = useState({});
	const [isLoading, setLoader] = useState(false);
	const handleSave = async () => {
		if (roomName?.current && roomName?.current?.state.value) {
			const payload = {
				name: roomName?.current?.state.value,
				description: null,
				scope: "template",
				roomType: roomType,
				spatialData: {
					dimension3D: {
						depth: "",
						width: "",
						height: "",
					},
				},
			};
			const response = await fetcher({ endPoint: "/room", method: "POST", body: { data: payload } });
			if (response.statusCode <= 300) {
				notification.success({ message: "Successfully created" });
				refreshData();
				flushLocalData();
			} else {
				notification.error({ message: "Failed to create" });
			}
		}
	};

	const handleUpload = async () => {
		const roomCoverPayload = new FormData();
		roomCoverPayload.append("image", roomCover);

		const roomGlbPayload = new FormData();
		roomGlbPayload.append("file", roomGlb);

		const roomSourcePayload = new FormData();
		roomSourcePayload.append("file", roomSource);
		setLoader(true);
		const [res1, res2, res3] = await Promise.all([
			fetcher({
				endPoint: `/room/${roomData?._id}/upload-cover`,
				method: "POST",
				isMultipartForm: true,
				body: roomCoverPayload,
			}),
			fetcher({
				endPoint: `/room/${roomData?._id}/upload-file?filetype=glb`,
				method: "POST",
				isMultipartForm: true,
				body: roomGlbPayload,
			}),
			fetcher({
				endPoint: `/room/${roomData?._id}/upload-file?filetype=source`,
				method: "POST",
				isMultipartForm: true,
				body: roomSourcePayload,
			}),
		]);
		refreshData();
	};

	const refreshData = () => {
		fetchRoomData();
		setLoader(false);
		setCreateRoomModalVisible(false);
	};

	const flushLocalData = () => {
		roomName.current.state.value = "";
	};

	const onRoomCoverUpload = e => {
		setRoomCover(e.target.files[0]);
	};

	const onRoomGlbUpload = e => {
		setRoomGlb(e.target.files[0]);
	};

	const onRoomSourceUpload = e => {
		setRoomSource(e.target.files[0]);
	};

	const isEditMode = Object.keys(roomData).length;
	return (
		<Modal
			visible={createRoomModalVisible}
			zIndex={9999}
			footer={[
				<Button type='primary' onClick={isEditMode ? handleUpload : handleSave} key='button-save'>
					Create
				</Button>,
			]}
			onCancel={() => setCreateRoomModalVisible(false)}
			width={500}
		>
			<Wrapper>
				<Spin spinning={isLoading}>
					{isEditMode ? (
						<Row>
							<Col span={12}>
								<p>Room Cover Image</p>
								<Button style={{ position: "relative" }} type='primary'>
									<StyledInput onChange={e => onRoomCoverUpload(e)} placeholder='Room Cover Image' type='file' />
									Upload &nbsp;
									<span>{roomCover?.name}</span>
								</Button>
							</Col>
							<Col span={12}>
								<p>Room 3D File (glb)</p>
								<Button style={{ position: "relative" }} type='primary'>
									<StyledInput onChange={e => onRoomGlbUpload(e)} placeholder='Room 3D File (glb)' type='file' />
									Upload &nbsp;
									<span>{roomGlb?.name}</span>
								</Button>
							</Col>
							<br></br>
							<br></br>
							<Col span={12}>
								<p>Room 3D File (source)</p>
								<Button style={{ position: "relative" }} type='primary'>
									<StyledInput onChange={e => onRoomSourceUpload(e)} placeholder='Room 3D File (source)' type='file' />
									Upload &nbsp;
									<span>{roomSource?.name}</span>
								</Button>
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
						</>
					)}
				</Spin>
			</Wrapper>
		</Modal>
	);
}
