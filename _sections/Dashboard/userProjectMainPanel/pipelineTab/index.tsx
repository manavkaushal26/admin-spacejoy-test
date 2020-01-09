import { updateDesignPhase } from "@api/pipelineApi";
import { DesignPhases, DetailedDesign, PhaseType } from "@customTypes/dashboardTypes";
import { Status } from "@customTypes/userType";
import { CustomDiv, ShadowDiv, StatusButton, StepsContainer } from "@sections/Dashboard/styled";
import { getValueSafely } from "@utils/commonUtils";
import fetcher from "@utils/fetcher";
import { Avatar, Button, message, Popconfirm, Typography } from "antd";
import React, { useEffect, useState } from "react";
import Stage from "./Stage";

const { Title, Text } = Typography;

interface PipelineTab {
	designData: DetailedDesign;
	setDesignData: React.Dispatch<React.SetStateAction<DetailedDesign>>;
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
		phaseName: DesignPhases.Concept,
		nextPhase: DesignPhases.Modelling,
	},
	{
		stepNumber: 2,
		stepName: "3D Room Upload (3D Team)",
		prevPhase: DesignPhases.Concept,
		phaseName: DesignPhases.Modelling,
		nextPhase: DesignPhases.Design3D,
	},
	{
		stepNumber: 3,
		stepName: "Design in 3D App (Design Team)",
		prevPhase: DesignPhases.Modelling,
		phaseName: DesignPhases.Design3D,
		nextPhase: DesignPhases.Render,
	},
	{
		stepNumber: 4,
		stepName: "Upload Rendered Room Images (3D Team)",
		prevPhase: DesignPhases.Design3D,
		phaseName: DesignPhases.Render,
		nextPhase: DesignPhases.Revision,
	},
	{
		stepNumber: 5,
		stepName: "Design Finalization (Design Team)",
		prevPhase: DesignPhases.Render,
		phaseName: DesignPhases.Revision,
		nextPhase: null,
	},
];

export default function PipelineTab({ designData, setDesignData }: PipelineTab): JSX.Element {
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
		[DesignPhases.Concept]: getValueSafely(() => phaseData.concept.status, Status.pending),
		[DesignPhases.Modelling]: getValueSafely(() => phaseData.modelling.status, Status.pending),
		[DesignPhases.Design3D]: getValueSafely(() => phaseData.design3D.status, Status.pending),
		[DesignPhases.Render]: getValueSafely(() => phaseData.render.status, Status.pending),
		[DesignPhases.Revision]: getValueSafely(() => phaseData.revision.status, Status.pending),
		[DesignPhases.Ready]: getValueSafely(() => phaseData.ready.status, Status.pending),
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
			setPhaseData(response.data);
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
								<CustomDiv inline px="1.5rem" py="1.5rem">
									<CustomDiv inline pr="0.5rem">
										<Avatar>{step.stepNumber}</Avatar>
									</CustomDiv>
									<Text strong>{step.stepName}</Text>
								</CustomDiv>
								<CustomDiv
									flexBasis="25ch"
									type="flex"
									flexDirection="row"
									flexGrow={1}
									justifyContent="flex-end"
									inline
									px="1.5rem"
									py="1.5rem"
								>
									<CustomDiv flexBasis="25ch">
										<StatusButton
											block
											loading={updationPhase === step.phaseName}
											status={phaseStatus[step.phaseName]}
											type="primary"
											onClick={(e): Promise<void> => updateDesignState(step.phaseName, phaseStatus[step.phaseName], e)}
											disabled={
												phaseStatus[step.phaseName] === Status.completed ||
												(step.prevPhase ? phaseStatus[step.prevPhase] !== Status.completed : false)
											}
											icon={phaseStatus[step.phaseName] === Status.completed ? "check" : null}
										>
											{getButtonText(phaseStatus[step.phaseName])}
										</StatusButton>
									</CustomDiv>
									<CustomDiv pl="1rem">
										<Popconfirm
											title="Are you sure you want to send back to previous team?"
											okText="Yes"
											disabled={step.phaseName === DesignPhases.Concept}
											onConfirm={(e): Promise<void> => updateDesignState(step.prevPhase, "reset", e)}
										>
											<Button
												loading={updationPhase === step.phaseName}
												type="danger"
												disabled={
													phaseStatus[step.phaseName] === Status.pending || step.phaseName === DesignPhases.Concept
												}
												icon="rollback"
											>
												Send back
											</Button>
										</Popconfirm>
									</CustomDiv>
								</CustomDiv>
							</ShadowDiv>
							{stage === step.phaseName && (
								<Stage phaseData={phaseData} designData={designData} setDesignData={setDesignData} stage={stage} />
							)}
						</div>
					);
				})}
			</StepsContainer>
		</div>
	);
}
