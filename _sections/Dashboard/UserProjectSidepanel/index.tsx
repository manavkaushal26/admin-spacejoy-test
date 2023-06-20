import { searchProjectsApi } from "@api/projectApi";
import {
	PhaseCustomerNames,
	PhaseInternalNames,
	ProjectSelectionTypeValues,
	UserProjectType,
} from "@customTypes/dashboardTypes";
import { Status } from "@customTypes/userType";
import { getValueSafely } from "@utils/commonUtils";
import fetcher from "@utils/fetcher";
import { Button, Col, Drawer, Row } from "antd";
import { Moment } from "moment";
import React, { useEffect, useRef, useState } from "react";
import LoadingCard from "../LoadingCard";
import UserProjectCard from "../UserProjectCards";
import { MaxHeightDiv } from "../styled";
import ProjectInfiniteLoaderWrapper from "./ProjectInfiniteLoaderWrapper";
import TabSearch from "./TabSearch";
import { SortFields, UserProjectSidePanelState } from "./reducer";

interface GetProjectSearchBodyType {
	nameSearchText: string;
	designerSearchText: string;
	phase: PhaseInternalNames[];
	designPhase: PhaseInternalNames[];
	roomName: string;
	by: SortFields;
	order: -1 | 1;
	startedAt: [Moment, Moment];
	endedAt: [Moment, Moment];
	status: Status;
	email: string;
	quizStatus: string;
	skip?: number;
	limit?: number;
	pause?: boolean;
	projectSelectionType?: ProjectSelectionTypeValues | "all";
}

export const getProjectSearchBody = ({
	nameSearchText,
	designerSearchText,
	phase,
	designPhase,
	roomName,
	by,
	order,
	startedAt,
	endedAt,
	status,
	email,
	quizStatus,
	skip,
	limit,
	pause,
	projectSelectionType,
}: GetProjectSearchBodyType): {
	filter: Record<
		string,
		| Record<string, string | PhaseInternalNames[] | string[] | boolean>
		| string
		| PhaseInternalNames[]
		| ProjectSelectionTypeValues
	>;
} => {
	const startedAtMap = startedAt?.map(value => {
		if (value !== null) {
			return value.format();
		}
		return null;
	});

	const endedAtMap = endedAt?.map(value => {
		if (value !== null) {
			return value.format();
		}
		return null;
	});
	const body = {
		filter: {
			"designPhases": designPhase,
			"customerName": { search: "single", value: nameSearchText },
			"team.member": { search: "single", value: designerSearchText },
			"currentPhase.name.internalName": { search: "array", value: phase },
			"status": { search: "single", value: status },
			"name": {
				search: "single",
				value: roomName,
			},
			"startedAt": {
				search: "range",
				value: startedAtMap,
			},
			"endedAt": {
				search: "range",
				value: endedAtMap,
			},
			"pause": {
				search: "single",
				value: pause,
			},
			...{
				...(projectSelectionType === "all"
					? {}
					: {
							projectSelectionType: {
								search: "single",
								value: projectSelectionType,
							},
					  }),
			},
			"email": email,
			...(quizStatus ? { "quizStatus.currentState": { search: "single", value: quizStatus } } : {}),
		},
		sort: {
			by,
			order: order.toString(),
		},
		skip,
		limit,
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
	state: UserProjectSidePanelState;
	setState: React.Dispatch<UserProjectSidePanelState>;
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
	changedState: UserProjectSidePanelState;
	setChangedState: React.Dispatch<React.SetStateAction<UserProjectSidePanelState>>;
	setCurrentUserId: (userId: string) => void;
}

const UserProjectSidePanel: React.FC<SidebarProps> = ({
	handleSelectCard,
	selectedUser,
	projectPhaseUpdateValue,
	setProjectPhaseUpdateValue,
	state,
	setState,
	changedState,
	setChangedState,
	setCurrentUserId,
}) => {
	const [data, setData] = useState<UserProjectType[]>([]);
	const [count, setCount] = useState(1000);
	const [loading, setLoading] = useState(false);
	const [hasNextPage, setHasNextPage] = useState<boolean>(true);
	const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
	const scrollRef = useRef(null);
	const isItemLoaded = (index): boolean => {
		return !!data[index];
	};

	const loadMoreItems = async (startIndex, endIndex): Promise<void> => {
		setLoading(true);
		const endPoint = `${searchProjectsApi()}`;
		const body = getProjectSearchBody({
			nameSearchText: state.nameSearchText,
			designerSearchText: state.designerSearchText,
			phase: state.phase,
			designPhase: state.designPhase,
			roomName: state.name,
			by: state.sortBy,
			order: state.sortOrder,
			startedAt: state.startedAt,
			endedAt: state.endedAt,
			status: state.status,
			email: state.email,
			quizStatus: state.quizStatus,
			skip: startIndex,
			limit: endIndex - startIndex + 1,
			pause: state.pause,
			projectSelectionType: state.projectSelectionType,
		});

		const resData = await fetcher({
			endPoint,
			method: "POST",
			body: body,
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

	const toggleDrawer = (): void => {
		setDrawerOpen(prevState => {
			return !prevState;
		});
	};

	const onSearchSubmit = (): void => {
		setCount(0);
		setData([]);
		loadMoreItems(0, 19);
		toggleDrawer();
	};

	useEffect(() => {
		if (changedState) {
			setState(changedState);
			setChangedState(null);
		} else {
			if (!loading) {
				setCount(0);
				setData([]);
				loadMoreItems(0, 19);
			}
		}
	}, [changedState]);

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
						handleSelectCard={handleSelectCard}
						userProjectData={data[index]}
						setCurrentUserId={setCurrentUserId}
					/>
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
		<MaxHeightDiv style={{ position: "relative", overflow: "hidden", backgroundColor: "#f2f4f6" }} ref={scrollRef}>
			<Row gutter={[8, 8]} style={{ position: "relative" }}>
				<Col span={24}>
					<Button block type='primary' onClick={toggleDrawer}>
						Sort &amp; filter ({loading ? 0 : count} Results)
					</Button>
				</Col>
				<Drawer
					placement='left'
					title='Sort &amp; Filters'
					getContainer={false}
					style={{ position: "absolute" }}
					onClose={toggleDrawer}
					visible={drawerOpen}
					width='100%'
				>
					<Row gutter={[16, 16]}>
						<Col span={24}>
							<TabSearch setState={setState} state={state} onSearchSubmit={onSearchSubmit} />
						</Col>
						<Col span={24}>
							<Row gutter={[8, 8]} justify='end'>
								<Col>
									<Button onClick={toggleDrawer}>Cancel</Button>
								</Col>
								<Col>
									<Button type='primary' onClick={onSearchSubmit} disabled={loading} loading={loading}>
										Submit
									</Button>
								</Col>
							</Row>
						</Col>
					</Row>
				</Drawer>
				{/* Implement better logic here to render the loading card while loading */}
				{!hasNextPage ? (
					<Col span={24}>
						<LoadingCard />
					</Col>
				) : (
					<Col span={24}>
						<ProjectInfiniteLoaderWrapper
							infiniteLoaderRef={infiniteLoaderRef}
							hasNextPage={hasNextPage}
							items={data}
							count={count}
							Row={CardRow}
							loadNextPage={loadMoreItems}
							isNextPageLoading={loading}
							height={getValueSafely(() => scrollRef.current.offsetHeight - 44, 700)}
						/>
					</Col>
				)}
			</Row>
		</MaxHeightDiv>
	);
};

export default UserProjectSidePanel;
