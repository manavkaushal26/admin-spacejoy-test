import { getOrderApi } from "@api/ecommerceApi";
import { EcommerceOrderStatus, EcommOrder, OrderItems as OrderItem } from "@customTypes/ecommerceTypes";
import fetcher from "@utils/fetcher";
import { Button, Drawer, Form, Input, notification, Select, Modal } from "antd";
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
			<Form
				labelCol={{ span: 24 }}
				initialValues={{
					firstName: orderData.firstName,
					lastName: orderData.lastName,
					phoneNumber: orderData.phoneNumber,
					status: orderData.status,
				}}
				onFinish={onClickFinish}
			>
				<Form.Item label='First Name' name='firstName' rules={[{ required: true }]}>
					<Input />
				</Form.Item>
				<Form.Item label='Last Name' name='lastName'>
					<Input />
				</Form.Item>
				<Form.Item label='Phone Number' name='phoneNumber' rules={[{ required: true }]}>
					<Input />
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
		</Drawer>
	);
};

export default OrderEditDrawer;
