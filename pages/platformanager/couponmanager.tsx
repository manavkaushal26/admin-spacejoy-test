import { SearchOutlined } from "@ant-design/icons";
import { getAllCoupons } from "@api/metaApi";
import { CapitalizedText } from "@components/CommonStyledComponents";
import { BasicCoupon } from "@customTypes/couponTypes";
import User, { Role } from "@customTypes/userType";
import CreateEditCoupon from "@sections/Coupons/CreateEditCoupon";
import { MaxHeightDiv } from "@sections/Dashboard/styled";
import PageLayout from "@sections/Layout";
import { withAuthVerification } from "@utils/auth";
import { company } from "@utils/config";
import fetcher from "@utils/fetcher";
import IndexPageMeta from "@utils/meta";
import { Button, Col, Input, notification, Row, Space, Table, Typography } from "antd";
import { FilterDropdownProps } from "antd/lib/table/interface";
import moment from "moment";
import { NextPage } from "next";
import Head from "next/head";
import React, { useEffect, useState } from "react";
import Highlighter from "react-highlight-words";
import { LoudPaddingDiv } from ".";

const { Title } = Typography;

const CouponManager: NextPage<{
	isServer: boolean;
	authVerification: Partial<User>;
}> = ({ authVerification, isServer }) => {
	const [coupons, setCoupons] = useState<BasicCoupon[]>([]);

	const [selectedCoupon, setSelectedCoupon] = useState<BasicCoupon>(null);
	const [createEditCouponVisible, setCreateEditCouponVisible] = useState<boolean>(false);
	const [total, setTotal] = useState<number>(0);
	const [loading, setLoading] = useState<boolean>(false);
	const [pageNumber, setPageNumber] = useState<number>(1);
	const [limit, setLimit] = useState<number>(10);

	const [searchKey, setSearchKey] = useState({
		searchText: "",
		searchedColumn: "",
	});

	const fetchAndPopulateCoupons = async (): Promise<void> => {
		setLoading(true);
		const endPoint = `${getAllCoupons(searchKey.searchText !== "")}?limit=${limit}&skip=${(pageNumber - 1) * limit}${
			searchKey.searchText !== "" ? `&keyword=${searchKey.searchedColumn}:${searchKey.searchText.trim()}` : ""
		}`;

		try {
			const response = await fetcher({
				endPoint,
				method: "GET",
			});
			if (response.status === "success") {
				setCoupons(response.data.data || response.data);
				setTotal(response.data.count || response.data.length);
			} else {
				notification.error({ message: "Failed to fetch Coupons" });
			}
		} catch (e) {
			notification.error({ message: "Failed to fetch Coupons" });
		}
		setLoading(false);
	};

	useEffect(() => {
		fetchAndPopulateCoupons();
	}, [limit, pageNumber, searchKey]);

	const toggleCreateEditCoupon = (): void => {
		setCreateEditCouponVisible(prevState => {
			if (prevState) setSelectedCoupon(null);
			return !prevState;
		});
	};

	const onEditClick = couponData => {
		setSelectedCoupon(couponData);
		toggleCreateEditCoupon();
	};

	const onCouponValueChange = (newValue: BasicCoupon, isNewCoupon) => {
		if (isNewCoupon) {
			setCoupons([newValue, ...coupons]);
		} else {
			setCoupons(
				coupons.map(coupon => {
					if (coupon._id === newValue._id) {
						return newValue;
					}
					return coupon;
				})
			);
		}
	};

	const handleSearch = (selectedKeys, confirm, dataIndex) => {
		confirm();
		setSearchKey({
			searchText: selectedKeys[0],
			searchedColumn: dataIndex,
		});
	};

	const handleReset = clearFilters => {
		clearFilters();
		setSearchKey({ searchText: "", searchedColumn: "" });
	};

	const filterDropdown: (props: FilterDropdownProps, dataIndex: string) => JSX.Element = (
		{ confirm, clearFilters, selectedKeys, setSelectedKeys },
		index
	) => {
		return (
			<div style={{ padding: 8 }}>
				<Input
					placeholder={`Search ${index}`}
					value={selectedKeys[0]}
					onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
					onPressEnter={() => handleSearch(selectedKeys, confirm, index)}
					style={{ width: 188, marginBottom: 8, display: "block" }}
				/>
				<Space>
					<Row gutter={[4, 4]}>
						<Col>
							<Button
								type='primary'
								onClick={() => handleSearch(selectedKeys, confirm, index)}
								icon={<SearchOutlined />}
								size='small'
								style={{ width: 90 }}
							>
								Search
							</Button>
						</Col>
						<Col>
							<Button onClick={() => handleReset(clearFilters)} size='small' style={{ width: 90 }}>
								Reset
							</Button>
						</Col>
					</Row>
				</Space>
			</div>
		);
	};

	return (
		<PageLayout pageName='Coupon Manager' isServer={isServer} authVerification={authVerification}>
			<Head>
				<title>Coupon Manager | {company.product}</title>
				{IndexPageMeta}
			</Head>
			<MaxHeightDiv>
				<LoudPaddingDiv>
					<Row>
						<Col span={24}>
							<Row justify='space-between' onClick={toggleCreateEditCoupon}>
								<Col>
									<Title>Coupon Manager</Title>
								</Col>
								<Col>
									<Button type='primary'>Create New Coupon</Button>
								</Col>
							</Row>
						</Col>
						<Col span={24}>
							<Table
								size='middle'
								loading={loading}
								rowKey={(record): string => record._id}
								dataSource={coupons}
								pagination={{
									pageSize: limit,
									pageSizeOptions: ["10", "20", "30"],
									current: pageNumber,
									total,
									showSizeChanger: true,
									onChange: setPageNumber,
									onShowSizeChange: (_current, size): void => {
										setLimit(size);
									},
								}}
								scroll={{ x: 1024 }}
							>
								<Table.Column
									title='Title'
									filterDropdown={props => filterDropdown(props, "title")}
									filterIcon={filtered => (
										<SearchOutlined
											style={{ color: filtered && searchKey.searchText === "title" ? "#1890ff" : undefined }}
										/>
									)}
									render={text =>
										searchKey.searchedColumn === "title" ? (
											<Highlighter
												highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
												searchWords={[searchKey.searchText]}
												autoEscape
												textToHighlight={text ? text.toString() : ""}
											/>
										) : (
											text
										)
									}
									dataIndex='title'
									key='title'
								/>
								<Table.Column
									title='Code'
									dataIndex='code'
									key='code'
									filterDropdown={props => filterDropdown(props, "code")}
									filterIcon={filtered => (
										<SearchOutlined
											style={{ color: filtered && searchKey.searchedColumn === "code" ? "#1890ff" : undefined }}
										/>
									)}
									render={text =>
										searchKey.searchedColumn === "code" ? (
											<Highlighter
												highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
												searchWords={[searchKey.searchText]}
												autoEscape
												textToHighlight={text ? text.toString() : ""}
											/>
										) : (
											text
										)
									}
								/>
								<Table.Column
									title='Amount'
									dataIndex='amount'
									key='amount'
									filterDropdown={props => filterDropdown(props, "amount")}
									filterIcon={filtered => (
										<SearchOutlined
											style={{ color: filtered && searchKey.searchedColumn === "amount" ? "#1890ff" : undefined }}
										/>
									)}
									render={(_text, record: BasicCoupon) =>
										searchKey.searchedColumn === "amount" ? (
											<CapitalizedText>
												<Highlighter
													highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
													searchWords={[searchKey.searchText]}
													autoEscape
													textToHighlight={
														record ? (record.isPercent ? `${record.amount} %` : `$ ${record.amount}`.toString()) : ""
													}
												/>
											</CapitalizedText>
										) : (
											<CapitalizedText>
												{record.isPercent ? `${record.amount} %` : `$ ${record.amount}`}
											</CapitalizedText>
										)
									}
								/>
								<Table.Column
									title='Start Date'
									dataIndex='startTime'
									key='startTime'
									render={(_text): string => {
										return moment(_text).format("MM-DD-YYYY");
									}}
								/>
								<Table.Column
									title='End Date'
									dataIndex='endTime'
									key='endTime'
									render={(text): string => {
										return moment(text).format("MM-DD-YYYY");
									}}
								/>
								<Table.Column
									title='Status'
									dataIndex='status'
									key='status'
									filterDropdown={props => filterDropdown(props, "status")}
									filterIcon={filtered => (
										<SearchOutlined
											style={{ color: filtered && searchKey.searchedColumn === "status" ? "#1890ff" : undefined }}
										/>
									)}
									render={text =>
										searchKey.searchedColumn === "status" ? (
											<CapitalizedText>
												<Highlighter
													highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
													searchWords={[searchKey.searchText]}
													autoEscape
													textToHighlight={text ? text.toString() : ""}
												/>
											</CapitalizedText>
										) : (
											<CapitalizedText>{text}</CapitalizedText>
										)
									}
								/>
								<Table.Column
									title='Category'
									dataIndex='category'
									key='category'
									filterDropdown={props => filterDropdown(props, "category")}
									filterIcon={filtered => (
										<SearchOutlined
											style={{ color: filtered && searchKey.searchedColumn === "category" ? "#1890ff" : undefined }}
										/>
									)}
									render={text =>
										searchKey.searchedColumn === "category" ? (
											<CapitalizedText>
												<Highlighter
													highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
													searchWords={[searchKey.searchText]}
													autoEscape
													textToHighlight={text ? text.toString() : ""}
												/>
											</CapitalizedText>
										) : (
											<CapitalizedText>{text}</CapitalizedText>
										)
									}
								/>
								<Table.Column
									title='Actions'
									key='actions'
									fixed='right'
									width='300'
									render={(_text, record): JSX.Element => {
										return (
											<Button type='link' onClick={() => onEditClick(record)}>
												Edit
											</Button>
										);
									}}
								/>
							</Table>
						</Col>
					</Row>
				</LoudPaddingDiv>
			</MaxHeightDiv>
			<CreateEditCoupon
				couponData={selectedCoupon}
				modifyCouponValue={onCouponValueChange}
				toggleCreateEditCoupon={toggleCreateEditCoupon}
				createEditCouponVisible={createEditCouponVisible}
			/>
		</PageLayout>
	);
};
CouponManager.getInitialProps = async ({
	req,
}): Promise<{
	isServer: boolean;
	authVerification: Partial<User>;
}> => {
	const isServer = !!req;
	const authVerification = {
		name: "",
		role: Role.Guest,
	};
	try {
		return {
			isServer,
			authVerification,
		};
	} catch (e) {
		return {
			isServer,
			authVerification,
		};
	}
};

export default withAuthVerification(CouponManager);
