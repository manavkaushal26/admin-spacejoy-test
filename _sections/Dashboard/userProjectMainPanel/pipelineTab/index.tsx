import { DetailedDesign, PhaseType } from "@customTypes/dashboardTypes";
import { CustomDiv, ShadowDiv, StepsContainer, StatusButton } from "@sections/Dashboard/styled";
import { Avatar, Typography, Button, message, Popconfirm, Icon } from "antd";
import React, { useState, useEffect } from "react";
import Stage from "./Stage";
import { Status } from "@customTypes/userType";
import { getValueSafely } from "@utils/commonUtils";
import { render } from "react-dom";
import { read } from "fs";
import styled, { css } from "styled-components";
import fetcher from "@utils/fetcher";
import { updateDesignPhase } from "@api/pipelineApi";

const { Title, Text } = Typography;

interface PipelineTab {
	designData: DetailedDesign;
	refetchDesignData: () => void;
}

const getButtonText = (status: Status) => {
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

export default function PipelineTab({ designData, refetchDesignData }: PipelineTab): JSX.Element {
	const [stage, setStage] = useState<string>(null);
	const [updationPhase, setUpdationPhase] = useState<string>(null);
	const [phaseData, setPhaseData] = useState<PhaseType>(null);
	const onClick = step => {
		if (stage === step) {
			setStage(null);
		} else setStage(step);
	};

	useEffect(() => {
		if (designData) {
			setPhaseData(designData.phases);
		}
	}, [designData.phases]);

	const conceptStatus = getValueSafely(() => phaseData.concept.status, Status.pending);
	const design3DStatus = getValueSafely(() => phaseData.design3D.status, Status.pending);
	const renderStatus = getValueSafely(() => phaseData.render.status, Status.pending);
	const revisionStatus = getValueSafely(() => phaseData.revision.status, Status.pending);
	const readyStatus = getValueSafely(() => phaseData.ready.status, Status.pending);

	const updateDesignState = async (stage, status: Status | "reset", e: MouseEvent) => {
		e.stopPropagation();
		setUpdationPhase(stage);
		const endpoint = updateDesignPhase(designData._id);
		let updatedStatus: Status;
		if (status === Status.pending) {
			updatedStatus = Status.active;
		} else if (status === Status.active) {
			updatedStatus = Status.completed;
		} else if (status === "reset") {
			updatedStatus = Status.pending;
			if (stage === "concept") {
				updatedStatus = Status.active;
			}
		}
		const data = await fetcher({
			endPoint: endpoint,
			method: "PUT",
			body: {
				data: {
					phase: stage,
					status: updatedStatus
				}
			}
		});
		if (data.status === "error") {
			message.error(data.message);
		} else {
			console.log("setting");
			setPhaseData(data.data);
		}
		setUpdationPhase(null);
	};

	return (
		<div>
			<Title level={2}>Task Overview</Title>
			<StepsContainer>
				<ShadowDiv onClick={onClick.bind(null, "concept")}>
					<CustomDiv inline px="1.5rem" py="1.5rem">
						<CustomDiv inline pr="0.5rem">
							<Avatar>1</Avatar>
						</CustomDiv>
						<Text strong>Upload Room and Assets</Text>
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
								loading={updationPhase === "concept"}
								status={conceptStatus}
								type="primary"
								onClick={updateDesignState.bind(null, "concept", conceptStatus)}
								disabled={conceptStatus === Status.completed}
							>
								{getButtonText(conceptStatus)}
							</StatusButton>
						</CustomDiv>
						<CustomDiv pl="1rem">
							<Popconfirm
								title="Are you sure you want to revert status to pending?"
								okText="Yes"
								onConfirm={updateDesignState.bind(null, "concept", "reset")}
							>
								<StatusButton
									loading={updationPhase === "concept"}
									status={conceptStatus}
									type="danger"
									disabled={conceptStatus === Status.pending}
								>
									<Icon type="undo" rotate={135} />
								</StatusButton>
							</Popconfirm>
						</CustomDiv>
					</CustomDiv>
				</ShadowDiv>
				{stage === "concept" && <Stage designData={designData} refetchDesignData={refetchDesignData} stage={stage} />}
				<ShadowDiv onClick={onClick.bind(null, "design3D")}>
					<CustomDiv inline px="1.5rem" py="1.5rem">
						<CustomDiv inline pr="0.5rem">
							<Avatar>2</Avatar>
						</CustomDiv>
						<Text strong>Design in 3D app</Text>
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
								loading={updationPhase === "design3D"}
								status={design3DStatus}
								type="primary"
								onClick={updateDesignState.bind(null, "design3D", design3DStatus)}
								disabled={design3DStatus === Status.completed || conceptStatus !== Status.completed}
							>
								{getButtonText(design3DStatus)}
							</StatusButton>
						</CustomDiv>
						<CustomDiv pl="1rem">
							<Popconfirm
								title="Are you sure you want to revert status to pending?"
								okText="Yes"
								onConfirm={updateDesignState.bind(null, "design3D", "reset")}
							>
								<StatusButton
									loading={updationPhase === "design3D"}
									status={design3DStatus}
									type="danger"
									disabled={design3DStatus == Status.pending}
								>
									<Icon type="undo" rotate={135} />
								</StatusButton>
							</Popconfirm>
						</CustomDiv>
					</CustomDiv>
				</ShadowDiv>
				{stage === "design3D" && <Stage designData={designData} refetchDesignData={refetchDesignData} stage={stage} />}
				<ShadowDiv onClick={onClick.bind(null, "render")}>
					<CustomDiv inline px="1.5rem" py="1.5rem">
						<CustomDiv inline pr="0.5rem">
							<Avatar>3</Avatar>
						</CustomDiv>
						<Text strong>Render Design</Text>
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
								loading={updationPhase === "render"}
								status={renderStatus}
								type="primary"
								onClick={updateDesignState.bind(null, "render", renderStatus)}
								disabled={renderStatus === Status.completed || design3DStatus !== Status.completed}
							>
								{getButtonText(renderStatus)}
							</StatusButton>
						</CustomDiv>
						<CustomDiv pl="1rem">
							<Popconfirm
								title="Are you sure you want to revert status to pending?"
								okText="Yes"
								onConfirm={updateDesignState.bind(null, "render", "reset")}
							>
								<StatusButton
									loading={updationPhase === "render"}
									status={renderStatus}
									type="danger"
									disabled={renderStatus == Status.pending}
								>
									<Icon type="undo" rotate={135} />
								</StatusButton>
							</Popconfirm>
						</CustomDiv>
					</CustomDiv>
				</ShadowDiv>
				{stage === "render" && <Stage designData={designData} refetchDesignData={refetchDesignData} stage={stage} />}
				<ShadowDiv onClick={onClick.bind(null, "revision")}>
					<CustomDiv inline px="1.5rem" py="1.5rem">
						<CustomDiv inline pr="0.5rem">
							<Avatar>4</Avatar>
						</CustomDiv>
						<Text strong>Design Revision</Text>
					</CustomDiv>
					<CustomDiv
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
								loading={updationPhase === "revision"}
								status={readyStatus}
								type="primary"
								onClick={updateDesignState.bind(null, "revision", revisionStatus)}
								disabled={readyStatus === Status.completed || renderStatus !== Status.completed}
							>
								{getButtonText(readyStatus)}
							</StatusButton>
						</CustomDiv>

						<CustomDiv pl="1rem">
							<Popconfirm
								title="Are you sure you want to revert status to pending?"
								okText="Yes"
								onConfirm={updateDesignState.bind(null, "revision", "reset")}
							>
								<StatusButton
									loading={updationPhase === "revision"}
									status={revisionStatus}
									type="danger"
									disabled={revisionStatus == Status.pending}
								>
									<Icon type="undo" rotate={135} />
								</StatusButton>
							</Popconfirm>
						</CustomDiv>
					</CustomDiv>
				</ShadowDiv>
				{stage === "revision" && <Stage designData={designData} refetchDesignData={refetchDesignData} stage={stage} />}
			</StepsContainer>
		</div>
	);
}
