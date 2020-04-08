import { getThemes } from "@api/designApi";
import { DetailedDesign, RoomLabels, RoomTypes, ThemeInterface } from "@customTypes/dashboardTypes";
import { getValueSafely } from "@utils/commonUtils";
import fetcher from "@utils/fetcher";
import { Col, Input, Modal, notification, Row, Select, Typography } from "antd";
import React, { useEffect, useState } from "react";

const { Text } = Typography;

interface EditDesignModal {
	visible: boolean;
	onCancel: () => void;
	designData: Partial<DetailedDesign>;
	onOk: (value) => void;
	publish?: boolean;
	confirmLoading: boolean;
}

const EditDesignModal: React.FC<EditDesignModal> = ({
	onOk,
	designData,
	visible,
	onCancel,
	publish,
	confirmLoading,
}) => {
	const [title, setTitle] = useState<string>();
	const [description, setDescription] = useState<string>();
	const [longDescription, setLongDescription] = useState<string>();

	const [tags, setTags] = useState<string[]>([]);
	const [themes, setThemes] = useState<ThemeInterface[]>([]);
	const [selectedTheme, setSelectedTheme] = useState<string>("");
	const [roomType, setRoomType] = useState<RoomTypes>(RoomTypes.LivingRoom);
	const [attributeList, setAttributeList] = useState<string[]>([]);
	const fetchThemes = async (): Promise<void> => {
		const endPoint = `${getThemes()}?limit=all`;

		const response = await fetcher({ endPoint, method: "GET" });

		if (response.status === "success") {
			setThemes(response.data.data);
		} else {
			notification.error({ message: "Failed to fetch Themes" });
		}
	};

	useEffect(() => {
		if (designData) {
			setTitle(designData.name);
			setDescription(designData.description);
			setSelectedTheme(designData.theme);
			setTags(designData.tags);
			setAttributeList(designData.attributeList.map(elem => elem.text));
			setLongDescription(designData.longDescription);
			setRoomType(getValueSafely(() => designData.searchKey.roomType, RoomTypes.LivingRoom));
		}
	}, [designData]);

	const handleChange = (e): void => {
		const {
			target: { name, value },
		} = e;
		if (name === "longDescription") {
			setLongDescription(value);
			return;
		}
		if (name === "description") {
			setDescription(value);
			return;
		}
		if (name === "title") {
			setTitle(value);
		}
	};

	const handleSelect = (value, type): void => {
		if (type === "tags") {
			setTags(value);
		} else if (type === "attributeList") {
			setAttributeList(value);
		} else {
			setSelectedTheme(value);
		}
	};

	useEffect(() => {
		fetchThemes();
	}, []);

	return (
		<Modal
			title={publish ? "Publish Design" : "Copy Design to Design Example"}
			visible={visible}
			confirmLoading={confirmLoading}
			onOk={(): void => {
				onOk({
					name: title,
					description,
					tags,
					theme: selectedTheme,
					longDescription,
					searchKey: {
						roomType,
					},
					attributeList: attributeList.map(elem => ({
						text: elem,
					})),
				});
			}}
			onCancel={onCancel}
		>
			<Row gutter={[8, 8]}>
				<Col span={24}>
					<Row>
						<Col span={24}>
							<Text>Title</Text>
						</Col>
						<Col span={24}>
							<Input onChange={handleChange} placeholder="Title" value={title} name="title" />
						</Col>
					</Row>
				</Col>
				<Col span={12}>
					<Row>
						<Col span={24}>
							<Text>Theme</Text>
						</Col>
						<Col span={24}>
							<Select
								showSearch
								optionFilterProp="children"
								value={selectedTheme}
								onChange={handleSelect}
								style={{ width: "100%" }}
							>
								{themes.map(theme => {
									return (
										<Select.Option key={theme._id} value={theme._id}>
											{theme.name}
										</Select.Option>
									);
								})}
							</Select>
						</Col>
					</Row>
				</Col>
				<Col span={12}>
					<Row>
						<Col>
							<Text>Room Type</Text>
						</Col>
						<Col>
							<Select style={{ width: "100%" }} onChange={setRoomType} value={roomType}>
								{Object.keys(RoomTypes).map(key => {
									return (
										<Select.Option key={key} value={RoomTypes[key]}>
											{RoomLabels[key]}
										</Select.Option>
									);
								})}
							</Select>
						</Col>
					</Row>
				</Col>
				<Col sm={24} md={12}>
					<Row>
						<Col span={24}>
							<Text>Tags</Text>
						</Col>
						<Col span={24}>
							<Select
								open={false}
								style={{ width: "100%" }}
								value={tags}
								onChange={(value): void => handleSelect(value, "tags")}
								tokenSeparators={[","]}
								mode="tags"
							/>
						</Col>
					</Row>
				</Col>
				<Col sm={24} md={12}>
					<Row>
						<Col span={24}>
							<Text>Attribute List</Text>
						</Col>
						<Col span={24}>
							<Select
								open={false}
								style={{ width: "100%" }}
								value={attributeList}
								onChange={(value: string[]): void => handleSelect(value, "attributeList")}
								tokenSeparators={["."]}
								mode="tags"
							/>
						</Col>
					</Row>
				</Col>
				<Col span={24}>
					<Row>
						<Col span={24}>
							<Text>Designer Description</Text>
						</Col>
						<Col span={24}>
							<Input.TextArea
								onChange={handleChange}
								placeholder="Description"
								value={description}
								name="description"
							/>
						</Col>
					</Row>
				</Col>

				<Col span={24}>
					<Row>
						<Col span={24}>
							<Text>Long Description</Text>
						</Col>
						<Col span={24}>
							<Input.TextArea
								onChange={handleChange}
								placeholder="Long Description"
								value={longDescription}
								name="longDescription"
							/>
						</Col>
					</Row>
				</Col>
			</Row>
		</Modal>
	);
};

export default EditDesignModal;
