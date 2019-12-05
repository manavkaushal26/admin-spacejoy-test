import { DetailedProject } from "@customTypes/dashboardTypes";
import BasicDetails from "@sections/Dashboard/userProjectMainPanel/basicDetails";
import fetcher from "@utils/fetcher";
import { Empty, Typography } from "antd";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { CustomDiv, MaxHeightDiv, SilentDivider } from "../styled";
import ProjectSummary from "./projectSummary";
import ProjectTabView from "./projectTabView";

const {Text} = Typography;

const userProjectMainPanel: React.FC<{ userProjectId: string, designId: string, loading: boolean, setLoading: React.Dispatch<React.SetStateAction<boolean>> }> = ({ userProjectId, designId, loading, setLoading}): JSX.Element => {
	const [projectData, setProjectData] = useState<DetailedProject>(null);

	const Router = useRouter();

	const fetchAndPopulate = async () => {
		setLoading(true);
		const response = await fetcher({ endPoint: `/admin/project/${userProjectId}`, method: "GET" });
		if (response.data) {
			setProjectData(response.data);
		}
		setLoading(false);
	};
	const onSelectDesign = (designId: string): void => {
		Router.push({ pathname: "/dashboard", query: { user: userProjectId, designId: designId } }, `/dashboard/pid/${userProjectId}/did/${designId}`);
	};

	const refetchData = () => {
		fetchAndPopulate();
	};


	useEffect(() => {
		if (userProjectId) {
			fetchAndPopulate();
		}
		return () => {
			setProjectData(null);
		};
	}, [userProjectId, ]);

	return (
		<CustomDiv width='100%' height='100%'>
		{projectData ? (
			<>
				<ProjectSummary projectData={projectData} />
				<SilentDivider />
				<BasicDetails projectData={projectData} />
				<ProjectTabView
					refetchData={refetchData}
					setLoading={setLoading}
					projectData={projectData}
					onSelectDesign={onSelectDesign}
					designId={designId}
				/>
			</>
		) : (
			<MaxHeightDiv >
				<CustomDiv width='100%' height='100%' type='flex' justifyContent='space-around' align='center'>
					<Empty description={<Text>Select a Project to work on!</Text>}/>
				</CustomDiv>
			</MaxHeightDiv>
		)}</CustomDiv>
	);
};

export default userProjectMainPanel;
