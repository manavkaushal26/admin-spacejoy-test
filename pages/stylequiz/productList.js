import { MaxHeightDiv } from "@sections/Dashboard/styled";
import PageLayout from "@sections/Layout";
import fetcher from "@utils/fetcher";
import { Card, Col, Row } from "antd";
import { LoudPaddingDiv } from "pages/platformanager";
import React, { useEffect, useState } from "react";
export default function ProductsList() {
	const [products, setProducts] = useState([]);

	const fetchProducts = async (endPoint, currentLimit, currentOffset) => {
		try {
			const resData = await fetcher({ endPoint: "/quiz/admin/v1/products", method: "GET" });
			const { data, statusCode } = resData;
			if (statusCode && statusCode <= 201) {
				console.log("d", data);
				return data;
			} else {
				// throw new Error();
			}
		} catch {
			// throw new Error();
		}
	};

	useEffect(() => {
		fetchProducts();
	}, []);

	return (
		<PageLayout pageName='Styles List'>
			<MaxHeightDiv>
				<LoudPaddingDiv>
					<Row gutter={[0, 16]}>
						{[1, 2, 3, 4, 5].map(item => {
							return (
								<Col sm={12} md={8} lg={6}>
									<Card hoverable>
										<Card.Meta title='test' />
									</Card>
								</Col>
							);
						})}
					</Row>
				</LoudPaddingDiv>
			</MaxHeightDiv>
		</PageLayout>
	);
}
