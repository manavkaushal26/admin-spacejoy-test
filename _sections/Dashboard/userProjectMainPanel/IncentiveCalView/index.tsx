import { getProjectsOverviewApiEndpoint } from "@api/projectApi";
import fetcher from "@utils/fetcher";
import { Button, Row, Table, Typography } from "antd";
import moment from "moment-timezone";
import React, { useEffect, useState } from "react";

const { Title } = Typography;

const IncentiveCalView = ({ data, setActionPanelView }) => {
	const [loading, setLoading] = useState(false);
	const [projectsData, setProjectsData] = useState([]);

	async function getProjectsInformation() {
		setLoading(true);
		try {
			const endPoint = getProjectsOverviewApiEndpoint();
			const res = await fetcher({
				endPoint,
				method: "POST",
				body: { projects: data.totalDesignIncentive.projects },
			});
			if (res.statusCode <= 300) {
				setProjectsData(res.data);
			} else {
				setProjectsData([]);
			}
		} catch (error) {
			// eslint-disable-next-line no-console
			console.log(error);
		} finally {
			setLoading(false);
		}
	}

	useEffect(() => {
		getProjectsInformation();
	}, []);

	const IncentiveCalTableColumns = [
		{
			title: "Customer Name",
			key: "customerName",
			render: rowData => rowData?.customer?.profile?.name,
		},
		{
			title: "Project Name",
			key: "projectName",
			render: rowData => rowData?.project?.name,
		},
		{
			title: "Project ID",
			key: "projectId",
			render: rowData => rowData?.project?._id,
		},
		{
			title: "Order Id",
			dataIndex: "order",
			key: "order",
		},
		{
			title: "Order Created (Month)",
			key: "orderCreationDate",
			render: rowData => moment(rowData.orderCreationDate).format("MMMM, YYYY"),
		},
		{
			title: "Incentive",
			key: "incentive",
			render: rowData => (rowData.incentive === 0 ? "-" : `$${rowData.incentive}`),
		},
	];

	return (
		<div style={{ marginLeft: "2rem" }}>
			<Row>
				<Button
					onClick={() => {
						setActionPanelView("ActionPanel");
					}}
					style={{ marginBottom: "1rem" }}
				>
					Back
				</Button>
			</Row>
			<Row style={{ marginBottom: "1rem" }}>
				<Title level={4}>
					Total Design Incentive: <span style={{ color: "red" }}>${data.totalDesignIncentive.totalIncentive}</span>
				</Title>
			</Row>
			<Table dataSource={projectsData} columns={IncentiveCalTableColumns} loading={loading} />
		</div>
	);
};

export default IncentiveCalView;
