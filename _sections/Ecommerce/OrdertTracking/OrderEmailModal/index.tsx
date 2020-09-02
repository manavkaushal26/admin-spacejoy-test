import { getOrderTriggerEmailApi } from "@api/ecommerceApi";
import Image from "@components/Image";
import { EcommOrder, OrderItems, OrderItemStatus } from "@customTypes/ecommerceTypes";
import fetcher from "@utils/fetcher";
import { Button, Checkbox, Col, Form, Modal, notification, Row, Select, Typography } from "antd";
import { useForm } from "antd/lib/form/Form";
import React, { useEffect, useState } from "react";
import EmailPreviewModal from "./EmailPreviewModal";

const { Text } = Typography;

interface OrderEmailModal {
	open: boolean;
	onClose: () => void;
	orderId: string;
	orderItems: OrderItems[];
	order: EcommOrder;
}
const initialValues = {
	type: "",
	orderItemId: [],
};

const validateMessages = {
	required: "'${label}' is required!",
};

const OrderEmailModal: React.FC<OrderEmailModal> = ({ open, onClose, orderId, order, orderItems = [] }) => {
	const [form] = useForm();
	const [selectedProducts, setSelectedProducts] = useState<OrderItems[]>([]);

	const [emailPreview, setEmailPreview] = useState<boolean>(false);

	const [formData, setFormData] = useState<Record<string, string | string[]>>({});

	const toggleEmailModal = () => {
		setEmailPreview(prevState => !prevState);
	};

	const sendMailOnConfirm = async () => {
		let reducedOrderItems = {};
		if (formData.orderItemId) {
			const orderItemIds = formData.orderItemId as string[];
			reducedOrderItems = orderItemIds.reduce((acc, item) => {
				return { ...acc, [item]: true };
			}, {});
		}

		const endPoint = getOrderTriggerEmailApi(orderId);
		try {
			const response = await fetcher({
				endPoint,
				method: "POST",
				body: {
					type: formData.type,
					selectedItems: reducedOrderItems,
				},
			});
			if (response.data === "success") {
				notification.success({ message: "Email Sent Successfully" });
				form.setFieldsValue(initialValues);
				setSelectedProducts([]);
				setFormData({});
				setEmailPreview(false);
				onClose();
			} else {
				notification.error({ message: "Failed to send Email", description: response.data?.message });
			}
		} catch (e) {
			notification.error(e.message);
		}
	};

	const confirm = () => {
		if (formData.type !== "confirmed") {
			Modal.confirm({
				title: `This will trigger an order ${formData.type} email for ${formData.orderItemId.length} item${
					formData.orderItemId.length > 1 ? "s" : ""
				} to the Customer. Proceed?`,
				onOk: () => sendMailOnConfirm(),
			});
		} else {
			Modal.confirm({
				title: "This will trigger an order confirmation email to the Customer. Proceed?",
				onOk: () => sendMailOnConfirm(),
			});
		}
	};

	const onFinish = data => {
		if (data.type !== "confirmed") {
			setSelectedProducts(
				orderItems.filter(item => {
					return data.orderItemId.includes(item._id);
				})
			);
			setFormData(data);
			toggleEmailModal();
			// Modal.confirm({
			// 	title: `This will trigger an order ${data.type} email for ${data.orderItemId.length} item${
			// 		data.orderItemId.length > 1 ? "s" : ""
			// 	} to the Customer. Proceed?`,
			// 	onOk: () => sendMailOnConfirm(data),
			// });
		} else {
			setFormData(data);
			setSelectedProducts(orderItems);
			toggleEmailModal();
		}
	};

	useEffect(() => {
		form.setFieldsValue(initialValues);
	}, [open]);

	return (
		<Modal title='Email Customer' visible={open} footer={null} onCancel={onClose}>
			<Form
				form={form}
				labelCol={{ span: 24 }}
				onFinish={onFinish}
				initialValues={initialValues}
				validateMessages={validateMessages}
			>
				<Form.Item name='type' label='Email about' rules={[{ required: true }]}>
					<Select>
						<Select.Option value='confirmed'>Order Confirmed</Select.Option>
						<Select.Option value='shipped'>Order Item being Shipped</Select.Option>
						<Select.Option value='delivered'>Order Item Delivered</Select.Option>
					</Select>
				</Form.Item>
				<Form.Item shouldUpdate={(prevValues, currentValues) => prevValues.type !== currentValues.type}>
					{({ getFieldValue }) =>
						getFieldValue("type") !== "" ? (
							<Form.Item labelCol={{ span: 24 }} label='Items' name='orderItemId' rules={[{ required: true }]}>
								<Checkbox.Group style={{ width: "100%" }}>
									<Row>
										{orderItems.map(item => {
											return (
												<Col span={24} key={item._id}>
													<Checkbox style={{ display: "flex", alignItems: "center", width: "100%" }} value={item._id}>
														<Row gutter={[8, 4]} style={{ flexWrap: "nowrap", overflow: "hidden" }} align='middle'>
															<Col>
																<Image width='50px' src={item.product.cdn} />
															</Col>
															<Col>
																<Row>
																	<Col span={24}>{item.product.name}</Col>
																	<Col span={24}>
																		<Text type='secondary'>Status:{OrderItemStatus[item.status]}</Text>
																	</Col>
																</Row>
															</Col>
														</Row>
													</Checkbox>
												</Col>
											);
										})}
									</Row>
								</Checkbox.Group>
							</Form.Item>
						) : null
					}
				</Form.Item>
				<Form.Item>
					<Row justify='end'>
						<Button htmlType='submit' type='primary'>
							Review Mail
						</Button>
					</Row>
				</Form.Item>
			</Form>
			<EmailPreviewModal
				firstName={order?.firstName}
				address={order?.address}
				shippingCharge={order?.shippingCharge}
				selectedProducts={selectedProducts}
				productTotal={order?.amount}
				subTotal={(order?.amount + order?.discount - order?.shippingCharge - order?.tax).toFixed(2)}
				discount={order?.discount}
				amount={order?.amount}
				tax={order?.tax}
				visible={emailPreview}
				onOk={confirm}
				onCancel={toggleEmailModal}
				type={formData.type as string}
			/>
		</Modal>
	);
};

export default OrderEmailModal;
