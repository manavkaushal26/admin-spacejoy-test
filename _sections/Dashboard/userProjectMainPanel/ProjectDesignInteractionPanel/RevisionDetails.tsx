import {
	DisplayDIYStatus,
	HumanizeDARStatus,
	HumanizeDIYStatus,
	HumanizeMode,
	RevisionForm,
} from "@customTypes/dashboardTypes";
import { Button, Col, Row, Typography } from "antd";
import React, { useMemo } from "react";

const { Text, Title } = Typography;

interface RevisionDetails {
	revisionData: RevisionForm;
	toggleEditRevision: () => void;
}

const RevisionDetails: React.FC<RevisionDetails> = ({ revisionData, toggleEditRevision }) => {
	const revisionType = useMemo(() => {
		if (revisionData.diy.isActive) {
			return "D.I.Y";
		}
		if (revisionData.dar.isActive) {
			return "D.A.R";
		}
		return "Not selected";
	}, [revisionData.diy.isActive, revisionData.dar.isActive]);

	const revisionStatus = useMemo(() => {
		if (revisionData.diy.isActive) {
			return HumanizeDIYStatus[DisplayDIYStatus[revisionData.diy.status]];
		}
		if (revisionData.dar.isActive) {
			return HumanizeDARStatus[revisionData.dar.status];
		}
		return "Unknown State";
	}, [revisionData]);

	return (
		<Col span={24}>
			<Row justify='space-between' gutter={[8, 8]}>
				<Col>
					<Row justify='space-around' gutter={[24, 8]}>
						<Col>
							<Row>
								<Col span={24}>
									<Text type='secondary'>Revision Design</Text>
								</Col>
								<Col span={24}>
									<Title level={4}>
										<small>{revisionData?.revisedDesign?.name}</small>
									</Title>
								</Col>
							</Row>
						</Col>
						<Col>
							<Row>
								<Col span={24}>
									<Text type='secondary'>Revision Version</Text>
								</Col>
								<Col span={24}>
									<Title level={4}>
										<small>{revisionData.revisionVersion}</small>
									</Title>
								</Col>
							</Row>
						</Col>
						<Col>
							<Row>
								<Col span={24}>
									<Text type='secondary'>Revision Type</Text>
								</Col>
								<Col span={24}>
									<Title level={4}>
										<small>{revisionType}</small>
									</Title>
								</Col>
							</Row>
						</Col>
						<Col>
							<Row>
								<Col span={24}>
									<Text type='secondary'>Revision Request Status</Text>
								</Col>
								<Col span={24}>
									<Title level={4}>
										<small>{revisionStatus}</small>
									</Title>
								</Col>
							</Row>
						</Col>
					</Row>
				</Col>
				<Col>
					<Row gutter={[16, 16]} align='middle'>
						{false && (
							<Col>
								<Row>
									<Col span={24}>
										<Text type='secondary'>Mode</Text>
									</Col>
									<Col span={24}>
										<Title level={4}>
											<small>{HumanizeMode[revisionData.mode]}</small>
										</Title>
									</Col>
								</Row>
							</Col>
						)}
						<Col>
							<Button onClick={toggleEditRevision} block danger type='primary'>
								Edit Revision
							</Button>
						</Col>
					</Row>
				</Col>
			</Row>
		</Col>
	);
};

export default RevisionDetails;
