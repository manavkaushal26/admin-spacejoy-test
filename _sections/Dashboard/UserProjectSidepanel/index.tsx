import { searchProjectsApi } from "@api/projectApi";
import {
	HumanizePhaseInternalNames,
	PhaseCustomerNames,
	PhaseInternalNames,
	RoomNameSearch,
	UserProjectType,
} from "@customTypes/dashboardTypes";
import { Status } from "@customTypes/userType";
import { PaddedDiv } from "@sections/Header/styled";
import { getValueSafely } from "@utils/commonUtils";
import fetcher from "@utils/fetcher";
import { Col, Collapse, Icon, Input, Row, Select, Typography } from "antd";
import React, { useEffect, useRef, useState } from "react";
import LoadingCard from "../LoadingCard";
import { MaxHeightDiv, SilentButton, SilentDivider } from "../styled";
import UserProjectCard from "../UserProjectCards";
import ProjectInfiniteLoaderWrapper from "./ProjectInfiniteLoaderWrapper";
import { phaseDefaultValues, SortFields, UserProjectSidePanelInitialState, UserProjectSidePanelState } from "./reducer";

const { Text } = Typography;
const { Option } = Select;

const getRequestBody = (
	nameSearchText: string,
	designerSearchText: string,
	phase: PhaseInternalNames[],
	currentTab: string,
	roomName: string,
	by: SortFields,
	order: -1 | 1
): Record<string, Record<string, string | PhaseInternalNames[]>> => {
	const body = {
		customerName: { search: "single", value: nameSearchText },
		"team.memberName": { search: "single", value: designerSearchText },
		"currentPhase.name.internalName": { search: "array", value: phase },
		status: { search: "single", value: currentTab === "all" ? "" : currentTab },
		name: {
			search: "single",
			value: roomName,
		},
		sort: {
			by,
			order: order.toString(),
		},
	};
	return body;
};

interface SidebarProps {
	updateStartDateInMainPanel: (pid: string, date: Partial<UserProjectType>) => void;
	handleSelectCard: (user: string) => void;
	selectedUser: string;
	projectPhaseUpdateValue: {
		pid: string;
		projectPhase: {
			internalName: PhaseInternalNames;
			customerName: PhaseCustomerNames;
		};
	};
	collapsed: boolean;
	setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
	setProjectPhaseUpdateValue: React.Dispatch<
		React.SetStateAction<{
			pid: string;
			projectPhase: {
				internalName: PhaseInternalNames;
				customerName: PhaseCustomerNames;
			};
		}>
	>;
}

