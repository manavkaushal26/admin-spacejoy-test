import { searchProjectsApi } from "@api/projectApi";
import { PhaseCustomerNames, PhaseInternalNames, UserProjectType } from "@customTypes/dashboardTypes";
import { PaddedDiv } from "@sections/Header/styled";
import { getValueSafely } from "@utils/commonUtils";
import fetcher from "@utils/fetcher";
import React, { useEffect, useRef, useState } from "react";
import { Status } from "@customTypes/userType";
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
	order: -1 | 1,
	status: Status
): Record<string, Record<string, string | PhaseInternalNames[]>> => {
	const body = {
		customerName: { search: "single", value: nameSearchText },
		"team.memberName": { search: "single", value: designerSearchText },
		"currentPhase.name.internalName": { search: "array", value: phase },
		status: { search: "single", value: status },
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
			state.sortOrder,
			state.status
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
				<div>
					<LoadingCard />
				</div>
			)}
			<div>
				<ProjectInfiniteLoaderWrapper
					infiniteLoaderRef={infiniteLoaderRef}
					hasNextPage={hasNextPage}
					items={data}
					count={count}
					Row={CardRow}
					loadNextPage={loadMoreItems}
					isNextPageLoading={loading}
					height={getValueSafely(
						() =>
							activePanel === "filterandsort"
								? scrollRef.current.offsetHeight - 417
								: scrollRef.current.offsetHeight - 46,
						700
					)}
				/>
			</div>
		</MaxHeightDiv>
	);
};

export default UserProjectSidePanel;
