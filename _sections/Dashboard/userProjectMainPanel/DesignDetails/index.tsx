import { LinkOutlined, MinusCircleOutlined } from "@ant-design/icons";
import { editDesignApi, getThemes } from "@api/designApi";
import { DetailedDesign, RoomLabels, RoomTypes, ThemeInterface } from "@customTypes/dashboardTypes";
import { company } from "@utils/config";
import fetcher from "@utils/fetcher";
import { Button, Col, DatePicker, Form, Input, notification, Row, Select } from "antd";
import { useForm } from "antd/lib/form/Form";
import moment from "moment";
import React, { useEffect, useState } from "react";
interface DesignDetails {
	designData: Partial<DetailedDesign>;
	setDesignData: React.Dispatch<React.SetStateAction<DetailedDesign>>;
	setDesignLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const DesignDetails: React.FC<DesignDetails> = ({ designData, setDesignData, setDesignLoading }) => {
	const [themes, setThemes] = useState<ThemeInterface[]>([]);
	const [roomType, setRoomType] = useState<RoomTypes>(RoomTypes.LivingRoom);
	const [seoKeywords, setSeoKeywords] = useState<Array<string>>([]);
	const [form] = useForm();

	const onClickOk = async (formData): Promise<void> => {
		setDesignLoading(true);
		const endPoint = editDesignApi(designData._id);
		const response = await fetcher({
			endPoint,
			method: "PUT",
			body: {
				data: {
					...formData,
					attributeList: formData.attributeList.map(attribute => ({
						text: attribute,
					})),
					publishedDate: formData.publishedDate?.toISOString(),
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
			form.setFieldsValue({
				...designData,
				attributeList: designData.attributeList.map(elem => elem.text),
				publishedDate: moment(designData.publishedDate),
			});
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

	const openInNewWindow = (roomType, slug): void => {
		if (slug && roomType) {
			const roomName = roomType.toLowerCase().split(" ").join("-");
			const url = `${company.customerPortalLink}/interior-designs/${roomName}-ideas/${slug}`;
			window.open(url, "_blank", "noopener");
		}
	};

	const fetchKeywords = async (): Promise<void> => {
		// try {
		// 	const resData = await fetcher({ endPoint: "/v1/seoKeywords", method: "GET"});
		// 	const { data, statusCode } = resData;
		// 	if (statusCode && statusCode <= 201) {
		// 		return data;
		// 	} else {
		// 		throw new Error();
		// 	}
		// } catch {
		// 	throw new Error();
		// }
		setSeoKeywords(["boho", "traditional", "simple", "test"]);
	};

	return (
		<Form labelCol={{ span: 24 }} form={form} onFinish={onClickOk}>
			<Row gutter={[8, 8]}>
				<Col span={24}>
					<Form.Item noStyle shouldUpdate>
						{({ getFieldValue }) => {
							return (
								<Form.Item name='slug' label='Slug'>
									<Input
										suffix={
											<LinkOutlined
												onClick={() => openInNewWindow(getFieldValue(["searchKey", "roomType"]), getFieldValue("slug"))}
											/>
										}
									/>
								</Form.Item>
							);
						}}
					</Form.Item>
				</Col>
				<Col span={12}>
					<Form.Item name='name' label='Title'>
						<Input />
					</Form.Item>
				</Col>
				<Col span={12}>
					<Form.Item name='metaTitle' label='Meta title'>
						<Input />
					</Form.Item>
				</Col>
				<Col span={24}>
					<Form.Item name='headingOneTag' label='H1 text'>
						<Input />
					</Form.Item>
				</Col>
				<Col span={24}>
					<Form.Item name='description' label='Designer Description'>
						<Input.TextArea />
					</Form.Item>
				</Col>
				<Col span={24}>
					<Form.Item name='longDescription' label='Long Description'>
						<Input.TextArea />
					</Form.Item>
				</Col>
				<Col span={24}>
					<Form.Item name='metaDescription' label='Meta Description'>
						<Input.TextArea />
					</Form.Item>
				</Col>

				<Col span={8}>
					<Form.Item name='altTag' label='Image Alt tag'>
						<Input />
					</Form.Item>
				</Col>
				<Col span={8}>
					<Form.Item name='publishedDate' label='Published Date'>
						<DatePicker style={{ width: "100%" }} />
					</Form.Item>
				</Col>
				<Col span={8}>
					<Form.Item name={["searchKey", "roomType"]} label='Room Type'>
						<Select style={{ width: "100%" }} onChange={(value): void => setRoomType(value)} value={roomType}>
							{Object.keys(RoomTypes).map(key => {
								return (
									<Select.Option key={key} value={RoomTypes[key]}>
										{RoomLabels[key]}
									</Select.Option>
								);
							})}
						</Select>
					</Form.Item>
				</Col>
				<Col span={8}>
					<Form.Item name='theme' label='Theme'>
						<Select showSearch optionFilterProp='children' style={{ width: "100%" }}>
							{themes.map(theme => {
								return (
									<Select.Option key={theme._id} value={theme._id}>
										{theme.name}
									</Select.Option>
								);
							})}
						</Select>
					</Form.Item>
				</Col>
				<Col span={8}>
					<Form.Item name='tags' label='Tags'>
						<Select open={false} style={{ width: "100%" }} mode='tags' tokenSeparators={[","]} />
					</Form.Item>
				</Col>
				<Col span={8}>
					<Form.Item name='keywords' label='Keywords'>
						<Select allowClear onFocus={fetchKeywords} style={{ width: "100%" }} mode='tags' tokenSeparators={[","]}>
							{console.log("seoKeywords", seoKeywords)}
							{seoKeywords.map(item => (
								<Select.Option value={item}>{item}</Select.Option>
							))}
						</Select>
					</Form.Item>
				</Col>
				<Col span={24}>
					<Form.List name='attributeList'>
						{(fields, { add, remove }, { errors }) => {
							return (
								<Row gutter={[8, 8]}>
									{fields.map((field, index) => {
										return (
											<Col key={field.key} span={24}>
												<Form.Item
													label={index === 0 ? "Bullet Points" : ""}
													required={false}
													rules={[{ required: true }]}
												>
													<Form.Item
														rules={[{ required: true, message: "Enter a value or delete this entry" }]}
														{...field}
														noStyle
													>
														<Input
															placeholder='Bullet Points'
															suffix={<MinusCircleOutlined onClick={() => remove(field.name)} />}
														/>
													</Form.Item>
												</Form.Item>
											</Col>
										);
									})}
									<Col span={24}>
										<Form.ErrorList errors={errors} />
									</Col>
									<Col span={24}>
										<Form.Item>
											<Button style={{ width: "100%" }} onClick={() => add()}>
												Add Bullet Point
											</Button>
										</Form.Item>
									</Col>
								</Row>
							);
						}}
					</Form.List>
				</Col>
				<Col span={24}>
					<Form.Item>
						<Button block type='primary' htmlType='submit'>
							Save
						</Button>
					</Form.Item>
				</Col>
			</Row>
		</Form>
	);
};

export default DesignDetails;
