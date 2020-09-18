import { SilentDivider } from "@sections/Dashboard/styled";
import { UserProjectSidePanelState } from "@sections/Dashboard/UserProjectSidepanel/reducer";
import { phaseBasedFilters, quizStatusBasedFilters, timeBasedFilters } from "@utils/searchFilterConstants";
import { Col, Row, Typography } from "antd";
import React from "react";
import ProjectCountCard from "./ProjectCountCard";

const { Title } = Typography;

interface ActionView {
	setSearchFiltersChanged: React.Dispatch<React.SetStateAction<UserProjectSidePanelState>>;
}

const ActionView: React.FC<ActionView> = ({ setSearchFiltersChanged }) => {
	return (
		<Row justify='center' gutter={[8, 8]}>
			<Col offset={1} span={23}>
				<Title>Overview</Title>
			</Col>
			<Col span={24}>
				<SilentDivider />
			</Col>
			<Col span={24}>
				<Row gutter={[8, 8]}>
					<Col span={24}>
						<Title level={4}>Project Phase based count</Title>
					</Col>
					<Col span={24}>
						<Row gutter={[8, 8]}>
							{phaseBasedFilters.map(filterName => {
								return (
									<Col span={6} key={filterName}>
										<ProjectCountCard
											key={filterName}
											setSearchFiltersChanged={setSearchFiltersChanged}
											filterName={filterName}
										/>
									</Col>
								);
							})}
						</Row>
					</Col>
				</Row>
			</Col>
			<Col span={24}>
				<SilentDivider />
			</Col>
			<Col span={24}>
				<Row gutter={[8, 8]}>
					<Col span={24}>
						<Title level={4}>Due date based count</Title>
					</Col>
					<Col span={24}>
						<Row gutter={[8, 8]}>
							{timeBasedFilters.map(filterName => {
								return (
									<Col span={6} key={filterName}>
										<ProjectCountCard
											key={filterName}
											setSearchFiltersChanged={setSearchFiltersChanged}
											filterName={filterName}
										/>
									</Col>
								);
							})}
						</Row>
					</Col>
				</Row>
			</Col>
			<Col span={24}>
				<SilentDivider />
			</Col>
			<Col span={24}>
				<Row gutter={[8, 8]}>
					<Col span={24}>
						<Title level={4}>Quiz status based count</Title>
					</Col>
					<Col span={24}>
						<Row gutter={[8, 8]}>
							{quizStatusBasedFilters.map(filterName => {
								return (
									<Col span={6} key={filterName}>
										<ProjectCountCard
											key={filterName}
											setSearchFiltersChanged={setSearchFiltersChanged}
											filterName={filterName}
										/>
									</Col>
								);
							})}
						</Row>
					</Col>
				</Row>
			</Col>
		</Row>
	);
};

export default ActionView;
