import { Button, DatePicker, Drawer, Form, InputNumber, notification, Select } from "antd";
import React, { useEffect, useState } from "react";

const { RangePicker } = DatePicker;

export default function EditCreateCoupon({ isDrawerVisible, modifyCouponValue, couponData }) {
	const [form] = Form.useForm();
	const [coupon, setCoupon] = useState({});

	const saveCoupon = async values => {
		const endPoint = "/v1/offer";
		console.log("values", values);
		const payload = {};
		try {
			const response = await fetcher({ endPoint, method: couponData ? "PUT" : "POST", body: payload });
			if (response.status !== "error") {
				modifyCouponValue(response.data, !couponData);
				notification.success({ message: couponData ? "Saved Coupon successfully" : "Created coupon successfully" });
			}
		} catch (e) {
			notification.error({ message: "Failed to Save Coupon" });
		}
	};

	useEffect(() => {
		if (couponData) {
			form.setFieldsValue(coupon);
		} else {
			form.resetFields();
		}
	}, [coupon]);

	const onFinish = values => {
		// console.log("values", values);
		saveCoupon(values);
	};

	return (
		<Drawer
			destroyOnClose
			visible={isDrawerVisible}
			width='400px'
			title='Coupon'
			// onClose={toggleCreateEditCoupon}
		>
			<Form labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} form={form} onFinish={onFinish}>
				<Form.Item
					label='Discount'
					name='discount'
					rules={[{ required: true, message: "Please Enter Discount", type: "number", min: 0 }]}
				>
					<InputNumber style={{ width: "100%" }} />
				</Form.Item>
				<Form.Item
					label='Min Amount Coupon can be applied for'
					dependencies={[["constraints", "maxAmount"]]}
					name={["constraints", "minAmount"]}
					rules={[
						{ required: true, message: "Please Enter value", type: "number", min: 1 },
						({ getFieldValue }) => ({
							validator(_rule, value) {
								const maxValue = getFieldValue(["constraints", "maxAmount"]);
								if (!value || !maxValue || maxValue >= value) {
									return Promise.resolve();
								}
								return Promise.reject("Min Amount has to be lesser than Max Amount");
							},
						}),
					]}
				>
					<InputNumber style={{ width: "100%" }} />
				</Form.Item>
				<Form.Item
					label='Max Amount Coupon can be applied for'
					name={["constraints", "maxAmount"]}
					dependencies={[["constraints", "minAmount"]]}
					rules={[
						{ required: true, message: "Please Enter value", type: "number", min: 1 },
						({ getFieldValue }) => ({
							validator(_rule, value) {
								const minValue = getFieldValue(["constraints", "minAmount"]);

								if (!value || !minValue || minValue <= value) {
									return Promise.resolve();
								}
								return Promise.reject("Max Amount has to be greater than Min Amount");
							},
						}),
					]}
				>
					<InputNumber style={{ width: "100%" }} />
				</Form.Item>
				<Form.Item
					label='Max Discount'
					name='maxDiscount'
					rules={[{ required: true, message: "Please Enter value", type: "number", min: 0 }]}
				>
					<InputNumber style={{ width: "100%" }} />
				</Form.Item>
				<Form.Item label='Coupon Validity' name='validity' rules={[{ required: true, message: "Please Enter value" }]}>
					<RangePicker showTime allowEmpty={[false, true]} format='YYYY-MM-DD HH:mm' />
				</Form.Item>
				<Form.Item
					label='Discount Type'
					name='discountType'
					rules={[{ required: true, message: "Please select a value" }]}
				>
					<Select style={{ width: "100%" }}>
						<Select.Option value='flat'>Flat</Select.Option>
						<Select.Option value='percent'>Percent</Select.Option>
					</Select>
				</Form.Item>

				<Form.Item label='Status' name='isActive' rules={[{ required: true, message: "Please select a value" }]}>
					<Select style={{ width: "100%" }}>
						<Select.Option value='true'>Active</Select.Option>
						<Select.Option value='false'>Inactive</Select.Option>
					</Select>
				</Form.Item>
				<Form.Item>
					<Button type='primary' htmlType='submit'>
						Submit
					</Button>
				</Form.Item>
			</Form>
		</Drawer>
	);
}
