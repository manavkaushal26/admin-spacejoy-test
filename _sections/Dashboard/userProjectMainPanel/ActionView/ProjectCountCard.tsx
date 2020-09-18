import { searchProjectsCountApi } from "@api/projectApi";
import { getProjectSearchBody } from "@sections/Dashboard/UserProjectSidepanel";
import fetcher from "@utils/fetcher";
import { allFilterNames, searchFiltersPresets } from "@utils/searchFilterConstants";
import { Button, Card, Col, Row, Typography } from "antd";
import React, { useEffect, useState } from "react";

const { Text } = Typography;

interface ProjectCountCard {
	filterName: string;
	setSearchFiltersChanged: React.Dispatch<React.SetStateAction<any>>;
}

const ProjectCountCard: React.FC<ProjectCountCard> = ({ filterName, setSearchFiltersChanged }) => {
	const [count, setCount] = useState(0);

	const fetchProjectCount = async (): Promise<void> => {
		const endPoint = searchProjectsCountApi();

		const searchFilters = searchFiltersPresets({ type: filterName, from: 3, to: 5 });

		const body = getProjectSearchBody(
			searchFilters.nameSearchText,
			searchFilters.designerSearchText,
			searchFilters.phase,
			searchFilters.name,
			searchFilters.sortBy,
			searchFilters.sortOrder,
			searchFilters.startedAt,
			searchFilters.endedAt,
			searchFilters.status,
			searchFilters.email,
			searchFilters.quizStatus
		);
		const resData = await fetcher({
			endPoint,
			method: "POST",
			body: {
				data: body,
			},
		});
		if (resData.statusCode <= 300) {
			setCount(resData.data.count);
		}
	};

	const onClick = () => {
		setSearchFiltersChanged(searchFiltersPresets({ type: filterName, from: 3, to: 5 }));
	};

	useEffect(() => {
		fetchProjectCount();
	}, []);

	return (
		<Card
			hoverable
			actions={[
				<Button key='apply' onClick={onClick} type='link'>
					Click to see projects
				</Button>,
			]}
			onClick={onClick}
		>
			<Row gutter={[8, 8]}>
				<Col span={24}>
					<Text strong>{allFilterNames[filterName]}</Text>
				</Col>
				<Col span={24}>{count}</Col>
			</Row>
		</Card>
	);
};

export default ProjectCountCard;
