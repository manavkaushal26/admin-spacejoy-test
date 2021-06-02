import { getProjectTimelineApi } from "@api/projectApi";
import { HumanizePhaseInternalNames, Phase } from "@customTypes/dashboardTypes";
import DetailText from "@sections/RenderEngine/DetailText";
import fetcher from "@utils/fetcher";
import { Col, Row, Spin, Timeline } from "antd";
import moment from "moment-timezone";
import React, { useEffect, useState } from "react";
import Card from "./Card";
const PhaseTimeline: React.FC<{ completedPhases: Phase[]; currentPhase?: Phase; projectId: string }> = ({
	projectId,
}) => {
	const [timeline, setTimeline] = useState([]);
	const [loading, setLoading] = useState(false);

	const getTimeline = async () => {
		setLoading(true);
		const endPoint = getProjectTimelineApi(projectId);
		const response = await fetcher({ endPoint, method: "GET" });
		if (response.statusCode <= 300) {
			setTimeline(response.data.timeline);
		}
		setLoading(false);
	};

	useEffect(() => {
		getTimeline();
	}, []);

	return (
		<Spin spinning={loading} style={{ width: "100%" }}>
			<Card>
				<Timeline mode='left'>
					{timeline.map(phase => {
						return phase.type === "phase" ? (
							<Timeline.Item color='green' position='right' key={phase._id}>
								<DetailText name='Phase' value={HumanizePhaseInternalNames[phase.name?.internalName]} />
								<DetailText name='On' value={moment(phase.startTime).format("MM-DD-YYYY")} />
							</Timeline.Item>
						) : (
							<Timeline.Item>
								<DetailText name='Phase' value='Pause' />
								<DetailText name='On' value={moment(phase.pausedAt).format("MM-DD-YYYY")} />
								<DetailText
									name='By'
									value={
										<Row>
											<Col>{phase.pausedBy?.profile?.name}</Col>
											<Col>{phase.pausedBy?.email}</Col>
										</Row>
									}
								/>
								<DetailText name='Comments' value={phase.comments.join(", ")} />
								<DetailText
									name='Resumed on'
									value={phase.resumedAt ? moment(phase.resumedAt).format("MM-DD-YYYY") : "Not yet resumed"}
								/>
								<DetailText
									name='Resumed by'
									value={
										phase.resumedAt ? (
											<Row>
												<Col>{phase.resumedBy?.profile?.name}</Col>
												<Col>{phase.resumedBy?.email}</Col>
											</Row>
										) : (
											"Not yet resumed"
										)
									}
								/>
							</Timeline.Item>
						);
					})}
				</Timeline>
			</Card>
		</Spin>
	);
};

export default PhaseTimeline;
