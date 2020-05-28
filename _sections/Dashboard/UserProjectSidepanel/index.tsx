import { searchProjectsApi } from "@api/projectApi";
import { PhaseCustomerNames, PhaseInternalNames, UserProjectType } from "@customTypes/dashboardTypes";
import { PaddedDiv } from "@sections/Header/styled";
import { getValueSafely } from "@utils/commonUtils";
import fetcher from "@utils/fetcher";
import React, { useEffect, useRef, useState } from "react";
import { Drawer, Row, Col, Button } from "antd";
import LoadingCard from "../LoadingCard";
import { MaxHeightDiv, SilentDivider } from "../styled";
import UserProjectCard from "../UserProjectCards";
import ProjectInfiniteLoaderWrapper from "./ProjectInfiniteLoaderWrapper";
import { SortFields, UserProjectSidePanelInitialState } from "./reducer";
import TabSearch from "./TabSearch";

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

	const toggleDrawer = (): void => {
		setDrawerOpen(prevState => {
			return !prevState;
		});
	};

	const onSearchSubmit = (): void => {
		console.log("search Submit");
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
		<MaxHeightDiv style={{ backgroundColor: "#f2f4f6", position: "relative", overflow: "hidden" }} ref={scrollRef}>
			<Row gutter={[8, 8]}>
				<Col>
					<Button block type="primary" onClick={toggleDrawer}>
						Sort &amp; filter ({loading ? 0 : count} Results)
					</Button>
				</Col>
				<Drawer
					title="Sort &amp; Filters"
					getContainer={false}
					style={{ position: "absolute" }}
					onClose={toggleDrawer}
					visible={drawerOpen}
					width="100%"
				>
					<Row gutter={[16, 16]}>
						<Col span={24}>
							<TabSearch
								activePanel={activePanel}
								setActivePanel={setActivePanel}
								count={count}
								setState={setState}
								state={state}
							/>
						</Col>
						<Col span={24}>
							<Row type="flex" gutter={[8, 8]} justify="end">
								<Col>
									<Button onClick={toggleDrawer}>Cancel</Button>
								</Col>
								<Col>
									<Button type="primary" onClick={onSearchSubmit}>
										Submit
									</Button>
								</Col>
							</Row>
						</Col>
					</Row>
				</Drawer>
				{loading && (
					<Col>
						<LoadingCard />
					</Col>
				)}
				<Col>
					<ProjectInfiniteLoaderWrapper
						infiniteLoaderRef={infiniteLoaderRef}
						hasNextPage={hasNextPage}
						items={data}
						count={count}
						Row={CardRow}
						loadNextPage={loadMoreItems}
						isNextPageLoading={loading}
						height={getValueSafely(() => scrollRef.current.offsetHeight - 62, 700)}
					/>
				</Col>
			</Row>
		</MaxHeightDiv>
	);
};

export default UserProjectSidePanel;
