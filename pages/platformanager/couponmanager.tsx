import { ArrowLeftOutlined, SearchOutlined } from "@ant-design/icons";
import { getAllCoupons } from "@api/metaApi";
import { CapitalizedText } from "@components/CommonStyledComponents";
import { BasicCoupon } from "@customTypes/couponTypes";
import CreateEditCoupon from "@sections/Coupons/CreateEditCoupon";
import { MaxHeightDiv } from "@sections/Dashboard/styled";
import PageLayout from "@sections/Layout";
import { ProtectRoute } from "@utils/authContext";
import { company } from "@utils/config";
import fetcher from "@utils/fetcher";
import IndexPageMeta from "@utils/meta";
import { Button, Col, Input, notification, Row, Space, Table, Typography } from "antd";
import { FilterDropdownProps } from "antd/lib/table/interface";
import moment from "moment";
import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Highlighter from "react-highlight-words";
import { LoudPaddingDiv } from ".";

const { Title } = Typography;

const CouponManager: NextPage<{
	serverCoupons: BasicCoupon[];
	serverTotal: number;
}> = ({ serverCoupons, serverTotal }) => {
	const [coupons, setCoupons] = useState<BasicCoupon[]>(serverCoupons || []);
	const [firstLoad, setFirstLoad] = useState(true);
	const [selectedCoupon, setSelectedCoupon] = useState<BasicCoupon>(null);
	const [createEditCouponVisible, setCreateEditCouponVisible] = useState<boolean>(false);
	const [total, setTotal] = useState<number>(serverTotal || 0);
	const [loading, setLoading] = useState<boolean>(false);
	const [isDuplicateActive, setIsDuplicateActive] = useState<boolean>(false);
	const [pageNumber, setPageNumber] = useState<number>(1);
	const [limit, setLimit] = useState<number>(10);

	const [searchKey, setSearchKey] = useState({
		searchText: "",
		searchedColumn: "",
	});

	const fetchAndPopulateCoupons = async (): Promise<void> => {
		setLoading(true);
		const endPoint = `${getAllCoupons(searchKey.searchText !== "")}?limit=${limit}&skip=${(pageNumber - 1) * limit}${
			searchKey.searchText !== "" ? `&keyword=${searchKey.searchedColumn}:${searchKey?.searchText?.trim()}` : ""
		}`;

		try {
			const response = await fetcher({
				endPoint,
				method: "GET",
			});
			if (response.statusCode <= "300") {
				setCoupons(response.data.data.data || response.data.data);
				setTotal(response.data.data.count || response.data.length);
			} else {
				notification.error({ message: "Failed to fetch Coupons" });
			}
		} catch (e) {
			notification.error({ message: "Failed to fetch Coupons" });
		}
		setLoading(false);
	};
	useEffect(() => {
		if (!firstLoad) fetchAndPopulateCoupons();
		else setFirstLoad(false);
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

	const onDuplicateClick = couponData => {
		const editedCouponData = { ...couponData, ...{ code: "" } };
		setSelectedCoupon(editedCouponData);
		setIsDuplicateActive(true);
		toggleCreateEditCoupon();
	};

	useEffect(() => {
		if (!createEditCouponVisible) {
			setIsDuplicateActive(false);
		}
	}, [createEditCouponVisible]);

	const onCouponValueChange = (newValue: BasicCoupon, isNewCoupon) => {
		if (isNewCoupon) {
			setCoupons([newValue, ...coupons]);
			setIsDuplicateActive(false);
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

	const router = useRouter();

	return (
		<PageLayout pageName='Coupon Manager'>
			<Head>
				<title>Coupon Manager | {company.product}</title>
				{IndexPageMeta}
			</Head>
			<MaxHeightDiv>
				<LoudPaddingDiv>
					<Row>
						<Col span={24}>
							<Row justify='space-between'>
								<Col>
									<Title level={3}>
										<Row gutter={[8, 8]}>
											<Col>
												<ArrowLeftOutlined onClick={() => router.back()} />
											</Col>
											<Col>Coupon Manager</Col>
										</Row>
									</Title>
								</Col>
								<Col>
									<Button type='primary' onClick={toggleCreateEditCoupon}>
										Create New Coupon
									</Button>
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
									title='Coupon Type'
									dataIndex='type'
									key='type'
									filterDropdown={props => filterDropdown(props, "type")}
									filterIcon={filtered => (
										<SearchOutlined
											style={{ color: filtered && searchKey.searchedColumn === "type" ? "#1890ff" : undefined }}
										/>
									)}
									render={text =>
										searchKey.searchedColumn === "type" ? (
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
											<>
												<Button type='link' onClick={() => onEditClick(record)}>
													Edit
												</Button>
												<Button type='link' onClick={() => onDuplicateClick(record)}>
													Duplicate
												</Button>
											</>
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
				isDuplicateActive={isDuplicateActive}
			/>
		</PageLayout>
	);
};
export const getServerSideProps: GetServerSideProps<{
	serverCoupons?: BasicCoupon[];
	serverTotal?: number;
}> = async ctx => {
	const endPoint = `${getAllCoupons(false)}?limit=10&skip=0`;

	try {
		const response = await fetcher({
			ctx,
			endPoint,
			method: "GET",
		});
		if (response.statusCode <= "300") {
			return {
				props: {
					serverCoupons: response.data.data.data || response.data,
					serverTotal: response.data.data.data.count || response.data.length || 0,
				},
			};
		} else {
			throw new Error();
		}
	} catch (e) {
		return {
			props: {},
		};
	}
};

export default ProtectRoute(CouponManager);
