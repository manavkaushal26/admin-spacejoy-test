import { ArrowLeftOutlined } from "@ant-design/icons";
import { MaxHeightDiv } from "@sections/Dashboard/styled";
import PageLayout from "@sections/Layout";
import { redirectToLocation } from "@utils/authContext";
import fetcher from "@utils/fetcher";
import { Col, Row, Switch, Table, Typography } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";
import { LoudPaddingDiv } from "pages/platformanager";
import React, { useEffect, useState } from "react";
import { styleFetcher } from "./helper";
const { Title, Text } = Typography;
export default function StylesList() {
	const [styles, setStylesData] = useState([]);
	const [isLoading, setLoader] = useState(false);
	const Router = useRouter();
	useEffect(() => {
		setLoader(true);
		styleFetcher("/quiz/admin/v1/styles", "GET")
			.then(res => {
				setStylesData(res.data);
				setLoader(false);
			})
			.catch(err => console.log(err))
			.finally(() => {
				setLoader(false);
			});
	}, []);

	const getLatestStyles = () => {
		styleFetcher("/quiz/admin/v1/styles", "POST")
			.then(res => {
				setStylesData([...res.data, ...styles]);
			})
			.catch(err => console.log(err))
			.finally(() => {});
	};

	const updateStyleStatus = async (checked, id) => {
		try {
			await fetcher({
				endPoint: "/quiz/admin/v1/styles/active",
				method: "POST",
				body: { styleId: id, active: checked ? "yes" : "no" },
			});
		} catch {
			throw new Error();
		} finally {
		}
	};

	const handleToggle = (checked, id) => {
		updateStyleStatus(checked, id);
	};

	return (
		<PageLayout pageName='Styles List'>
			<MaxHeightDiv>
				<LoudPaddingDiv>
					<Col span={24}>
						<Title level={3}>
							<Row gutter={[8, 8]}>
								<Col>
									<ArrowLeftOutlined onClick={() => redirectToLocation({ pathname: "/stylequiz" })} />
								</Col>
								<Col>Style Quiz</Col>
							</Row>
						</Title>
					</Col>
					<br></br>
					<Row gutter={[4, 16]}>
						<Col sm={24} align='right'>
							{/* <Button type='primary' onClick={getLatestStyles}>
								Resync
							</Button> */}
						</Col>
					</Row>
					<Row gutter={[0, 16]}>
						<Col span={24}>
							<Table loading={isLoading} rowKey='_id' scroll={{ x: 768 }} dataSource={styles}>
								<Table.Column
									key='_id'
									title='Style Name'
									render={styles => {
										return (
											<Row>
												<Col span={24}>{styles.name}</Col>
											</Row>
										);
									}}
								/>
								<Table.Column
									key='id'
									title='Is Active'
									dataIndex='id'
									render={(text, record) => (
										<Switch defaultChecked={record.active} onChange={checked => handleToggle(checked, text)} />
									)}
								/>
								<Table.Column
									key='id'
									title='Go to'
									dataIndex='id'
									align='right'
									render={(text, record) => (
										<>
											<Link href={`/stylequiz/productList/${record.id}`} type='link'>
												Products
											</Link>
											&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
											<Link href={`/stylequiz/imageList/${record.id}`} type='link'>
												Images
											</Link>
											&nbsp;&nbsp;
										</>
									)}
								/>
							</Table>
						</Col>
					</Row>
				</LoudPaddingDiv>
			</MaxHeightDiv>
		</PageLayout>
	);
}
