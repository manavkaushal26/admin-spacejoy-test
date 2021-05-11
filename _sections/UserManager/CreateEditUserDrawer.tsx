import { getSingleUserApi } from "@api/userApi";
import { TeamMember } from "@customTypes/dashboardTypes";
import { Role } from "@customTypes/userType";
import fetcher from "@utils/fetcher";
import { Button, Drawer, Form, Input, notification, Select, Spin } from "antd";
import { useForm } from "antd/lib/form/Form";
import React, { useEffect, useState } from "react";

interface CreateEditUserDrawer {
	userId: string;
	onSave: (data, userId?: string, userData?: TeamMember) => Promise<void>;
	visible: boolean;
	toggleModal: () => void;
}

const CreateEditUserDrawer: React.FC<CreateEditUserDrawer> = ({ userId, onSave, visible, toggleModal }) => {
	const [form] = useForm();
	const [loading, setLoading] = useState<boolean>(false);
	const [userData, setUserData] = useState<TeamMember>(null);

	const fetchUserData = async () => {
		const endPoint = getSingleUserApi(userId);
		setLoading(true);
		try {
			const response = await fetcher({ endPoint, method: "GET" });
			if (response.statusCode <= 300) {
				setUserData(response.data);
				form.setFieldsValue({
					firstName: response.data.profile.firstName,
					lastName: response.data.profile.lastName,
					email: response.data.email,
					role: response.data.role,
				});
			} else {
				throw new Error("Failed to fetch user");
			}
		} catch (e) {
			notification.error({ message: e.message });
		}
		setLoading(false);
	};

	useEffect(() => {
		if (userId) {
			fetchUserData();
		}
		return () => {
			setUserData(null);
		};
	}, [userId]);

	return (
		<Drawer visible={visible} width='360' title={userId ? "Edit user" : "Create User"} onClose={() => toggleModal()}>
			<Spin spinning={loading}>
				<Form form={form} labelCol={{ span: 24 }} onFinish={data => onSave(data, userId, userData)}>
					<Form.Item name='firstName' label='First Name' rules={[{ required: true }]}>
						<Input />
					</Form.Item>
					<Form.Item name='lastName' label='Last Name'>
						<Input />
					</Form.Item>
					<Form.Item name='email' label='Email' rules={[{ required: true }]}>
						<Input />
					</Form.Item>
					{!userId && (
						<>
							<Form.Item name='password' label='Password' rules={[{ required: true }]}>
								<Input.Password />
							</Form.Item>
							<Form.Item
								name='confirm'
								label='Confirm Password'
								dependencies={["password"]}
								hasFeedback
								rules={[
									{
										required: true,
										message: "Please confirm your password!",
									},
									({ getFieldValue }) => ({
										validator(rule, value) {
											if (!value || getFieldValue("password") === value) {
												return Promise.resolve();
											}
											return Promise.reject("The two passwords that you entered do not match!");
										},
									}),
								]}
							>
								<Input.Password />
							</Form.Item>
						</>
					)}
					{userData?.role !== Role.Customer && (
						<Form.Item name='role' label='Role' rules={[{ required: true }]}>
							<Select>
								{Object.entries(Role).map(([label, value]) => {
									return (
										<Select.Option value={value} key={value}>
											{label}
										</Select.Option>
									);
								})}
							</Select>
						</Form.Item>
					)}
					<Form.Item>
						<Button htmlType='submit' type='primary'>
							Save
						</Button>
					</Form.Item>
				</Form>
			</Spin>
		</Drawer>
	);
};

export default CreateEditUserDrawer;
