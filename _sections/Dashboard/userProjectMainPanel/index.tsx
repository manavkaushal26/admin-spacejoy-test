import {
	getCartInformationApiEndpoint,
	getIncentiveCalApiEndpoint,
	getRevisionFormForProjectId,
	getShoppingDataApiEndpoint,
} from "@api/projectApi";
import {
	DetailedProject,
	PhaseCustomerNames,
	PhaseInternalNames,
	RevisionForm,
	UserProjectType,
} from "@customTypes/dashboardTypes";
import { CartInfoProps } from "@customTypes/IncentiveTypes";
import BasicDetails from "@sections/Dashboard/userProjectMainPanel/BasicDetails";
import { getValueSafely } from "@utils/commonUtils";
import fetcher from "@utils/fetcher";
import { Col, notification, Row, Spin } from "antd";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import useAuth from "../../../_utils/authContext";
import { VerticalPaddedDiv } from "../styled";
import { UserProjectSidePanelState } from "../UserProjectSidepanel/reducer";
import ActionView from "./ActionView";
import IncentiveCalView from "./IncentiveCalView/index";
import IncentiveCart from "./IncentiveCart/index";
import ProjectSummary from "./ProjectSummary";
import ProjectTabView from "./ProjectTabView";
import ShoppingData from "./ShoppingData";

