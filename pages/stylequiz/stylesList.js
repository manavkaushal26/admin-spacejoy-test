import { MaxHeightDiv } from "@sections/Dashboard/styled";
import PageLayout from "@sections/Layout";
import fetcher from "@utils/fetcher";
import { Col, Row, Table } from "antd";
import { LoudPaddingDiv } from "pages/platformanager";
import React, { useEffect, useState } from "react";
export default function StylesList() {
	const [styles, setStylesData] = useState("");

	const fetchCustomerChatData = async (endPoint, currentLimit, currentOffset) => {
		try {
			const resData = await fetcher({ endPoint: "/quiz/admin/v1/styles", method: "GET" });
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
		fetchCustomerChatData();
	}, []);

	return (
		<PageLayout pageName='Styles List'>
			<MaxHeightDiv>
				<LoudPaddingDiv>
					<Row gutter={[0, 16]}>
						<Table loading={false} rowKey='_id' scroll={{ x: 768 }} dataSource={styles}>
							<Table.Column
								key='_id'
								title='Name'
								render={styles => {
									return (
										<Row>
											<Col span={24}></Col>
										</Row>
									);
								}}
							/>
							<Table.Column key='_id' title='' dataIndex='imageId' render={text => <Text copyable>{text}</Text>} />
							<Table.Column key='_id' title='' dataIndex='productId' render={text => <Text>${text}</Text>} />
						</Table>
					</Row>
				</LoudPaddingDiv>
			</MaxHeightDiv>
		</PageLayout>
	);
}
