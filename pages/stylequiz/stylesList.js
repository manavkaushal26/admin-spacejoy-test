import { MaxHeightDiv } from "@sections/Dashboard/styled";
import PageLayout from "@sections/Layout";
import fetcher from "@utils/fetcher";
import { Button, Col, Row, Switch, Table } from "antd";
import { LoudPaddingDiv } from "pages/platformanager";
import React, { useEffect, useState } from "react";
import { styleFetcher } from "./helper";
export default function StylesList() {
	const [styles, setStylesData] = useState([]);
	const [isLoading, setLoader] = useState(false);

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
		styleFetcher("POST")
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
				body: { styleId: id, active: checked.toString() },
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
					<Row gutter={[4, 16]}>
						<Col sm={24} align='right'>
							<Button type='primary' onClick={getLatestStyles}>
								Resync
							</Button>
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
									render={text => <Switch defaultChecked={false} onChange={checked => handleToggle(checked, text)} />}
								/>
								<Table.Column
									key='_id'
									title=''
									dataIndex='mongoId'
									render={text => <Button type='link'>Products</Button>}
								/>{" "}
							</Table>
						</Col>
					</Row>
				</LoudPaddingDiv>
			</MaxHeightDiv>
		</PageLayout>
	);
}
