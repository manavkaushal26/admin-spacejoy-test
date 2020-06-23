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
import { Button, Col, notification, Row, Table, Typography } from "antd";
import moment from "moment";
import { NextPage } from "next";
import Head from "next/head";
import React, { useEffect, useState } from "react";
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
	const fetchAndPopulateCoupons = async (): Promise<void> => {
		setLoading(true);
		const endPoint = `${getAllCoupons(false)}?limit=${limit}&skip=${(pageNumber - 1) * limit}`;

		try {
			const response = await fetcher({
				endPoint,
				method: "GET",
			});
			if (response.status === "success") {
				setCoupons(response.data.data);
				setTotal(response.data.count);
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
	}, [limit, pageNumber]);

	const onCouponValueChange = (newValue: BasicCoupon) => {
		setCoupons(
			coupons.map(coupon => {
				if (coupon._id === newValue._id) {
					return newValue;
				}
				return coupon;
			})
		);
	};

	const toggleCreateEditCoupon = (): void => {
		setCreateEditCouponVisible(prevState => !prevState);
	};

	return (
		<PageLayout pageName="Coupon Manager" isServer={isServer} authVerification={authVerification}>
			<Head>
				<title>Coupon Manager | {company.product}</title>
				{IndexPageMeta}
			</Head>
			<MaxHeightDiv>
				<LoudPaddingDiv>
					<Row>
						<Title>Coupon Manager</Title>

						<Col>
							<Table
								size="middle"
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
								<Table.Column title="Title" dataIndex="title" key="title" />
								<Table.Column title="Code" dataIndex="code" key="code" />
								<Table.Column
									title="Amount"
									dataIndex="amount"
									key="amount"
									render={(_text, record: BasicCoupon): string => {
										return record.isPercent ? `${record.amount} %` : `$ ${record.amount}}`;
									}}
								/>
								<Table.Column
									title="Start Date"
									dataIndex="startTime"
									key="startTime"
									render={(_text): string => {
										return moment(_text).format("MM-DD-YYYY");
									}}
								/>
								<Table.Column
									title="End Date"
									dataIndex="endTime"
									key="endTime"
									render={(text): string => {
										return moment(text).format("MM-DD-YYYY");
									}}
								/>
								<Table.Column
									title="Status"
									dataIndex="status"
									key="status"
									render={(text): JSX.Element => {
										return <CapitalizedText>{text}</CapitalizedText>;
									}}
								/>
								<Table.Column
									title="Category"
									dataIndex="category"
									key="category"
									render={(text): JSX.Element => {
										return <CapitalizedText>{text}</CapitalizedText>;
									}}
								/>
								<Table.Column
									title="Actions"
									key="actions"
									fixed="right"
									width="300"
									render={(): JSX.Element => {
										return (
											<>
												<Button type="link">Edit</Button>
												<Button style={{ color: "red" }} type="link">
													Delete
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
