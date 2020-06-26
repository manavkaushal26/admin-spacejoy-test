import { createDesignApi, getRoomsListApi } from "@api/designApi";
import Image from "@components/Image";
import { DetailedDesign, RoomType, RoomTypes, RoomLabels } from "@customTypes/dashboardTypes";
import fetcher from "@utils/fetcher";
import { Button, Card, Col, Input, message, Radio, Row, Typography, Pagination, Select } from "antd";
import React, { useEffect, useState } from "react";
import { getValueSafely } from "@utils/commonUtils";
import { SizeAdjustedModal } from "@sections/AssetStore/styled";
import { RadioChangeEvent } from "antd/lib/radio";
import styled from "styled-components";
import { Status } from "@customTypes/userType";

const { Option } = Select;
const { Text } = Typography;

interface CreateDesignModal {
	toggleModal: () => void;
	createDesignModalVisible: boolean;
	onCreate: (data: DetailedDesign) => void;
	designScope: "project" | "portfolio";
}

const Footer: React.FC<{
	roomName: string;
	toggleModal: () => void;
	onSubmit: () => void;
	selectedRoomId: string;
	loading: boolean;
}> = ({ roomName, toggleModal, onSubmit, loading, selectedRoomId }) => {
	const disabled = !roomName || !selectedRoomId;
	return (
		<>
			<Button onClick={toggleModal}>Cancel</Button>
			<Button type="primary" loading={loading} onClick={onSubmit} disabled={disabled}>
				Submit
			</Button>
		</>
	);
};

const StyledRadio = styled(Radio)`
	.ant-radio-inner {
		display: none;
	}
	&.ant-radio-wrapper-checked::after {
		position: absolute;
		top: 20px;
		right: 0px;
		height: 35px;
		width: 35px;
		border-bottom-left-radius: 40px;
		background: #52c41a;
		content: "✓";
		padding: 0 0 8px 8px;
		display: flex;
		justify-content: center;
		align-items: center;
		color: white;
		font-size: 1.25em;
	}
`;

const CreateDesignModal: React.FC<CreateDesignModal> = ({
	toggleModal,
	createDesignModalVisible,
	onCreate,
	designScope = "project",
}) => {
	const [selectedRoomId, setSelectedRoomId] = useState<string>(null);
	const [roomName, setRoomName] = useState<string>(null);
	const [roomType, setRoomType] = useState<RoomTypes>(RoomTypes.LivingRoom);
	const [roomData, setRoomData] = useState<RoomType[]>([]);
	const [pageNo, setPageNo] = useState<number>(1);
	const [noOfRooms, setNoOfRooms] = useState<number>(0);
	const [loading, setLoading] = useState<boolean>(false);
	const onChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
		const {
			target: { value },
		} = e;
		setRoomName(value);
	};

	const fetchRoomData = async (): Promise<void> => {
		const api = getRoomsListApi("template", roomType);
		const endPoint = `${api}&skip=${(pageNo - 1) * 12}&limit=12`;
		const response = await fetcher({ endPoint, method: "GET" });
		if (response.statusCode <= 300) {
			setRoomData(response.data.data);
			setNoOfRooms(response.data.count);
		}
	};

	useEffect(() => {
		return (): void => {
			setSelectedRoomId(null);
			setRoomName(null);
			setRoomType(RoomTypes.LivingRoom);
			setRoomData(null);
			setPageNo(1);
			setNoOfRooms(0);
			setLoading(false);
		};
	}, []);

	useEffect(() => {
		fetchRoomData();
	}, [pageNo, roomType]);

	const onSelect = (value: RoomTypes): void => {
		if (value) {
			setRoomType(value);
		}
	};

	const onSubmit = async (): Promise<void> => {
		setLoading(true);
		const endpoint = createDesignApi();
		const response = await fetcher({
			endPoint: endpoint,
			method: "POST",
			body: {
				data: {
					name: roomName,
					project: null,
					room: selectedRoomId,
					designScope,
					status: Status.pending,
				},
			},
		});
		if (response.statusCode <= 300) {
			const designData: DetailedDesign = response.data;
			onCreate(designData);
			message.success("Design Created Succesfully");
			toggleModal();
		} else {
			message.error(response.message);
		}
		setLoading(false);
	};

	const handleRadio = (e: RadioChangeEvent): void => {
		const {
			target: { value },
		} = e;
		setSelectedRoomId(value);
	};

	return (
		<SizeAdjustedModal
			destroyOnClose
			visible={createDesignModalVisible}
			title="Create Design"
			onCancel={toggleModal}
			footer={
				<Footer
					roomName={roomName}
					selectedRoomId={selectedRoomId}
					toggleModal={toggleModal}
					onSubmit={onSubmit}
					loading={loading}
				/>
			}
		>
			<Row gutter={[16, 16]}>
				<Col md={12}>
					<Row>
						<Col>
							<Text>Design Name</Text>
						</Col>
						<Col>
							<Input value={roomName} placeholder="Design Name" onChange={onChange} />
						</Col>
					</Row>
				</Col>
				<Col md={12}>
					<Row>
						<Col>
							<Text>Room Type</Text>
						</Col>
						<Select style={{ width: "100%" }} onChange={onSelect} value={roomType}>
							{Object.keys(RoomTypes).map(key => {
								return (
									<Option key={key} value={RoomTypes[key]}>
										{RoomLabels[key]}
									</Option>
								);
							})}
						</Select>
					</Row>
				</Col>
				<Col md={24}>
					<Row>
						<Col>
							<Text>Room Layout</Text>
						</Col>
						<Col>
							<Radio.Group onChange={handleRadio}>
								<Row gutter={[16, 16]}>
									<Col span={24}>
										{roomData.map(room => {
											return (
												<Col key={room._id} sm={12} md={8} lg={6}>
													<StyledRadio style={{ width: "100%" }} value={room._id}>
														<Card cover={<Image src={getValueSafely(() => room.coverImageCdn, "")} />}>
															<Row>
																<Col span={24}>
																	<Text style={{ width: "100%" }} ellipsis>
																		{room.name}
																	</Text>
																</Col>
																<Col span={24}>
																	<small>{room.roomType}</small>
																</Col>
															</Row>
														</Card>
													</StyledRadio>
												</Col>
											);
										})}
									</Col>
								</Row>
							</Radio.Group>
						</Col>
					</Row>
				</Col>
				<Col span={24}>
					<Row justify="center">
						<Pagination
							hideOnSinglePage
							onChange={(number): void => setPageNo(number)}
							total={noOfRooms}
							pageSize={12}
							current={pageNo}
						/>
					</Row>
				</Col>
			</Row>
		</SizeAdjustedModal>
	);
};

export default CreateDesignModal;
