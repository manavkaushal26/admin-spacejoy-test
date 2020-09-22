import { getSingleUserApi, registerAnyUserApi, suspendUserApi, userApi } from "@api/userApi";
import { TeamMember } from "@customTypes/dashboardTypes";
import { Role } from "@customTypes/userType";
import { useSessionStorage } from "@utils/customHooks/useSessionStorage";
import fetcher from "@utils/fetcher";
import { Button, Card, Col, Form, Input, Modal, notification, Row, Select, Table } from "antd";
import Text from "antd/lib/typography/Text";
import React, { useEffect, useState } from "react";
import CreateEditUserDrawer from "./CreateEditUserDrawer";

const UserLandingPage: React.FC = () => {
	const [userList, setUserList] = useState<TeamMember[]>([]);
	const [count, setCount] = useState<number>(0);
	const [pageNo, setPageNo] = useState<number>(1);
	const [limit, setLimit] = useState<number>(12);
	const [loading, setLoading] = useState<boolean>(false);
	const [searchItems, setSearchItems] = useSessionStorage<{ name: string; role: Role }>("userSearchParams", {
		name: "",
		role: null,
	});

	const [userId, setUserId] = useSessionStorage("selectedUserId", "");
	const [visible, setVisible] = useState<boolean>(false);

	const fetchUserList = async (searchText?: string, searchRole?: Role) => {
		setLoading(true);
		const endPoint = `${userApi()}?skip=${(pageNo - 1) * limit}&limit=${limit}`;
		const body = {
			data: {
				"role": { search: "single", value: searchRole || searchItems.role },
				"profile.name": { search: "single", value: searchText || searchItems.name },
			},
		};
		try {
			const response = await fetcher({ endPoint, method: "POST", body: body });
			if (response.statusCode <= 300) {
				setCount(response.data.count);
				setUserList(response.data.data);
			}
		} catch (e) {
			notification.error({ message: "Failed to fetch user list" });
		}
		setLoading(false);
	};

	useEffect(() => {
		fetchUserList(searchItems.name, searchItems.role);
	}, [pageNo, limit]);

	const onChange = (page, pageSize) => {
		setPageNo(page);
		setLimit(pageSize);
	};

	const onSearch = formData => {
		setSearchItems(formData);
		setPageNo(1);
		if (pageNo === 1) {
			fetchUserList(formData.name, formData.role);
		}
	};

	const toggleUserDrawer = (userId?: string) => {
		setUserId(userId);
		setVisible(prevState => !prevState);
	};

	const onSave = async (formData, id?: string, userData?: TeamMember) => {
		const endPoint = id ? getSingleUserApi(id) : registerAnyUserApi();
		const data = id
			? {
					...userData,
					profile: {
						...userData.profile,
						firstName: formData.firstName,
						lastName: formData.lastName,
						name: `${formData.firstName} ${formData.lastName}`,
					},
					role: formData.role,
					email: formData.email,
			  }
			: {
					...formData,
					name: `${formData.firstName} ${formData.lastName}`,
			  };
		try {
			const response = await fetcher({ endPoint, method: id ? "PUT" : "POST", body: { data } });
			if (response.statusCode <= 300) {
				notification.success({ message: id ? "Saved user" : "Create User" });
				if (!id) {
					setUserList([response.data, ...userList]);
					toggleUserDrawer();
				}
			} else {
				throw new Error("Failed to Save user");
			}
		} catch (e) {
			notification.error({ message: e.message });
		}
	};

	const suspendUser = async userId => {
		const endPoint = suspendUserApi(userId);
		try {
			const response = await fetcher({ endPoint, method: "POST", body: {} });
			if (response.statusCode <= 300) {
				notification.success({ message: "User has been suspended" });
			} else {
				throw new Error("Failed to suspend user");
			}
		} catch (err) {
			notification.error({ message: err.message });
		}
	};

	const confirmSuspend = id => {
		Modal.confirm({ title: "This user will be suspended. Do you want to continue?", onOk: () => suspendUser(id) });
	};

	return (
		<Row gutter={[8, 8]}>
			<Col span={24}>
				<Card size='small'>
					<Form labelCol={{ span: 24 }} onFinish={onSearch} initialValues={searchItems}>
						<Row gutter={[8, 4]}>
							<Col span={12}>
								<Form.Item label='Name' name='name'>
									<Input />
								</Form.Item>
							</Col>
							<Col span={12}>
								<Form.Item label='Role' name='role'>
									<Select>
										{Object.entries(Role).map(value => {
											return (
												<Select.Option key={value[1]} value={value[1]}>
													{value[0]}
												</Select.Option>
											);
										})}
										<Select.Option value=''>All</Select.Option>
									</Select>
								</Form.Item>
							</Col>
							<Col span={24}>
								<Form.Item>
									<Row justify='end'>
										<Button type='ghost' htmlType='submit'>
											Search
										</Button>
									</Row>
								</Form.Item>
							</Col>
						</Row>
					</Form>
				</Card>
			</Col>

			<Col span={24}>
				<Table
					loading={loading}
					dataSource={userList}
					pagination={{
						pageSize: limit,
						pageSizeOptions: ["12", "24", "36"],
						onChange: onChange,
						hideOnSinglePage: true,
						total: count,
					}}
					scroll={{ x: 768 }}
					title={() => (
						<Row justify='space-between' align='middle'>
							<Col>
								<Text strong>User List</Text>
							</Col>
							<Col>
								<Row justify='end'>
									<Button block type='primary' onClick={() => toggleUserDrawer()}>
										Create New User
									</Button>
								</Row>
							</Col>
						</Row>
					)}
				>
					<Table.Column
						key='id'
						title='User'
						dataIndex='profile.name'
						render={(_, record: TeamMember) => {
							return record.profile?.name || `${record.profile?.firstName} ${record.profile?.lastName}`;
						}}
					/>
					<Table.Column key='id' title='Email' dataIndex='email' />
					<Table.Column
						key='id'
						title='Role'
						dataIndex='role'
						render={text => {
							return <span style={{ textTransform: "capitalize" }}>{text}</span>;
						}}
					/>
					<Table.Column
						title='Actions'
						render={(_, record: TeamMember) => {
							return (
								<>
									<Button type='link' onClick={() => toggleUserDrawer(record._id)}>
										Edit
									</Button>
									<Button type='link' danger onClick={() => confirmSuspend(record._id)}>
										Suspend User
									</Button>
								</>
							);
						}}
					/>
				</Table>
				<CreateEditUserDrawer visible={visible} userId={userId} onSave={onSave} toggleModal={toggleUserDrawer} />
			</Col>
		</Row>
	);
};

export default UserLandingPage;
