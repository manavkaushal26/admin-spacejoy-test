import { getCapturePaymentApi, getOrderPaymentApi } from "@api/ecommerceApi";
import { OrderPayments } from "@customTypes/ecommerceTypes";
import { getValueSafely } from "@utils/commonUtils";
import config from "@utils/config";
import fetcher from "@utils/fetcher";
import {
	Button,
	Col,
	Collapse,
	Drawer,
	Form,
	Input,
	InputNumber,
	Modal,
	notification,
	Row,
	Spin,
	Table,
	Typography
} from "antd";
import { useForm } from "antd/lib/form/Form";
import moment from "moment";
import React, { useEffect, useState } from "react";
import CapturePaymentsModal from "./capturePayments";

const { Text } = Typography;

interface PaymentsDrawer {
	orderId: string;
	open: boolean;
	toggleDrawer: () => void;
	originalAmount: number;
	amount: number;
}

const PaymentsDrawer: React.FC<PaymentsDrawer> = ({ orderId, open, toggleDrawer, amount, originalAmount }) => {
	const [paymentDetails, setPaymentDetails] = useState<OrderPayments[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const [paymentRecord, setPaymentRecord] = useState<OrderPayments>();
	const [paymentModalVisible, setPaymentModalVisible] = useState<boolean>(false);
	const [form] = useForm();

	const fetchAndPopulatePaymentDetails = async () => {
		setLoading(true);
		const endPoint = getOrderPaymentApi(orderId);
		try {
			const response = await fetcher({ endPoint, method: "GET" });
			if (response.statusCode <= 300) {
				setPaymentDetails(response.data);
			} else {
				throw new Error();
			}
		} catch (e) {
			notification.error({ message: "Failed to fetch Payment details" });
		}
		setLoading(false);
	};

	const createNewPaymentOrder = async data => {
		setLoading(true);
		const endPoint = getOrderPaymentApi(orderId);
		try {
			const response = await fetcher({ endPoint, method: "POST", body: { ...data, amount: data.amount } });
			if (response.statusCode <= 300) {
				setPaymentDetails([...paymentDetails, response.data]);
				form.setFieldsValue({ provider: "stripe", amount: 0 });
			} else {
				throw new Error();
			}
		} catch (e) {
			notification.error({ message: "Failed to create payment order" });
		}
		setLoading(false);
	};

	const confirmCreate = data => {
		Modal.confirm({
			title: `This will create a payment order for $${data.amount}. Proceed?`,
			onOk: () => createNewPaymentOrder(data),
		});
	};

	useEffect(() => {
		if (open) {
			fetchAndPopulatePaymentDetails();
			form.setFieldsValue({ provider: "stripe", amount: originalAmount ? amount - originalAmount : 0 });
		}
	}, [open]);

	const capturePayment = async (paymentId, data) => {
		const endPoint = getCapturePaymentApi();
		togglePaymentModal();
		try {
			const response = await fetcher({
				endPoint,
				method: "POST",
				body: {
					orderId,
					paymentId,
					...data,
				},
			});
			if (response.statusCode < 300) {
				const modifiedOrderResponse = paymentDetails.map(payment => {
					if (payment._id === paymentId) {
						return {
							...response.data,
							amount: response.data.amount / 100,
							meta: {
								...response?.data?.meta,
								charge: {
									...response?.data?.meta?.charge,
									amount_refunded: response?.data?.meta?.charge?.amount_refunded,
								},
							},
						};
					}
					return payment;
				});
				notification.success({ message: "Payment captured successfully" });
				setPaymentDetails(modifiedOrderResponse);
			} else {
				notification.error({ message: response.data.message });
			}
		} catch (e) {
			notification.error({ message: "Failed to intitate payment" });
		}
	};

	const confirmCapturePayment = (paymentId, data) => {
		const { amount } = data;
		Modal.confirm({
			title: `$${amount} will be debited from the user's card. Do you want to continue?`,
			onOk: () => capturePayment(paymentId, data),
		});
	};

	const togglePaymentModal = (record?: OrderPayments) => {
		setPaymentModalVisible(!!record);
		setPaymentRecord(record);
	};

	return (
		<Drawer title='Payment Details' width={480} visible={open} onClose={toggleDrawer}>
			<Spin spinning={loading}>
				<Row gutter={[4, 16]}>
					{originalAmount && originalAmount !== amount && (
						<Col span={24}>
							<Collapse>
								<Collapse.Panel key='payment' header='Create new payment'>
									<Form
										form={form}
										initialValues={{ provider: "stripe", amount: originalAmount ? amount - originalAmount : 0 }}
										onFinish={confirmCreate}
										labelCol={{ span: 24 }}
									>
										<Form.Item label='Amount' name='amount' rules={[{ required: true, type: "number", min: 0 }]}>
											<InputNumber style={{ width: "100%" }} />
										</Form.Item>
										<Form.Item name='provider' label='Provider'>
											<Input disabled />
										</Form.Item>
										<Form.Item>
											<Button htmlType='submit' type='primary'>
												Create
											</Button>
										</Form.Item>
									</Form>
								</Collapse.Panel>
							</Collapse>
						</Col>
					)}
					<Col span={24}>
						<Table dataSource={paymentDetails} rowKey='_id'>
							<Table.Column
								title='Amount'
								dataIndex='amount'
								render={(_, record: OrderPayments) => {
									return (
										<Row>
											<Col span={24}>
												${record.amount - getValueSafely(() => record.meta.charge.amount_refunded / 100, 0)}
											</Col>
											{record?.meta?.charge?.amount_refunded && record?.meta?.charge?.amount_refunded > 0 ? (
												<Col span={24}>
													<Text type='secondary'>
														<small>${getValueSafely(() => record.meta.charge.amount_refunded / 100, 0)} refunded</small>
													</Text>
												</Col>
											) : (
												<></>
											)}
										</Row>
									);
								}}
							/>
							<Table.Column
								title='Expires'
								render={(_, record: OrderPayments) => {
									const createdAt = moment(record.createdAt);
									const endDate = createdAt.clone().add(7, "days");
									const duration = moment.duration(endDate.diff(moment())).asDays();

									return (
										<Text type={duration <= 3 && !record.capture ? "danger" : undefined}>{endDate.fromNow()}</Text>
									);
								}}
							/>
							<Table.Column
								title='Receipt'
								render={(_, record: OrderPayments) => {
									return (
										<Text>
											{record.receipt ? (
												<a href={record.receipt} rel='noopener noreferrer' target='_blank'>
													Open receipt
												</a>
											) : (
												"No receipt generated"
											)}
										</Text>
									);
								}}
							/>
							<Table.Column
								title='Action'
								render={(_, record: OrderPayments) => {
									return (
										<>
											{!record.capture && !!record.chargeId ? (
												<Button type='link' onClick={() => togglePaymentModal(record)}>
													Debit Amount
												</Button>
											) : (
												<>
													{record.paymentId && !record.capture ? (
														<Text
															copyable={{
																text: `${config.company.customerPortalLink}/checkout/payment/${record.paymentId}`,
																tooltips: ["Copy Payment URL", "Copied!"],
															}}
														>
															Copy URL
														</Text>
													) : (
														"Debited"
													)}
												</>
											)}
										</>
									);
								}}
							/>
						</Table>
					</Col>
				</Row>
			</Spin>
			<CapturePaymentsModal
				open={paymentModalVisible}
				toggleModal={togglePaymentModal}
				onComplete={confirmCapturePayment}
				id={paymentRecord?._id}
				initialValue={paymentRecord?.amount}
			/>
		</Drawer>
	);
};

export default PaymentsDrawer;
