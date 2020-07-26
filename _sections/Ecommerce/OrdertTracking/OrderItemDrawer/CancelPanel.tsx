import { getOrderItemApi } from "@api/ecommerceApi";
import {
	EcommerceStatus,
	EcommerceStatusPosition,
	EcommerceStatusReverseMap,
	OrderItems,
	ReturnCancelledInterface,
} from "@customTypes/ecommerceTypes";
import fetcher from "@utils/fetcher";
import { Button, Card, Col, Form, Input, Modal, notification, Row, Select, Spin, Steps, Typography } from "antd";
import React, { useState } from "react";

const { Text } = Typography;

interface CancelPanel {
	cancelData: ReturnCancelledInterface;
	entryId: string;
	setOrderItemData: (data: Partial<OrderItems>) => void;
}

const CancelPanel: React.FC<CancelPanel> = ({ cancelData, entryId, setOrderItemData }) => {
	const [loading, setLoading] = useState<boolean>(false);

	const onFinish = async formData => {
		setLoading(true);
		const endPoint = `${getOrderItemApi(entryId)}/orderItemCancellations${cancelData ? `/${cancelData._id}` : ""}`;

		try {
			const response = await fetcher({ endPoint, method: cancelData ? "PUT" : "POST", body: formData });
			if (response.statusCode <= 300) {
				setOrderItemData({ cancellation: response.data });
			} else {
				throw new Error();
			}
		} catch (e) {
			notification.error({ message: "Failed to update cancel status" });
		}
		setLoading(false);
	};

	const onClickFinish = data => {
		Modal.confirm({
			title: cancelData
				? "This will modify the status of the Cancellation process. Are you sure you want to continue?"
				: "This will initiate the Cancellation process. Are you sure you want to continue?",
			onOk: () => onFinish(data),
		});
	};

	return (
		<Spin spinning={loading}>
			<Row gutter={[8, 16]}>
				<Col span={24}>
					{cancelData ? (
						<Row gutter={[8, 16]}>
							<Col span={24}>
								<Steps size='small' current={EcommerceStatusPosition[cancelData?.status]}>
									<Steps.Step status='finish' title={EcommerceStatusReverseMap[EcommerceStatus.Initiated]} />
									{cancelData.status !== EcommerceStatus.Initiated ? (
										<Steps.Step status='finish' title={EcommerceStatusReverseMap[cancelData.status]} />
									) : (
										<Steps.Step status='process' title='Awaiting Confirmation' />
									)}
								</Steps>
							</Col>
							{cancelData?.status === EcommerceStatus.Declined && (
								<Col span={24}>
									<Row gutter={[4, 4]}>
										<Col span={24}>
											<Text strong mark>
												Reason for Declination
											</Text>
										</Col>
										<Col span={24}>
											<Text mark>{cancelData?.declineComment || "Not Provided"}</Text>
										</Col>
									</Row>
								</Col>
							)}
							<Col span={24}>
								<Row gutter={[4, 4]}>
									<Col span={24}>
										<Text strong>Reason</Text>
									</Col>
									<Col span={24}>{cancelData?.reason}</Col>
								</Row>
							</Col>
							<Col span={24}>
								<Row gutter={[4, 4]}>
									<Col span={24}>
										<Text strong>Comment</Text>
									</Col>
									<Col span={24}>{cancelData?.comment}</Col>
								</Row>
							</Col>
						</Row>
					) : (
						<Text strong>Cancel not Initiated</Text>
					)}
				</Col>
				<Col span={24}>
					<Card size='small' title={cancelData ? "Update Status" : "Initiate Cancellation"}>
						<Form
							initialValues={{
								status: "",
							}}
							labelCol={{ span: 24 }}
							onFinish={onClickFinish}
						>
							{cancelData ? (
								<>
									<Form.Item label='Status' name='status' rules={[{ required: true }]}>
										<Select disabled={cancelData.status !== EcommerceStatus.Initiated}>
											{Object.entries(EcommerceStatus)
												.filter(([, value]) => value !== cancelData.status)
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
													<Input disabled={cancelData.status !== EcommerceStatus.Initiated} />
												</Form.Item>
											) : null;
										}}
									</Form.Item>
									<Form.Item>
										<Button disabled={cancelData.status !== EcommerceStatus.Initiated} htmlType='submit' type='primary'>
											Save
										</Button>
									</Form.Item>
								</>
							) : (
								<>
									<Form.Item label='Reason' name='reason' rules={[{ required: true }]}>
										<Input />
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

export default CancelPanel;
