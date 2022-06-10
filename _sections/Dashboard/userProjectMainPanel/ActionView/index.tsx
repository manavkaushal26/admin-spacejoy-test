import { CartInfoProps } from "@customTypes/IncentiveTypes";
import { Role } from "@customTypes/userType";
import { SilentDivider } from "@sections/Dashboard/styled";
import { UserProjectSidePanelState } from "@sections/Dashboard/UserProjectSidepanel/reducer";
import useAuth from "@utils/authContext";
import { phaseBasedFilters, quizStatusBasedFilters, timeBasedFilters } from "@utils/searchFilterConstants";
import { Col, Row, Typography } from "antd";
import React from "react";
import ActionViewCard from "./ActionViewCard";
import ProjectCountCard from "./ProjectCountCard";

const { Title } = Typography;

interface ActionView {
	setSearchFiltersChanged: React.Dispatch<React.SetStateAction<UserProjectSidePanelState>>;
	cartInfoData: CartInfoProps;
	shoppingData: any;
	incentiveData: any;
	leaderboardData: any;
	setActionPanelView: (bool) => void;
	loader?: boolean;
	cartLoading?: boolean;
}

const ActionView: React.FC<ActionView> = ({
	setSearchFiltersChanged,
	cartInfoData,
	shoppingData,
	incentiveData,
	leaderboardData,
	setActionPanelView,
	loader,
	cartLoading,
}) => {
	const { user } = useAuth();

	return (
		<>
			<Row justify='center' gutter={[8, 8]}>
				<Col offset={1} span={23}>
					<Title>Overview</Title>
				</Col>
				{user.role === Role.Owner || user.role === Role.Admin || user.role === Role.Designer ? (
					<>
						<Col span={24}>
							<Row gutter={[8, 8]}>
								<Col span={24}>
									<Title level={4}>Ecommerce Data</Title>
								</Col>
								<Col span={24}>
									<Row gutter={[8, 8]}>
										<Col span={6}>
											<ActionViewCard
												label='Designer Leaderboard'
												btnText='Click to view'
												count={
													leaderboardData?.leaderboard?.length
														? leaderboardData.leaderboard[0]?.designerInfo?.profile?.name
														: ""
												}
												onClick={() => {
													setActionPanelView("DesignerLeaderboard");
												}}
												loader={loader}
											/>
										</Col>
										<Col span={6}>
											<ActionViewCard
												label='Customer Carts (3 months)'
												btnText='Click to view'
												count={cartInfoData.totalCartSize}
												onClick={() => {
													setActionPanelView("CartInformation");
												}}
												loader={cartLoading}
											/>
										</Col>
										<Col span={6}>
											<ActionViewCard
												label='Last Month Orders/Incentive'
												btnText='Click to view'
												count={shoppingData?.monthlyIncentive}
												onClick={() => {
													setActionPanelView("LastMonthIncentiveCalData");
												}}
												dollar
												loader={loader}
											/>
										</Col>
										<Col span={6}>
											<ActionViewCard
												label='Total Design Incentive'
												btnText='Click to view'
												count={incentiveData?.totalIncentive}
												onClick={() => {
													setActionPanelView("TotalIncentiveCalData");
												}}
												loader={loader}
												dollar
											/>
										</Col>
									</Row>
								</Col>
							</Row>
						</Col>
						<Col span={24}>
							<SilentDivider />
						</Col>
					</>
				) : null}

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
		</>
	);
};

export default ActionView;
