import { DetailedProject } from "@customTypes/dashboardTypes";
import BasicDetails from "@sections/Dashboard/userProjectMainPanel/BasicDetails";
import fetcher from "@utils/fetcher";
import { Empty, Spin, Typography } from "antd";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { CustomDiv, MaxHeightDiv, SilentDivider } from "../styled";
import ProjectSummary from "./ProjectSummary";
import ProjectTabView from "./ProjectTabView";

const { Text } = Typography;

const userProjectMainPanel: React.FC<{
	userProjectId: string;
	designId: string;
	loading: boolean;
	setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ userProjectId, designId }): JSX.Element => {
	const [projectData, setProjectData] = useState<DetailedProject>(null);
	const [loading, setLoading] = useState<boolean>(false);
	const Router = useRouter();

	const fetchAndPopulate = async () => {
		setLoading(true);
		const response = await fetcher({ endPoint: `/admin/project/${userProjectId}`, method: "GET" });
		if (response.statusCode <= 300) {
			setProjectData(response.data);
		}
		setLoading(false);
	};
	const onSelectDesign = (designId: string): void => {
		if (designId !== "") {
			Router.push(
				{ pathname: "/dashboard", query: { user: userProjectId, designId: designId } },
				`/dashboard/pid/${userProjectId}/did/${designId}`
			);
			return;
		}
		Router.push({ pathname: "/dashboard", query: { user: userProjectId } }, `/dashboard/pid/${userProjectId}`);
	};

	const refetchData = () => {
		fetchAndPopulate();
	};

	useEffect(() => {
		if (!designId) {
			fetchAndPopulate();
		}
	}, [designId]);

	useEffect(() => {
		if (userProjectId) {
			fetchAndPopulate();
		}
		return () => {
			setProjectData(null);
		};
	}, [userProjectId]);

	return (
		<Spin spinning={loading}>
			<CustomDiv width="100%" height="100%">
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
							setProjectData={setProjectData}
						/>
					</>
				) : (
					<MaxHeightDiv>
						<CustomDiv width="100%" height="100%" type="flex" justifyContent="space-around" align="center">
							<Empty description={<Text>Select a Project to work on!</Text>} />
						</CustomDiv>
					</MaxHeightDiv>
				)}
			</CustomDiv>
		</Spin>
	);
};

export default userProjectMainPanel;
