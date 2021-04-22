import fetcher from "@utils/fetcher";
import { Button, DatePicker, Drawer, Form, InputNumber, notification, Select } from "antd";
import moment from "moment-timezone";
import React, { useEffect, useState } from "react";
const { RangePicker } = DatePicker;

export default function EditCreateCoupon({
	isDrawerVisible,
	modifyCouponValue,
	couponData,
	toggleCouponDrawer,
	retailerId,
}) {
	const [form] = Form.useForm();
	const [coupon, setCoupon] = useState({});

	const saveCoupon = async values => {
		const endPoint = couponData ? `/v1/offer/${couponData?._id}` : "/v1/offer";
		const payload = createFormData(values);
		try {
			const response = await fetcher({ endPoint, method: couponData ? "PUT" : "POST", body: payload });
			if (response.statusCode <= 300) {
				modifyCouponValue(response.data, !couponData);
				notification.success({ message: couponData ? "Saved Coupon successfully" : "Created coupon successfully" });
			} else {
				notification.error({ message: couponData ? "Failed to Save Coupon" : "Failed to Create Coupon" });
			}
		} catch (e) {
			notification.error({ message: "Failed to Save Coupon" });
		}
	};

	useEffect(() => {
		if (couponData) {
			setCoupon(retrieveFormData(couponData));
		} else {
			setCoupon({});
		}
	}, [couponData]);

	useEffect(() => {
		if (couponData) {
			form.setFieldsValue(coupon);
		} else {
			form.resetFields();
		}
	}, [coupon]);

	const createFormData = data => {
		const payload = {
			retailer: retailerId,
			isActive: data?.isActive === "true" ? true : false,
			discount: data?.discount,
			startTime: data.validity ? data.validity[0]?.toISOString() : undefined,
			endTime: data.validity ? data.validity[1]?.toISOString() : undefined,
			discountType: data?.discountType,
			constraints: {
				minAmount: data?.constraints?.minAmount,
				maxAmount: data?.constraints?.maxAmount,
			},
			maxDiscount: data?.maxDiscount,
		};

		return payload;
	};

	const retrieveFormData = data => {
		const payload = {
			retailer: retailerId,
			isActive: data?.isActive ? "true" : "false",
			discount: data?.discount,
			validity: [moment(data.startTime), moment(data.endTime)],
			discountType: data?.discountType,
			constraints: {
				minAmount: data?.constraints?.minAmount,
				maxAmount: data?.constraints?.maxAmount,
			},
			maxDiscount: data?.maxDiscount,
		};

		return payload;
	};

	const onFinish = values => {
		saveCoupon(values);
		toggleCouponDrawer();
	};

	return (
		<Drawer destroyOnClose visible={isDrawerVisible} width='400px' title='Coupon' onClose={toggleCouponDrawer}>
			<Form labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} form={form} onFinish={onFinish}>
				<Form.Item
					label='Discount'
					name='discount'
					rules={[{ required: true, message: "Please Enter Discount", type: "number", min: 0 }]}
				>
					<InputNumber style={{ width: "100%" }} />
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
					label='Max Discount(in $)'
					name='maxDiscount'
					rules={[{ required: true, message: "Please Enter value", type: "number", min: 0 }]}
				>
					<InputNumber style={{ width: "100%" }} />
				</Form.Item>
				<Form.Item label='Coupon Validity' name='validity' rules={[{ required: true, message: "Please Enter value" }]}>
					<RangePicker showTime allowEmpty={[false, true]} format='YYYY-MM-DD HH:mm' />
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
