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
				status: data.status,
				category: data.category,
				code: data.code,
			};
		} else {
			const startTime = data.validity ? data.validity[0]?.toISOString() : undefined;
			const endTime = data.validity ? data.validity[1]?.toISOString() : undefined;
			return {
				...data,
				title: data.title.trim(),
				description: data.description.trim(),
				code: data.code.trim(),
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
	const [changedFields, setChangedFields] = useState<Partial<BasicCoupon>>({});
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

	const onFieldsChange = changedFieldsData => {
		if (changedFieldsData.length) {
			setChangedFields({ ...changedFields, [changedFieldsData[0]?.name]: changedFieldsData[0]?.value });
		}
	};

	const saveCoupon = async values => {
		const endPoint = createEditCouponApi(couponData?._id);
		try {
			const response = await fetcher({ endPoint, method: couponData ? "PUT" : "POST", body: { data: values } });
			if (response.status !== "error") {
				modifyCouponValue(response.data, !couponData);
				setChangedFields({});
				toggleCreateEditCoupon();
				notification.success({ message: couponData ? "Saved Coupon successfully" : "Created coupon successfully" });
			}
		} catch (e) {
			notification.error({ message: "Failed to Save Coupon" });
		}
	};

	const onFinish = values => {
		if (couponData) {
			saveCoupon(convertFormat(changedFields));
		} else {
			saveCoupon(convertFormat(values));
		}
	};

	return (
		<Drawer
			destroyOnClose
			visible={createEditCouponVisible}
			width='400px'
			title='Coupon'
			onClose={toggleCreateEditCoupon}
		>
			<Form
				labelCol={{ span: 24 }}
				wrapperCol={{ span: 24 }}
				form={form}
				onFieldsChange={onFieldsChange}
				onFinish={onFinish}
			>
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
				<Form.Item label='Amount' name='amount' rules={[{ required: true, message: "Please Enter Amount" }]}>
					<InputNumber style={{ width: "100%" }} />
				</Form.Item>
				<Form.Item label='Is the above mentioned Amount in Percentage?' name='isPercent' rules={[{ required: true }]}>
					<Radio.Group buttonStyle='solid'>
						<Radio.Button value={true}>Yes</Radio.Button>
						<Radio.Button value={false}>No</Radio.Button>
					</Radio.Group>
				</Form.Item>
				<Form.Item
					label='Max Discount in Dollars'
					name='maxDiscount'
					rules={[{ required: true, message: "Please Enter value" }]}
				>
					<InputNumber style={{ width: "100%" }} />
				</Form.Item>
				<Form.Item
					label='Max no of times the Coupon can be used'
					name='maxUsePerUser'
					rules={[{ required: true, message: "Please Enter value" }]}
				>
					<InputNumber style={{ width: "100%" }} />
				</Form.Item>
				<Form.Item label='Coupon Validity' name='validity' rules={[{ required: true, message: "Please Enter value" }]}>
					<RangePicker showTime allowEmpty={[false, true]} format='YYYY-MM-DD HH:mm' />
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
