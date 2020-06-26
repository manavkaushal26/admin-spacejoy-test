import { updateDesignPhase } from "@api/pipelineApi";
import {
	DesignPhases,
	DetailedDesign,
	PhaseCustomerNames,
	PhaseInternalNames,
	PhaseType,
} from "@customTypes/dashboardTypes";
import { Status } from "@customTypes/userType";
import { ShadowDiv, StatusButton, StepsContainer } from "@sections/Dashboard/styled";
import { getValueSafely } from "@utils/commonUtils";
import fetcher from "@utils/fetcher";
import { Avatar, Button, Col, message, Popconfirm, Row, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { RollbackOutlined, CheckOutlined } from "@ant-design/icons";
import Stage from "./Stage";

const { Title, Text } = Typography;

interface PipelineTab {
	designData: DetailedDesign;
	setDesignData: React.Dispatch<React.SetStateAction<DetailedDesign>>;
	projectId: string;
	setProjectPhase: (phase: { internalName: PhaseInternalNames; customerName: PhaseCustomerNames }) => void;
}

const getButtonText = (status: Status): string => {
	if (status === Status.pending) {
		return "Start";
	}
	if (status === Status.completed) {
		return "Completed";
	}
	if (status === Status.active) {
		return "Mark as Complete";
	}
	return "Contact Shubam";
};

interface Steps {
	stepNumber: number;
	stepName: string;
	prevPhase: DesignPhases;
	phaseName: DesignPhases;
	nextPhase: DesignPhases;
}

const steps: Steps[] = [
	{
		stepNumber: 1,
		stepName: "Moodboard and Floorplan (Design Team)",
		prevPhase: null,
		phaseName: DesignPhases.concept,
		nextPhase: DesignPhases.modelling,
	},
	{
		stepNumber: 2,
		stepName: "3D Asset and Room Upload (3D Team)",
		prevPhase: DesignPhases.concept,
		phaseName: DesignPhases.modelling,
		nextPhase: DesignPhases.design3D,
	},
	{
		stepNumber: 3,
		stepName: "Design in 3D App (Design Team)",
		prevPhase: DesignPhases.modelling,
		phaseName: DesignPhases.design3D,
		nextPhase: DesignPhases.render,
	},
	{
		stepNumber: 4,
		stepName: "Upload Rendered Room Images (3D Team)",
		prevPhase: DesignPhases.design3D,
		phaseName: DesignPhases.render,
		nextPhase: DesignPhases.revision,
	},
	{
		stepNumber: 5,
		stepName: "Design Finalization (Design Team)",
		prevPhase: DesignPhases.render,
		phaseName: DesignPhases.revision,
		nextPhase: null,
	},
];

export default function PipelineTab({
	designData,
	setDesignData,
	setProjectPhase,
	projectId,
}: PipelineTab): JSX.Element {
	const [stage, setStage] = useState<string>(null);
	const [updationPhase, setUpdationPhase] = useState<string>(null);
	const [phaseData, setPhaseData] = useState<PhaseType>(null);
	const onClick = (step): void => {
		if (stage === step) {
			setStage(null);
		} else setStage(step);
	};

	useEffect(() => {
		if (designData) {
			setPhaseData(designData.phases);
		}
	}, [designData.phases]);

	const phaseStatus = {
		[DesignPhases.concept]: getValueSafely(() => phaseData.concept.status, Status.pending),
		[DesignPhases.modelling]: getValueSafely(() => phaseData.modelling.status, Status.pending),
		[DesignPhases.design3D]: getValueSafely(() => phaseData.design3D.status, Status.pending),
		[DesignPhases.render]: getValueSafely(() => phaseData.render.status, Status.pending),
		[DesignPhases.revision]: getValueSafely(() => phaseData.revision.status, Status.pending),
		[DesignPhases.ready]: getValueSafely(() => phaseData.ready.status, Status.pending),
	};

	const updateDesignState = async (currentStage, status: Status | "reset", e): Promise<void> => {
		e.stopPropagation();
		setUpdationPhase(currentStage);
		const endpoint = updateDesignPhase(designData._id);
		let updatedStatus: Status;
		if (status === Status.pending) {
			updatedStatus = Status.active;
		} else if (status === Status.active) {
			updatedStatus = Status.completed;
		} else if (status === "reset") {
			updatedStatus = Status.active;
		}
		const response = await fetcher({
			endPoint: endpoint,
			method: "PUT",
			body: {
				data: {
					phase: currentStage,
					status: updatedStatus,
				},
			},
		});
		if (response.statusCode <= 300) {
			setPhaseData(response.data.designPhase);
			setProjectPhase(response.data.projectPhase);
			setDesignData({
				...designData,
				phases: { ...response.data.designPhase },
			});
		} else {
			message.error(response.message);
		}
		setUpdationPhase(null);
	};

	return (
		<div>
			<Title level={2}>Task Overview</Title>
			<StepsContainer>
				{steps.map(step => {
					return (
						<div key={step.phaseName}>
							<ShadowDiv active={step.phaseName === stage} onClick={(): void => onClick(step.phaseName)}>
								<Row style={{ padding: "1rem 1rem" }} justify='space-between' gutter={[16, 16]}>
									<Col>
										<Row align='middle' gutter={[8, 0]}>
											<Col>
												<Avatar>{step.stepNumber}</Avatar>
											</Col>
											<Col>
												<Text strong>{step.stepName}</Text>
											</Col>
										</Row>
									</Col>
									<Col>
										<Row gutter={[8, 0]}>
											<Col>
												<StatusButton
													block
													loading={updationPhase === step.phaseName}
													status={phaseStatus[step.phaseName]}
													type='primary'
													onClick={(e): Promise<void> =>
														updateDesignState(step.phaseName, phaseStatus[step.phaseName], e)
													}
													disabled={
														phaseStatus[step.phaseName] === Status.completed ||
														(step.prevPhase ? phaseStatus[step.prevPhase] !== Status.completed : false)
													}
													icon={phaseStatus[step.phaseName] === Status.completed ? <CheckOutlined /> : null}
												>
													{getButtonText(phaseStatus[step.phaseName])}
												</StatusButton>
											</Col>
											<Col>
												<Popconfirm
													title='Are you sure you want to send back to previous team?'
													okText='Yes'
													disabled={step.phaseName === DesignPhases.concept}
													onConfirm={(e): Promise<void> => updateDesignState(step.prevPhase, "reset", e)}
												>
													<Button
														loading={updationPhase === step.phaseName}
														danger
														type='primary'
														disabled={
															phaseStatus[step.phaseName] === Status.pending || step.phaseName === DesignPhases.concept
														}
														icon={<RollbackOutlined />}
													>
														Send back
													</Button>
												</Popconfirm>
											</Col>
										</Row>
									</Col>
								</Row>
							</ShadowDiv>
							{stage === step.phaseName && (
								<Stage
									projectId={projectId}
									phaseData={phaseData}
									designData={designData}
									setDesignData={setDesignData}
									stage={stage}
								/>
							)}
						</div>
					);
				})}
			</StepsContainer>
		</div>
	);
}