const userProjectMainPanel: React.FC<{
	updateProjectPhaseInSidepanel: (
		id: string,
		phase: {
			internalName: PhaseInternalNames;
			customerName: PhaseCustomerNames;
		}
	) => void;
	currentTab: string;
	userProjectId: string;
	chatdid: string;
	designId: string;
	dates: Partial<UserProjectType>;
	setDates: React.Dispatch<React.SetStateAction<Partial<DetailedProject>>>;
	setSearchFiltersChanged: React.Dispatch<React.SetStateAction<UserProjectSidePanelState>>;
}> = ({
	updateProjectPhaseInSidepanel,
	userProjectId,
	designId,
	dates,
	chatdid,
	setDates,
	currentTab,
	setSearchFiltersChanged,
}): JSX.Element => {
	const [projectData, setProjectData] = useState<DetailedProject>(null);
	const [loading, setLoading] = useState<boolean>(false);
	const Router = useRouter();
	const [revisionFormData, setRevisionFormData] = useState<RevisionForm>(null);
	const [cartInformation, setCartInfo] = useState<CartInfoProps>({ result: [], totalCartSize: 0 });
	const [shoppingData, setShoppingData] = useState<any>({ orders: [], totalLastMonthOrders: 0 });
	const [incentiveCalData, setIncentiveCalData] = useState<any>({
		totalDesignIncentive: {
			totalIncentive: 0,
			projects: [],
			size: 0,
		},
		monthlyDesignIncentive: {
			monthlyIncentive: 0,
			projects: [],
			size: 0,
		},
	});

	const [actionPanelView, setActionPanelView] = useState("ActionPanel");

	const { user } = useAuth();

	async function getCartInformation() {
		try {
			const endPoint = getCartInformationApiEndpoint();
			const res = await fetcher({
				endPoint,
				method: "GET",
			});
			if (res.statusCode <= 300) {
				setCartInfo(res.data);
			} else {
				setCartInfo({ result: [], totalCartSize: 0 });
			}
		} catch (error) {
			// eslint-disable-next-line no-console
			console.log(error);
		}
	}

	async function getShoppingData() {
		try {
			const endPoint = getShoppingDataApiEndpoint();
			const res = await fetcher({
				endPoint,
				method: "POST",
				body: {
					email: user.email,
				},
			});
			if (res.statusCode <= 300) {
				setShoppingData(res.data);
			} else {
				setShoppingData({ orders: [], totalLastMonthOrders: 0 });
			}
		} catch (error) {
			// eslint-disable-next-line no-console
			console.log(error);
		}
	}

	async function getIncentiveCalculationData() {
		try {
			const endPoint = getIncentiveCalApiEndpoint();
			const res = await fetcher({
				endPoint,
				method: "GET",
			});
			if (res.statusCode <= 300) {
				setIncentiveCalData(res.data);
			} else {
				setIncentiveCalData({
					totalDesignIncentive: {
						totalIncentive: 0,
						projects: [],
						size: 0,
					},
					monthlyDesignIncentive: {
						monthlyIncentive: 0,
						projects: [],
						size: 0,
					},
				});
			}
		} catch (error) {
			// eslint-disable-next-line no-console
			console.log(error);
		}
	}

	useEffect(() => {
		getCartInformation();
		getIncentiveCalculationData();
	}, []);

	useEffect(() => {
		if (user.email !== undefined) {
			getShoppingData();
		}
	}, [user.email]);

	const fetchAndPopulateProjectData = async (): Promise<void> => {
		setLoading(true);
		const response = await fetcher({ endPoint: `/admin/project/${userProjectId}`, method: "GET" });
		if (response.statusCode <= 300) {
			setProjectData(response.data);
		}
		setLoading(false);
	};

	const updateRevisionData = (modifiedRevisonData: RevisionForm): void => {
		setRevisionFormData({
			...modifiedRevisonData,
		});
	};

	const fetchAndPopulateRevisionForm = async (): Promise<void> => {
		const endPoint = getRevisionFormForProjectId(userProjectId);
		const response = await fetcher({ endPoint, method: "GET" });
		try {
			if (response.statusCode <= 300) {
				setRevisionFormData(response.data);
			}
		} catch (e) {
			notification.error({ message: "Failed to load revision form" });
		}
	};

	const refetchAllData = async () => {
		await fetchAndPopulateProjectData();
		await fetchAndPopulateRevisionForm();
	};

	useEffect(() => {
		if (projectData) {
			updateProjectPhaseInSidepanel(userProjectId, projectData.currentPhase.name);
		}
	}, [
		getValueSafely(() => projectData.currentPhase.name, {
			internalName: PhaseInternalNames.requirement,
			customerName: PhaseCustomerNames.brief,
		}),
	]);

	useEffect(() => {
		if (dates) {
			setProjectData({
				...projectData,
				endedAt: dates.endedAt,
				startedAt: dates.startedAt,
			});
			setDates(null);
		}
	}, [dates]);

	const onSelectDesign = (selectedDesignId?: string): void => {
		if (selectedDesignId) {
			Router.push(
				{
					pathname: "/dashboard",
					query: { pid: userProjectId, designId: selectedDesignId },
				},
				`/dashboard/pid/${userProjectId}/did/${selectedDesignId}`
			);
			return;
		}
		Router.push({ pathname: "/dashboard", query: { pid: userProjectId } }, `/dashboard/pid/${userProjectId}`);
	};

	useEffect(() => {
		if (!designId) {
			if (userProjectId) {
				fetchAndPopulateProjectData();
			}
		}
	}, [designId]);

	useEffect(() => {
		if (userProjectId) {
			fetchAndPopulateProjectData();
			fetchAndPopulateRevisionForm();
		}
		return (): void => {
			setProjectData(null);
		};
	}, [userProjectId]);

	const onTabChange = (activeKey, pid, did): void => {
		Router.push(
			{
				pathname: "/dashboard",
				query: { pid, designId: did, activeKey },
			},
			`/dashboard/pid/${projectData._id}/did/${did}?activeKey=${activeKey}`,
			{ shallow: true }
		);
	};

	const renderComponentView = () => {
		switch (actionPanelView) {
			case "CartInformation":
				return <IncentiveCart data={cartInformation} setActionPanelView={setActionPanelView} />;
			case "ShoppingData":
				return <ShoppingData data={shoppingData} setActionPanelView={setActionPanelView} />;
			case "IncentiveCalData":
				return <IncentiveCalView data={incentiveCalData} setActionPanelView={setActionPanelView} />;
			default:
				return (
					<ActionView
						setSearchFiltersChanged={setSearchFiltersChanged}
						cartInfoData={cartInformation}
						shoppingData={shoppingData}
						incentiveData={incentiveCalData}
						setActionPanelView={setActionPanelView}
					/>
				);
		}
	};

	return (
		<Spin spinning={loading}>
			<Row gutter={[8, 8]}>
				{projectData ? (
					<>
						<Col span={24}>
							<ProjectSummary
								projectData={projectData}
								setProjectData={setProjectData}
								fetchAndPopulateProjectData={fetchAndPopulateProjectData}
							/>
						</Col>
						<Col span={24}>
							<BasicDetails projectData={projectData} />
						</Col>
						<Col span={24}>
							<ProjectTabView
								updateRevisionData={updateRevisionData}
								onTabChangeCallback={onTabChange}
								currentTab={currentTab}
								refetchData={refetchAllData}
								setLoading={setLoading}
								chatdid={chatdid}
								projectData={projectData}
								onSelectDesign={onSelectDesign}
								designId={designId}
								setProjectData={setProjectData}
								revisionFormData={revisionFormData}
							/>
						</Col>
					</>
				) : (
					<Col span={24}>
						<VerticalPaddedDiv>{renderComponentView()}</VerticalPaddedDiv>
					</Col>
				)}
			</Row>
		</Spin>
	);
};

export default userProjectMainPanel;
