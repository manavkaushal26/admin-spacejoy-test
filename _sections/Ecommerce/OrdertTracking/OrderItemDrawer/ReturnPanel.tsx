import { PlusOutlined } from "@ant-design/icons";
import { getOrderItemApi, reasonApi } from "@api/ecommerceApi";
import {
	EcommerceStatus,
	EcommerceStatusPosition,
	EcommerceStatusReverseMap,
	OrderItems,
	ReasonModel,
	ReturnCancelledInterface,
} from "@customTypes/ecommerceTypes";
import fetcher from "@utils/fetcher";
import {
	Button,
	Card,
	Col,
	Divider,
	Form,
	Input,
	Modal,
	notification,
	Row,
	Select,
	Spin,
	Steps,
	Typography,
} from "antd";
import React, { useEffect, useState } from "react";

const { Text } = Typography;

interface ReturnPanel {
	returnData: ReturnCancelledInterface;
	entryId: string;
	setOrderItemData: (data: Partial<OrderItems>) => void;
}

const ReturnPanel: React.FC<ReturnPanel> = ({ returnData, entryId, setOrderItemData }) => {
	const [loading, setLoading] = useState<boolean>(false);
	const [reasons, setReasons] = useState<ReasonModel[]>([]);

	const fetchReasons = async () => {
		const endPoint = `${reasonApi()}?type=Return`;

		try {
			const response = await fetcher({ endPoint, method: "GET" });

			if (response.statusCode <= 300) {
				setReasons(response.data.reasons);
			} else {
				throw new Error();
			}
		} catch (e) {
			notification.error({ message: "Failed to fetch reasons" });
		}
	};

	useEffect(() => {
		fetchReasons();
	}, []);

	const onAddReason = async data => {
		const body = {
			...data,
			type: "Return",
		};

		const endPoint = reasonApi();

		try {
			const response = await fetcher({ endPoint, method: "POST", body });
			if (response.statusCode <= 300) {
				setReasons([response.data, ...reasons]);
			}
		} catch (e) {
			notification.error({ message: "Failed to add reason" });
		}
	};

	const onFinish = async formData => {
		setLoading(true);
		const endPoint = `${getOrderItemApi(entryId)}/orderItemReturns${returnData ? `/${returnData._id}` : ""}`;

		try {
			const response = await fetcher({ endPoint, method: returnData ? "PUT" : "POST", body: formData });
			if (response.statusCode <= 300) {
				setOrderItemData({ return: response.data, status: formData.status });
			} else {
				throw new Error();
			}
		} catch (e) {
			notification.error({ message: "Failed to update return status" });
		}
		setLoading(false);
	};

	const onClickFinish = data => {
		Modal.confirm({
			title: returnData
				? "This will modify the status of return. Are you sure you want to continue?"
				: "This will initiate the return process. Are you sure you want to continue?",
			onOk: () => onFinish(data),
		});
	};

	return (
		<Spin spinning={loading}>
			<Row gutter={[8, 16]}>
				<Col span={24}>
					{returnData ? (
						<Row gutter={[8, 16]}>
							<Col span={24}>
								<Steps size='small' current={EcommerceStatusPosition[returnData?.status]}>
									<Steps.Step status='finish' title={EcommerceStatusReverseMap[EcommerceStatus.Initiated]} />
									{returnData.status !== EcommerceStatus.Initiated ? (
										<Steps.Step status='finish' title={EcommerceStatusReverseMap[returnData.status]} />
									) : (
										<Steps.Step status='process' title='Awaiting Confirmation' />
									)}
								</Steps>
							</Col>
							{returnData?.status === EcommerceStatus.Declined && (
								<Col span={24}>
									<Row gutter={[4, 4]}>
										<Col span={24}>
											<Text strong mark>
												Reason why it was declined
											</Text>
										</Col>
										<Col span={24}>
											<Text mark>{returnData?.declineComment || "Not Provided"}</Text>
										</Col>
									</Row>
								</Col>
							)}
							<Col span={24}>
								<Row gutter={[4, 4]}>
									<Col span={24}>
										<Text strong>Reason</Text>
									</Col>
									<Col span={24}>{returnData?.reason}</Col>
								</Row>
							</Col>
							<Col span={24}>
								<Row gutter={[4, 4]}>
									<Col span={24}>
										<Text strong>Comment</Text>
									</Col>
									<Col span={24}>{returnData?.comment}</Col>
								</Row>
							</Col>
						</Row>
					) : (
						<Text strong>Return not Initiated</Text>
					)}
				</Col>
				<Col span={24}>
					<Card size='small' title={returnData ? "Update Status" : "Initiate Return"}>
						<Form
							initialValues={{
								status: "",
							}}
							labelCol={{ span: 24 }}
							onFinish={onClickFinish}
						>
							{returnData ? (
								<>
									<Form.Item label='Status' name='status' rules={[{ required: true }]}>
										<Select>
											{Object.entries(EcommerceStatus)
												.filter(([, value]) => value !== returnData.status)
												.map(([key, value]) => {
													return (
														<Select.Option value={value} key={key}>
															{key}
														</Select.Option>
													);
												})}
										</Select>
									</Form.Item>

									<Form.Item
										noStyle
										shouldUpdate={(prevValues, currentValues) => prevValues.status !== currentValues.status}
									>
										{({ getFieldValue }) => {
											return getFieldValue("status") === EcommerceStatus.Declined ? (
												<Form.Item name='declineComment' label='Reason' rules={[{ required: true }]}>
													<Input />
												</Form.Item>
											) : null;
										}}
									</Form.Item>

									<Form.Item>
										<Button htmlType='submit' type='primary'>
											Save
										</Button>
									</Form.Item>
								</>
							) : (
								<>
									<Form.Item label='Reason' name='reasonId' rules={[{ required: true }]}>
										<Select
											dropdownRender={menu => {
												return (
													<>
														{menu}
														<Divider style={{ margin: "4px 0" }} />
														<Form onFinish={onAddReason}>
															<Row style={{ flexWrap: "nowrap" }}>
																<Form.Item style={{ margin: "0" }} name='label' rules={[{ required: true }]}>
																	<Input />
																</Form.Item>
																<Form.Item style={{ margin: "0" }}>
																	{({ getFieldValue }) => (
																		<Button htmlType='submit' disabled={!getFieldValue("label")} type='link'>
																			<PlusOutlined />
																			Add
																		</Button>
																	)}
																</Form.Item>
															</Row>
														</Form>
													</>
												);
											}}
										>
											{reasons.map(reason => (
												<Select.Option key={reason._id} value={reason._id}>
													{reason.label}
												</Select.Option>
											))}
										</Select>
									</Form.Item>
									<Form.Item label='Comment' name='comment' rules={[{ required: true }]}>
										<Input />
									</Form.Item>
									<Form.Item>
										<Button htmlType='submit' type='primary'>
											Save
										</Button>
									</Form.Item>
								</>
							)}
						</Form>
					</Card>
				</Col>
			</Row>
		</Spin>
	);
};

export default ReturnPanel;
