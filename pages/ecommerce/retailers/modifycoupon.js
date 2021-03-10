import { ArrowLeftOutlined } from "@ant-design/icons";
import { MaxHeightDiv } from "@sections/Dashboard/styled";
import PageLayout from "@sections/Layout";
import { ProtectRoute } from "@utils/authContext";
import { company } from "@utils/config";
import fetcher from "@utils/fetcher";
import IndexPageMeta from "@utils/meta";
import { Button, Col, notification, Row, Table } from "antd";
import Title from "antd/lib/skeleton/Title";
import Head from "next/head";
import { useRouter } from "next/router";
import { LoudPaddingDiv } from "pages/platformanager";
import React, { useEffect, useState } from "react";
import EditCreateCoupon from "./editcreatecoupon";

function ModifyRetailerCoupon({ retailerId }) {
	const router = useRouter();
	const [coupons, setCoupons] = useState([]);
	const [loading, setIsLoading] = useState(false);
	const [isDrawerVisible, setDrawerVisibility] = useState(false);
	const [selectedCoupon, setSelectedCoupon] = useState(null);
	const getCoupons = async () => {
		const response = await fetcher({
			endPoint: `/v1/offers/${retailerId}`,
			method: "GET",
		});
		if (response.statusCode <= "300") {
			setCoupons(response?.data?.data);
		} else {
			throw new Error();
		}
	};

	const toggleCouponDrawer = () => {
		setDrawerVisibility(!isDrawerVisible);
		setSelectedCoupon(null);
	};

	useEffect(() => {
		getCoupons();
	}, []);

	const onCouponValueChange = (newValue, isNewCoupon) => {
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

	const onEditClick = record => {
		setSelectedCoupon(record);
		setDrawerVisibility(true);
	};

	const onDeleteClick = async record => {
		try {
			const response = await fetcher({ endPoint: `/v1/offer/${record?._id}`, method: "DELETE" });
			if (response.statusCode <= 300) {
				notification.success({ message: "Deleted offer" });
			}
		} catch (e) {
			notification.error({ message: "Failed to Delete Offer" });
		}
		getCoupons();
	};

	return (
		<PageLayout pageName='Brand Offers Manager'>
			<Head>
				<title>Brand Offers Manager | {company.product}</title>
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
											<Col>Offers Manager</Col>
										</Row>
									</Title>
								</Col>
								<Col>
									<Button type='primary' onClick={toggleCouponDrawer}>
										Create New Offer
									</Button>
								</Col>
							</Row>
						</Col>
						<br></br>
						<br></br>
						<Col span={24}>
							<Table
								size='middle'
								loading={loading}
								rowKey={record => record._id}
								dataSource={coupons}
								scroll={{ x: 1024 }}
							>
								<Table.Column
									title='Discount'
									dataIndex='discount'
									key='discount'
									render={_text => {
										return _text;
									}}
								/>
								<Table.Column
									title='Discount Type'
									dataIndex='discountType'
									key='discountType'
									render={_text => {
										return _text;
									}}
								/>
								<Table.Column
									title='Start Date'
									dataIndex='startTime'
									key='startTime'
									render={_text => {
										return _text;
									}}
								/>
								<Table.Column
									title='End Date'
									dataIndex='endTime'
									key='endTime'
									render={_text => {
										return _text;
									}}
								/>
								<Table.Column
									title='Max Discount'
									dataIndex='maxDiscount'
									key='maxDiscount'
									render={_text => {
										return _text;
									}}
								/>
								<Table.Column
									title='Actions'
									key='actions'
									fixed='right'
									width='300'
									render={(_text, record) => {
										return (
											<>
												<Button type='link' onClick={() => onEditClick(record)}>
													Edit
												</Button>
												<Button type='link' onClick={() => onDeleteClick(record)}>
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
			<EditCreateCoupon
				couponData={selectedCoupon}
				modifyCouponValue={onCouponValueChange}
				isDrawerVisible={isDrawerVisible}
				retailerId={retailerId}
				toggleCouponDrawer={toggleCouponDrawer}
			/>
		</PageLayout>
	);
}

export async function getServerSideProps(ctx) {
	const { query } = ctx;
	const retailerId = query.id || "";
	return {
		props: {
			retailerId,
		},
	};
}

export default ProtectRoute(ModifyRetailerCoupon);