const TabSearch = ({ activePanel, setActivePanel, count, setState: updateState, state: initialState }): JSX.Element => {
	const [state, setState] = useState<UserProjectSidePanelState>(initialState);

	const handleSearch = (value: string, type: "customer" | "designer"): void => {
		if (type === "customer") {
			setState({
				...state,
				nameSearchText: value,
			});
		} else if (type === "designer") {
			setState({
				...state,
				designerSearchText: value,
			});
		}
	};

	const handleSelectFilter = (value, type: "phase" | "name" | "sortOrder" | "sortBy" | "status"): void => {
		setState({ ...state, [type]: value });
	};

	useEffect(() => {
		updateState(state);
	}, [state.nameSearchText, state.designerSearchText, state.phase, state.sortBy, state.sortOrder, state.status]);

	return (
		<div style={{ position: "absolute", zIndex: 1, width: "100%" }}>
			<Collapse activeKey={activePanel} onChange={(keys): void => setActivePanel(keys[0])}>
				<Collapse.Panel key="filterandsort" header={`Sort & Filters (${count} Projects)`}>
					<Row type="flex" justify="end">
						<Col>
							<SilentButton
								onClick={(): void => {
									setState({ ...UserProjectSidePanelInitialState });
								}}
								type="link"
							>
								<small>Reset Filters</small>
							</SilentButton>
						</Col>
					</Row>
					<Row gutter={[4, 8]}>
						<Col span={24}>
							<Row gutter={[0, 4]}>
								<Col>
									<Text>Customer</Text>
								</Col>
								<Col>
									<Input
										value={state.nameSearchText}
										style={{ width: "100%" }}
										onChange={(e): void => {
											const {
												target: { value },
											} = e;
											handleSearch(value, "customer");
										}}
										placeholder="Customer Name"
										allowClear
										prefix={<Icon type="search" />}
									/>
								</Col>
							</Row>
						</Col>
						<Col span={12}>
							<Row gutter={[0, 4]}>
								<Col>
									<Text>Designer</Text>
								</Col>
								<Col>
									<Input
										value={state.designerSearchText}
										style={{ width: "100%" }}
										onChange={(e): void => {
											e.persist();
											const {
												target: { value },
											} = e;
											handleSearch(value, "designer");
										}}
										placeholder="Designer Name"
										allowClear
										prefix={<Icon type="search" />}
									/>
								</Col>
							</Row>
						</Col>
						<Col span={12}>
							<Row gutter={[0, 4]}>
								<Col>
									<Text>Room Name</Text>
								</Col>
								<Col>
									<Select
										value={state.name}
										style={{ width: "100%" }}
										defaultValue={null}
										onChange={(value): void => handleSelectFilter(value, "name")}
									>
										<Option value="">Filter by Room Name</Option>
										{RoomNameSearch.map(roomName => {
											return (
												<Option key={roomName} value={roomName}>
													{roomName}
												</Option>
											);
										})}
									</Select>
								</Col>
							</Row>
						</Col>
						<Col span={24}>
							<Row gutter={[0, 4]}>
								<Col>
									<Text>Phase</Text>
								</Col>
								<Col>
									<Select
										value={state.phase}
										style={{ width: "100%" }}
										defaultValue={phaseDefaultValues}
										mode="multiple"
										maxTagCount={2}
										placeholder="All Phases Shown"
										onChange={(value): void => handleSelectFilter(value, "phase")}
									>
										{Object.keys(HumanizePhaseInternalNames).map(key => {
											return (
												<Option key={key} value={key}>
													{HumanizePhaseInternalNames[key]}
												</Option>
											);
										})}
									</Select>
								</Col>
							</Row>
						</Col>

						<Col span={24}>
							<Row gutter={[0, 4]}>
								<Col>
									<Text>Status</Text>
								</Col>
								<Col>
									<Select
										value={state.status}
										style={{ width: "100%" }}
										defaultValue={Status.active}
										maxTagCount={2}
										placeholder="All Status Shown"
										onChange={(value): void => handleSelectFilter(value, "status")}
									>
										{Object.keys(Status).map(key => {
											return (
												<Option key={key} value={Status[key]}>
													{key}
												</Option>
											);
										})}
									</Select>
								</Col>
							</Row>
						</Col>

						<Col span={12}>
							<Row gutter={[0, 4]}>
								<Col>
									<Text>Sort by</Text>
								</Col>
								<Col>
									<Select
										value={state.sortBy}
										style={{ width: "100%" }}
										defaultValue={SortFields["End Date"]}
										onChange={(value): void => handleSelectFilter(value, "sortBy")}
									>
										{Object.keys(SortFields).map(key => {
											return (
												<Option key={key} value={SortFields[key]}>
													{key}
												</Option>
											);
										})}
									</Select>
								</Col>
							</Row>
						</Col>
						<Col span={12}>
							<Row gutter={[0, 4]}>
								<Col>
									<Text>Sort order</Text>
								</Col>
								<Col>
									<Select
										value={state.sortOrder}
										style={{ width: "100%" }}
										onChange={(value): void => handleSelectFilter(value, "sortOrder")}
										defaultValue={1}
									>
										<Option value={-1}>Descending</Option>
										<Option value={1}>Ascending</Option>
									</Select>
								</Col>
							</Row>
						</Col>
					</Row>
				</Collapse.Panel>
			</Collapse>
		</div>
	);
};
TabSearch.displayName = "TabSearch";

