import { Card, Col, Row, Tabs, Tag, Typography, Spin } from "antd";
import { designApi } from "@api/designApi";
import Image from "@components/Image";
import { DetailedDesign, DetailedProject, HumanizeDesignPhases } from "@customTypes/dashboardTypes";
import { Role } from "@customTypes/userType";
import MoodboardTab from "@sections/Dashboard/userProjectMainPanel/moodboardTab";
import fetcher from "@utils/fetcher";
import React, { useEffect, useState } from "react";
import { CustomDiv, SilentDivider } from "../styled";
import CustomerResponses from "./CustomerResponses";
import TeamTab from "./TeamTab";
import NotesTab from "./NotesTab";
import styled from "styled-components";

import PipelineTab from "@sections/Dashboard/userProjectMainPanel/pipelineTab";
import { getValueSafely } from "@utils/commonUtils";
import DesignSelection from "./DesignSelection";

const { TabPane } = Tabs;

const { Text } = Typography;

interface ProjectTabViewProps {
	projectData: DetailedProject;
	designId: string;
	onSelectDesign: (designId: string) => void;
	setLoading: React.Dispatch<React.SetStateAction<boolean>>;
	refetchData: () => void;
}

const ScrollableTabs = styled(Tabs)`
	.ant-tabs-content {
		div[role="presentation"] + div {
			overflow-y: scroll;
		}
	}
`;

const ProjectTabView: React.FC<ProjectTabViewProps> = ({
	projectData,
	designId,
	onSelectDesign,
	setLoading,
	refetchData
}): JSX.Element => {
	const { form: formData } = projectData;
	const [designData, setDesignData] = useState<DetailedDesign>(null);
	const [designLoading, setDesignLoading] = useState<boolean>(false);

	const fetchDesignData = async () => {
		setDesignLoading(true);
		const endPoint = designApi(designId);
		const responseData = await fetcher({ endPoint: endPoint, method: "GET" });
		if (responseData.data) {
			setDesignData(responseData.data);
		}
		setDesignLoading(false);
	};

	const refetchDesignData = (): void => {
		fetchDesignData();
	};

	useEffect(() => {
		if (designId) {
			fetchDesignData();
			return;
		} else {
			setDesignData(null);
		}
		return () => {
			setDesignData(null);
			setDesignLoading(false);
		};
	}, [designId]);

	return (
		<>
			{designData !== null ? (
				<ScrollableTabs defaultActiveKey="6">
					<TabPane tab="Customer Responses" key="1">
						<CustomerResponses formData={formData || []} />
					</TabPane>
					<TabPane tab="Your Notes" key="2">
						<NotesTab refetchDesignData={refetchDesignData} designData={designData} />
					</TabPane>
					<TabPane tab="Moodboard" key="3">
						<MoodboardTab
							setDesignData={setDesignData}
							missingAssets={designData.missingAssetUrls}
							setLoading={setLoading}
							projectId={projectData._id}
							designId={designId}
						/>
					</TabPane>
					<TabPane tab="Discussions" key="4">
						Content of Tab Pane 4
					</TabPane>
					<TabPane tab="Team" key="5">
						<TeamTab
							refetchData={refetchData}
							setLoading={setLoading}
							projectId={projectData._id}
							assignedTeam={projectData.team.map(memberData => {
								return memberData.member;
							})}
						/>
					</TabPane>
					<TabPane tab="Pipeline" key="6">
						<PipelineTab designData={designData} refetchDesignData={refetchDesignData} />
					</TabPane>
				</ScrollableTabs>
			) : (
				<Spin spinning={designLoading}>
					<DesignSelection projectData={projectData} onSelectDesign={onSelectDesign} />
				</Spin>
			)}
		</>
	);
};

export default ProjectTabView;
