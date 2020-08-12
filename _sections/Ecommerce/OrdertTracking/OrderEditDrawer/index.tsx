import { getOrderApi } from "@api/ecommerceApi";
import { EcommerceOrderStatus, EcommOrder, OrderItems as OrderItem } from "@customTypes/ecommerceTypes";
import fetcher from "@utils/fetcher";
import { Button, Col, Drawer, Form, Input, InputNumber, Modal, notification, Row, Select } from "antd";
import React from "react";

interface OrderEditDrawer {
	orderData: EcommOrder;
	open: boolean;
	closeDrawer: () => void;
	setOrderData: (data: Partial<OrderItem>) => void;
}

const OrderEditDrawer: React.FC<OrderEditDrawer> = ({ orderData, open, closeDrawer, setOrderData }) => {
	const onFinish = async formData => {
		const endPoint = getOrderApi(orderData._id);
		try {
			const response = await fetcher({ endPoint, method: "PUT", body: formData });
			if (response.statusCode <= 200) {
				setOrderData({
					...orderData,
					...response.data,
				});
			} else {
				throw new Error();
			}
		} catch (_e) {
			notification.error({ message: "Failed to update Order" });
		}
	};

	const onClickFinish = data => {
		Modal.confirm({
			title: "This will modify Order details. Are you sure you want to continue?",
			onOk: () => onFinish(data),
		});
	};

	return (
		<Drawer width={360} visible={open} onClose={() => closeDrawer()} title='Edit Order'>
			<Row>
				<Col span={24}>
					<Form
						labelCol={{ span: 24 }}
						initialValues={{
							firstName: orderData.firstName,
							lastName: orderData.lastName,
							phoneNumber: orderData.phoneNumber,
							status: orderData.status,
							address: orderData.address,
							shippingCharge: parseFloat(orderData.shippingCharge.toFixed(2)),
							tax: parseFloat(orderData.tax.toFixed(2)),
							amount: parseFloat(orderData.amount.toFixed(2)),
							discount: parseFloat(orderData.discount.toFixed(2)),
						}}
						onFinish={onClickFinish}
					>
						{false && (
							<>
								<Form.Item label='First Name' name='firstName' rules={[{ required: true }]}>
									<Input />
								</Form.Item>
								<Form.Item label='Last Name' name='lastName'>
									<Input />
								</Form.Item>
								<Form.Item label='Phone Number' name='phoneNumber' rules={[{ required: true }]}>
									<Input />
								</Form.Item>
								<Form.Item label='Shipping Address' name='address' rules={[{ required: true }]}>
									<Input.TextArea />
								</Form.Item>
							</>
						)}
						<Form.Item
							label='Shipping Charges'
							name='shippingCharge'
							rules={[{ required: true, type: "number", min: 0 }]}
						>
							<InputNumber style={{ width: "100%" }} />
						</Form.Item>
						<Form.Item label='Tax' name='tax' rules={[{ required: true, type: "number", min: 0 }]}>
							<InputNumber style={{ width: "100%" }} />
						</Form.Item>

						<Form.Item label='Discount' name='discount' rules={[{ required: true, type: "number", min: 0 }]}>
							<InputNumber style={{ width: "100%" }} />
						</Form.Item>
						<Form.Item label='Total' name='amount' rules={[{ required: true, type: "number", min: 0 }]}>
							<InputNumber style={{ width: "100%" }} />
						</Form.Item>
						<Form.Item label='Status' name='status' rules={[{ required: true }]}>
							<Select>
								{Object.entries(EcommerceOrderStatus).map(([key, value]) => {
									return (
										<Select.Option value={value} key={key}>
											{key}
										</Select.Option>
									);
								})}
							</Select>
						</Form.Item>
						<Form.Item>
							<Button htmlType='submit' type='primary'>
								Save
							</Button>
						</Form.Item>
					</Form>
				</Col>
			</Row>
		</Drawer>
	);
};

export default OrderEditDrawer;