const UserProjectSidePanel: React.FC<SidebarProps> = ({
	handleSelectCard,
	selectedUser,
	projectPhaseUpdateValue,
	setProjectPhaseUpdateValue,
}) => {
	const [data, setData] = useState<UserProjectType[]>([]);
	const [count, setCount] = useState(1000);
	const [activePanel, setActivePanel] = useState<string>(null);
	const [state, setState] = useState(UserProjectSidePanelInitialState);
	const [loading, setLoading] = useState(false);
	const [intervalId, setIntervalId] = useState<number>(0);
	const [hasNextPage, setHasNextPage] = useState<boolean>(true);

	const scrollRef = useRef(null);
	const isItemLoaded = (index): boolean => {
		return !!data[index];
	};

	const loadMoreItems = async (startIndex, endIndex): Promise<void> => {
		setLoading(true);
		const endPoint = `${searchProjectsApi()}?skip=${startIndex}&limit=${endIndex - startIndex + 1}`;
		const body = getRequestBody(
			state.nameSearchText,
			state.designerSearchText,
			state.phase,
			state.currentTab,
			state.name,
			state.sortBy,
			state.sortOrder
		);
		const resData = await fetcher({
			endPoint,
			method: "POST",
			body: {
				data: body,
			},
		});
		const copyData = [...data];
		if (resData.statusCode <= 300) {
			const responseData = resData.data.data;
			setCount(resData.data.count);

			for (let i = startIndex, j = 0; i <= endIndex; i += 1, j += 1) {
				copyData[i] = responseData[j];
				if (!(i + 1 <= endIndex)) {
					setData(
						copyData.filter(copy => {
							return copy;
						})
					);
				}
			}
		}
		setLoading(false);
	};

	const infiniteLoaderRef = useRef(null);

	useEffect(() => {
		if (infiniteLoaderRef.current) {
			setIntervalId(
				setTimeout(() => {
					setCount(0);
					setData([]);
					infiniteLoaderRef.current.resetloadMoreItemsCache();
					loadMoreItems(0, 299);
				}, 750)
			);
		}
		return (): void => {
			clearInterval(intervalId);
		};
	}, [
		state.name,
		state.nameSearchText,
		state.designerSearchText,
		state.phase,
		state.sortBy,
		state.sortOrder,
		state.status,
	]);

	useEffect(() => {
		if (projectPhaseUpdateValue) {
			if (infiniteLoaderRef.current) {
				infiniteLoaderRef.current.resetloadMoreItemsCache();
			}
		}

		setProjectPhaseUpdateValue(null);
	}, [projectPhaseUpdateValue]);

	useEffect(() => {
		if (data.length < count) {
			setHasNextPage(true);
		} else {
			setHasNextPage(false);
		}
	}, [data]);

	const CardRow = ({ index, style }): JSX.Element => {
		if (isItemLoaded(index)) {
			return (
				<div style={style}>
					<UserProjectCard
						selectedUser={selectedUser}
						key={data[index]._id}
						index={index}
						handleSelectCard={handleSelectCard}
						userProjectData={data[index]}
					/>
					<PaddedDiv>
						<SilentDivider />
					</PaddedDiv>
				</div>
			);
		}
		return (
			<div style={style}>
				<LoadingCard />
			</div>
		);
	};

	return (
		<MaxHeightDiv style={{ backgroundColor: "#f2f4f6" }} ref={scrollRef}>
			<TabSearch
				activePanel={activePanel}
				setActivePanel={setActivePanel}
				count={count}
				setState={setState}
				state={state}
			/>
			{loading && (
				<div style={{ paddingTop: "46px" }}>
					<LoadingCard />
				</div>
			)}
			<div style={{ paddingTop: "46px" }}>
				<ProjectInfiniteLoaderWrapper
					infiniteLoaderRef={infiniteLoaderRef}
					hasNextPage={hasNextPage}
					items={data}
					count={count}
					Row={CardRow}
					loadNextPage={loadMoreItems}
					isNextPageLoading={loading}
					height={getValueSafely(() => scrollRef.current.offsetHeight - 46, 700)}
				/>
			</div>
		</MaxHeightDiv>
	);
};

export default UserProjectSidePanel;
