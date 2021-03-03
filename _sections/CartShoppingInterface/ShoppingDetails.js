import OrderItemTable from "@sections/Ecommerce/OrderTracking/OrderItemTable";
import fetcher from "@utils/fetcher";
import { Col, notification } from "antd";
import React, { useEffect, useState } from "react";
import styled from "styled-components";

const ShopDetailsWrapper = styled.div`
	table tr th:last-child {
		display: none;
	}
	table tr td:last-child {
		display: none;
	}
`;

export default function ShoppingDetails({ id }) {
	const [shopData, setShopData] = useState([]);

	const getCartDetails = async () => {
		const payload = {
			filters: {
				email: id,
			},
			sort: -1,
		};
		const response = await fetcher({ endPoint: "/v1/orders/search?skip=0&limit=50 ", method: "POST", body: payload });
		if (response.statusCode <= 300) {
			setShopData(response?.data?.orders);
		} else {
			notification.error({ message: "Failed to fetch cart data" });
		}
	};

	useEffect(() => {
		getCartDetails();
	}, []);

	return (
		<ShopDetailsWrapper>
			{shopData.map(item => {
				return (
					<Col span={24} key={item?._id}>
						<h3>
							Order ID - {item?.orderId}&nbsp;&nbsp; <br></br>Total Amount - $ {item?.amount}
						</h3>
						<br></br>
						<OrderItemTable orderItems={item?.orderItems} />
						<br></br>
						<hr></hr>
						<br></br>
					</Col>
				);
			})}
		</ShopDetailsWrapper>
	);
}
