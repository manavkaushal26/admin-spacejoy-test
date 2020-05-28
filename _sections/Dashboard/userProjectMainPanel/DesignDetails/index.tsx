import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Row, Col, notification, Typography, Input, Select, Button, Tooltip, Icon } from "antd";
import { getThemes, editDesignApi } from "@api/designApi";
import fetcher from "@utils/fetcher";
import { ThemeInterface, RoomTypes, DetailedDesign, RoomLabels } from "@customTypes/dashboardTypes";
import { getValueSafely } from "@utils/commonUtils";
import { Status } from "@customTypes/userType";
import { company } from "@utils/config";

const { Text } = Typography;

interface DesignDetails {
	designData: Partial<DetailedDesign>;
	setDesignData: React.Dispatch<React.SetStateAction<DetailedDesign>>;
	setDesignLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const DesignDetails: React.FC<DesignDetails> = ({ designData, setDesignData, setDesignLoading }) => {
	const [title, setTitle] = useState<string>();
	const [description, setDescription] = useState<string>();
	const [longDescription, setLongDescription] = useState<string>();
	const [tags, setTags] = useState<string[]>([]);
	const [themes, setThemes] = useState<ThemeInterface[]>([]);
	const [selectedTheme, setSelectedTheme] = useState<string>("");
	const [roomType, setRoomType] = useState<RoomTypes>(RoomTypes.LivingRoom);
	const [attributeList, setAttributeList] = useState<string[]>([]);

	const onClickOk = async (): Promise<void> => {
		setDesignLoading(true);
		const endPoint = editDesignApi(designData._id);
		const response = await fetcher({
			endPoint,
			method: "PUT",
			body: {
				data: {
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
				},
			},
		});
		if (response.statusCode <= 300) {
			setDesignData(response.data);
			notification.success({ message: "Updated Design Successfully" });
		} else {
			notification.error({ message: response.message });
			setDesignLoading(false);
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
		fetchThemes();
	}, []);

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

	const openInNewWindow = (): void => {
		const roomName = designData.room.roomType
			.toLowerCase()
			.split(" ")
			.join("-");
		const url = `${company.customerPortalLink}/interior-designs/${roomName}-ideas/${designData.slug}`;
		window.open(url, "_blank", "noopener");
	};

	return (
		<Row gutter={[8, 8]}>
			{designData.slug && (
				<Col span={24}>
					<Row gutter={[4, 4]}>
						<Col>Slug</Col>
						<Col>
							<Input
								name="slug"
								disabled
								value={designData.slug}
								addonAfter={
									<Tooltip placement="top" title="Open URL">
										<Icon onClick={openInNewWindow} type="link" />
									</Tooltip>
								}
							/>
						</Col>
					</Row>
				</Col>
			)}
			<Col span={24}>
				<Row gutter={[4, 4]}>
					<Col span={24}>
						<Text>Title</Text>
					</Col>
					<Col span={24}>
						<Input onChange={handleChange} placeholder="Title" value={title} name="title" />
					</Col>
				</Row>
			</Col>
			<Col span={12}>
				<Row gutter={[4, 4]}>
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
				<Row gutter={[4, 4]}>
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
			<Col sm={24} md={24}>
				<Row gutter={[4, 4]}>
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

			<Col span={24}>
				<Row>
					<Col span={24}>
						<Text>Designer Description</Text>
					</Col>
					<Col span={24}>
						<Input.TextArea onChange={handleChange} placeholder="Description" value={description} name="description" />
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
			<Col sm={24} md={24}>
				<Row>
					<Col span={24}>
						<Text>Bullet points</Text>
					</Col>
					<Col span={24}>
						<Select
							open={false}
							style={{ width: "100%" }}
							value={attributeList}
							onChange={(value: string[]): void => handleSelect(value, "attributeList")}
							tokenSeparators={["["]}
							mode="tags"
						/>
					</Col>
				</Row>
			</Col>
			<Col span={24}>
				<Row type="flex" justify="end">
					<Button onClick={onClickOk} type="primary" disabled={designData.status === Status.active}>
						Save Data
					</Button>
				</Row>
			</Col>
		</Row>
	);
};

export default DesignDetails;
