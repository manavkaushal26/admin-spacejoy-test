import { ArrowLeftOutlined } from "@ant-design/icons";
import { MaxHeightDiv } from "@sections/Dashboard/styled";
import PageLayout from "@sections/Layout";
import { ProtectRoute } from "@utils/authContext";
import { company } from "@utils/config";
import fetcher from "@utils/fetcher";
import IndexPageMeta from "@utils/meta";
import { Button, Col, Row, Table } from "antd";
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
	const [selectedCoupon, setSelectedCoupon] = useState({});
	const getCoupons = async () => {
		const response = await fetcher({
			endPoint: `/v1/offers/${retailerId}`,
			method: "GET",
		});
		if (response.statusCode <= "300") {
			setCoupons();
		} else {
			throw new Error();
		}
	};

	const toggleCouponDrawer = () => {
		setDrawerVisibility(!isDrawerVisible);
	};

	useEffect(() => {
		//getCoupons();
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
									<Button type='primary' onClick={toggleCouponDrawer}>
										Create New Coupon
									</Button>
								</Col>
							</Row>
						</Col>
						<Col span={24}>
							<Table
								size='middle'
								loading={loading}
								// rowKey={(record): string => record._id}
								dataSource={[]}
								scroll={{ x: 1024 }}
							>
								<Table.Column title='Title' dataIndex='title' key='title' />
								<Table.Column title='Title' dataIndex='title' key='title' />
								<Table.Column title='Title' dataIndex='title' key='title' />
							</Table>
						</Col>
					</Row>
				</LoudPaddingDiv>
			</MaxHeightDiv>
			<EditCreateCoupon
				couponData={selectedCoupon}
				modifyCouponValue={onCouponValueChange}
				isDrawerVisible={isDrawerVisible}
			/>
		</PageLayout>
	);
}

export async function getServerSideProps(ctx) {
	const { query } = ctx;
	const retailerId = query.id || "";
	const endPoint = `/v1/offers/${retailerId}`;
	return {
		props: {
			retailerId,
		},
	};
	// try {
	// 	const response = await fetcher({
	// 		ctx,
	// 		endPoint,
	// 		method: "GET",
	// 	});
	// 	if (response.statusCode <= "300") {
	// 		return {
	// 			props: {
	// 				couponData: response.data,
	// 				// serverTotal: response.data.data.data.count || response.data.length || 0,
	// 			},
	// 		};
	// 	} else {
	// 		throw new Error();
	// 	}
	// } catch (e) {
	// 	return {
	// 		props: {},
	// 	};
	// }
}

export default ProtectRoute(ModifyRetailerCoupon);
