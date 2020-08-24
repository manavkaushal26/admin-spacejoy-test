import { searchProjectsApi } from "@api/projectApi";
import { PhaseCustomerNames, PhaseInternalNames, UserProjectType } from "@customTypes/dashboardTypes";
import { Status } from "@customTypes/userType";
import { getValueSafely } from "@utils/commonUtils";
import { useSessionStorage } from "@utils/customHooks/useSessionStorage";
import fetcher from "@utils/fetcher";
import { Button, Col, Drawer, Row } from "antd";
import { Moment } from "moment";
import React, { useEffect, useRef, useState } from "react";
import LoadingCard from "../LoadingCard";
import { MaxHeightDiv } from "../styled";
import UserProjectCard from "../UserProjectCards";
import ProjectInfiniteLoaderWrapper from "./ProjectInfiniteLoaderWrapper";
import { SortFields, UserProjectSidePanelInitialState } from "./reducer";
import TabSearch from "./TabSearch";

const getRequestBody = (
	nameSearchText: string,
	designerSearchText: string,
	phase: PhaseInternalNames[],
	roomName: string,
	by: SortFields,
	order: -1 | 1,
	startedAt: [Moment, Moment],
	endedAt: [Moment, Moment],
	status: Status,
	email: string
): Record<string, Record<string, string | PhaseInternalNames[] | string[]> | string> => {
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
		"customerName": { search: "single", value: nameSearchText },
		"team.memberName": { search: "single", value: designerSearchText },
		"currentPhase.name.internalName": { search: "array", value: phase },
		"status": { search: "single", value: status },
		"name": {
			search: "single",
			value: roomName,
		},
		"sort": {
			by,
			order: order.toString(),
		},
		"startedAt": {
			search: "range",
			value: startedAtMap,
		},
		"endedAt": {
			search: "range",
			value: endedAtMap,
		},
		"email": email,
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

const UserProjectSidePanel: React.FC<SidebarProps> = ({
	handleSelectCard,
	selectedUser,
	projectPhaseUpdateValue,
	setProjectPhaseUpdateValue,
}) => {
	const [data, setData] = useState<UserProjectType[]>([]);
	const [count, setCount] = useState(1000);
	const [state, setState] = useSessionStorage("tabSearch", UserProjectSidePanelInitialState);
	const [loading, setLoading] = useState(false);
	const [hasNextPage, setHasNextPage] = useState<boolean>(true);
	const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
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
			state.name,
			state.sortBy,
			state.sortOrder,
			state.startedAt,
			state.endedAt,
			state.status,
			state.email
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

	const toggleDrawer = (): void => {
		setDrawerOpen(prevState => {
			return !prevState;
		});
	};

	const onSearchSubmit = (): void => {
		setCount(0);
		setData([]);
		loadMoreItems(0, 299);
		toggleDrawer();
	};

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
		<MaxHeightDiv style={{ position: "relative", overflow: "hidden" }} ref={scrollRef}>
			<Row gutter={[8, 8]}>
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
									<Button type='primary' onClick={onSearchSubmit}>
										Submit
									</Button>
								</Col>
							</Row>
						</Col>
					</Row>
				</Drawer>
				{loading && (
					<Col span={24}>
						<LoadingCard />
					</Col>
				)}
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
			</Row>
		</MaxHeightDiv>
	);
};

export default UserProjectSidePanel;
