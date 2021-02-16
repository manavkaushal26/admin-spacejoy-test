import { createEditCouponApi } from "@api/metaApi";
import { BasicCoupon } from "@customTypes/couponTypes";
import fetcher from "@utils/fetcher";
import { Button, DatePicker, Drawer, Form, Input, InputNumber, notification, Radio, Select } from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";

const { RangePicker } = DatePicker;

interface CreateEditCoupon {
	couponData: BasicCoupon;
	modifyCouponValue: (value: BasicCoupon, isNewCoupon: boolean) => void;
	toggleCreateEditCoupon: () => void;
	createEditCouponVisible: boolean;
}

const convertFormat = (data, type = "fromState") => {
	if (data) {
		if (type === "toState") {
			return {
				title: data.title,
				description: data.description,
				amount: data.amount,
				isPercent: data.isPercent,
				maxDiscount: data.maxDiscount,
				validity: [moment(data.startedAt), moment(data.endedAt)],
				maxUsePerUser: data.maxUsePerUser,
				globalUsageLimit: data.globalUsageLimit,
				status: data.status,
				category: data.category,
				code: data.code,
				type: data.type,
				packageType: data.packageType,
				constraints: {
					minAmount: data?.constraints.minAmount,
					maxAmount: data?.constraints.maxAmount,
				},
				minDiscount: data.minDiscount,
			};
		} else {
			const startTime = data.validity ? data.validity[0]?.toISOString() : undefined;
			const endTime = data.validity ? data.validity[1]?.toISOString() : undefined;
			return {
				...data,
				title: data.title.trim(),
				description: data?.description ? data.description.trim() : data.description,
				code: data?.code ? data.code.trim() : data.code,
				...(startTime ? { startTime: startTime } : {}),
				...(endTime ? { endTime: endTime } : {}),
			};
		}
	} else {
		return {};
	}
};

const CreateEditCoupon: React.FC<CreateEditCoupon> = ({
	couponData,
	modifyCouponValue,
	toggleCreateEditCoupon,
	createEditCouponVisible,
}) => {
	const [coupon, setCoupon] = useState({});

	const [form] = Form.useForm();

	useEffect(() => {
		if (couponData) {
			setCoupon(convertFormat(couponData, "toState"));
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

	const saveCoupon = async values => {
		const endPoint = createEditCouponApi(couponData?._id);

		try {
			const response = await fetcher({ endPoint, method: couponData ? "PUT" : "POST", body: { data: values } });
			if (response.status !== "error") {
				modifyCouponValue(response.data.data, !couponData);
				toggleCreateEditCoupon();
				notification.success({ message: couponData ? "Saved Coupon successfully" : "Created coupon successfully" });
			}
		} catch (e) {
			notification.error({ message: "Failed to Save Coupon" });
		}
	};

	const onFinish = values => {
		// console.log("values", values);
		saveCoupon(convertFormat(values));
	};

	return (
		<Drawer
			destroyOnClose
			visible={createEditCouponVisible}
			width='400px'
			title='Coupon'
			onClose={toggleCreateEditCoupon}
		>
			<Form labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} form={form} onFinish={onFinish}>
				<Form.Item label='Title' name='title' rules={[{ required: true, message: "Please Enter Title" }]}>
					<Input />
				</Form.Item>
				<Form.Item
					label='Description'
					name='description'
					rules={[{ required: true, message: "Please Enter Description" }]}
				>
					<Input.TextArea />
				</Form.Item>
				<Form.Item label='Code' name='code' rules={[{ required: true, message: "Please Enter Title" }]}>
					<Input />
				</Form.Item>
				<Form.Item
					label='Amount'
					name='amount'
					rules={[{ required: true, message: "Please Enter Amount", type: "number", min: 0 }]}
				>
					<InputNumber style={{ width: "100%" }} />
				</Form.Item>
				<Form.Item label='Is the above mentioned Amount in Percentage?' name='isPercent' rules={[{ required: true }]}>
					<Radio.Group buttonStyle='solid'>
						<Radio.Button value={true}>Yes</Radio.Button>
						<Radio.Button value={false}>No</Radio.Button>
					</Radio.Group>
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
					label='Min Discount in Dollars'
					name='minDiscount'
					rules={[{ required: true, message: "Please Enter value", type: "number", min: 0 }]}
				>
					<InputNumber style={{ width: "100%" }} />
				</Form.Item>
				<Form.Item
					label='Max Discount in Dollars'
					name='maxDiscount'
					rules={[{ required: true, message: "Please Enter value", type: "number", min: 0 }]}
				>
					<InputNumber style={{ width: "100%" }} />
				</Form.Item>
				<Form.Item
					label='Max no of times the Coupon can be used per account'
					name='maxUsePerUser'
					rules={[{ required: true, message: "Please Enter value", type: "number", min: 0 }]}
				>
					<InputNumber style={{ width: "100%" }} />
				</Form.Item>
				<Form.Item
					label='Max no of times the Coupon can be used - Globally'
					name='globalUsageLimit'
					rules={[{ required: true, message: "Please Enter value", type: "number", min: 0 }]}
				>
					<InputNumber style={{ width: "100%" }} />
				</Form.Item>
				<Form.Item label='Coupon Validity' name='validity' rules={[{ required: true, message: "Please Enter value" }]}>
					<RangePicker showTime allowEmpty={[false, true]} format='YYYY-MM-DD HH:mm' />
				</Form.Item>
				<Form.Item label='Coupon Type' name='type' rules={[{ required: true, message: "Please select a value" }]}>
					<Select style={{ width: "100%" }}>
						<Select.Option value='product'>Product Coupon</Select.Option>
						<Select.Option value='designPackage'>Design Package Coupon</Select.Option>
					</Select>
				</Form.Item>
				<Form.Item
					label='Package Type'
					name='packageType'
					rules={[{ required: true, message: "Please select a value" }]}
				>
					<Select style={{ width: "100%" }}>
						<Select.Option value='all'>All</Select.Option>
						<Select.Option value='delight'>Delight</Select.Option>
						<Select.Option value='bliss'>Bliss</Select.Option>
						<Select.Option value='euphoria'>Euphoria</Select.Option>
					</Select>
				</Form.Item>
				<Form.Item label='Visibility' name='category' rules={[{ required: true, message: "Please select a value" }]}>
					<Select style={{ width: "100%" }}>
						<Select.Option value='public'>Public</Select.Option>
						<Select.Option value='private'>Private</Select.Option>
					</Select>
				</Form.Item>
				<Form.Item label='Status' name='status' rules={[{ required: true, message: "Please select a value" }]}>
					<Select style={{ width: "100%" }}>
						<Select.Option value='active'>Active</Select.Option>
						<Select.Option value='inactive'>Inactive</Select.Option>
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
};

export default CreateEditCoupon;
