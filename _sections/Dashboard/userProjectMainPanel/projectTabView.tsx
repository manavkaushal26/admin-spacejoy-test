import React, { useEffect, useState } from "react";

import { Tabs, Card, Row, Col, Tag, Typography, Divider } from "antd";
import CustomerResponses from "./customerResponses";
import { DetailedProject, DetailedDesign } from "@customTypes/dashboardTypes";
import Image from "@components/Image";
import { CustomDiv, SilentDivider } from "../styled";
import DesignerTab from "./designerTab";
import { Role } from "@customTypes/userType";
import NotesTab from "./notesTab";
import { designApi } from "@api/designApi";
import fetcher from "@utils/fetcher";
import styled from "styled-components";
import MoodboardTab from "./moodboardTab";
const { TabPane } = Tabs;

const {Text} = Typography;

interface ProjectTabViewProps {
	projectData: DetailedProject;
	designId: string;
	onSelectDesign: (designId: string) => void;
	setLoading: React.Dispatch<React.SetStateAction<boolean>>
	refetchData: () => void;
}


const ProjectTabView: React.FC<ProjectTabViewProps> = ({ projectData, designId, onSelectDesign, setLoading, refetchData }): JSX.Element => {

	const { form: formData } = projectData;
	const [designData, setDesignData] = useState<DetailedDesign>(null);

	const fetchDesignData = async () => {
		console.log('here')
		setLoading(true);
		const endPoint = designApi(designId);
		const responseData = await fetcher({endPoint: endPoint, method: 'GET'});
		if(responseData.data) {
			setDesignData(responseData.data);
		}
		setLoading(false);
	} 

	const refetchDesignData = ():void => {
		fetchDesignData();
	}

	useEffect(() => {
		if(designId !== '') {
			console.log(designId);
			fetchDesignData();
			return;
		}
		setDesignData(null);
	},[designId]);

	return (
		<>
			{designData !== null ? (
				<Tabs defaultActiveKey="1">
					<TabPane tab="Customer Responses" key="1">
						<CustomerResponses formData={formData || []} />
					</TabPane>
					<TabPane tab="Your Notes" key="2">
						<NotesTab refetchDesignData={refetchDesignData} designData={designData}/>
					</TabPane>
					<TabPane tab="Moodboard" key="3">
						<MoodboardTab />
					</TabPane>
					<TabPane tab="Discussions" key="4">
						Content of Tab Pane 4
					</TabPane>
					<TabPane tab="Designers" key="5">
						<DesignerTab refetchData={refetchData} setLoading={setLoading} projectId={projectData._id} assignedDesigners={projectData.team.filter(member => member.role === Role.designer)}/>
					</TabPane>
				</Tabs>
			) : (
				projectData.designs.map(design => {
					return (<>
					<SilentDivider/>
						<CustomDiv overflow="visible" width="300px" mt="20px">
							<Card hoverable cover={<Image width="300px" onClick={()=> onSelectDesign(design.design._id)} src={design.design.designImages[0].cdn} />}>
								<Row type="flex" justify="space-between">
									<Col><Text>{design.design.name}</Text></Col>
									<Col>
										<Tag>Status: {design.design.status}</Tag>
									</Col>
								</Row>
							</Card>
						</CustomDiv></>
					);
				})
			)}
		</>
	);
};

export default ProjectTabView;
