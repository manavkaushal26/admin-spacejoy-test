import React, { useState, useEffect } from "react";
import { DetailedProject } from "@customTypes/dashboardTypes";
import ProjectSummary from "./projectSummary";
import {  Spin, Empty, Typography } from "antd";
import BasicDetails from "@sections/Dashboard/userProjectMainPanel/basicDetails";
import ProjectTabView from "./projectTabView";
import fetcher from "@utils/fetcher";
import { MaxHeightDiv, CustomDiv, SilentDivider } from "../styled";
import styled, { css } from "styled-components";

const {Text} = Typography;

const userProjectMainPanel: React.FC<{ userProjectId: string }> = ({ userProjectId }): JSX.Element => {
	const [projectData, setProjectData] = useState<DetailedProject>(null);
	const [loading, setLoading] = useState<boolean>(false);
	const [designId, setDesignId] = useState<string>("");

	const fetchAndPopulate = async () => {
		setLoading(true);
		const response = await fetcher({ endPoint: `/admin/project/${userProjectId}`, method: "GET" });
		if (response.data) {
			console.log(response.data);
			setProjectData(response.data);
		}
		setLoading(false);
	};

	const onSelectDesign = (designId: string): void => {
		setDesignId(designId);
	};

	const refetchData = () => {
		fetchAndPopulate();
	};
	
    const FullHeightSpin = styled(Spin)<{spinning:boolean}>`
        height: 100%;   
		justify-content: center;
		align-items: center;
		visibility: hidden;
		position: absolute;
		width: 100%;
		${({spinning})=> spinning && css`
			display: flex;
			visibility: visible;
			z-index: 1100;
			background: rgba(255,255,255,0.8);
		`}
    `;

	useEffect(() => {
		if (userProjectId != "") {
			setDesignId("");
			fetchAndPopulate();
		}
		return () => {
			setProjectData(null);
		};
	}, [userProjectId]);

	return (
		<><FullHeightSpin spinning={loading}/>
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
		)}</>
	);
};

export default userProjectMainPanel;
