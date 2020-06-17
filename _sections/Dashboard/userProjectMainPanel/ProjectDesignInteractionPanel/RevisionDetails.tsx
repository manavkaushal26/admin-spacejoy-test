import React, { useMemo } from "react";
import { Col, Row, Typography } from "antd";
import { DisplayDIYStatus, DisplayDARStatus, HumanizeMode, RevisionForm } from "@customTypes/dashboardTypes";

const { Text, Title } = Typography;

interface RevisionDetails {
	revisionData: RevisionForm;
}

const RevisionDetails: React.FC<RevisionDetails> = ({ revisionData }) => {
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
			return DisplayDIYStatus[revisionData.diy.status];
		}
		if (revisionData.dar.isActive) {
			return DisplayDARStatus[revisionData.dar.status];
		}
		return "Unknown State";
	}, [revisionData]);
	return (
		<Col span={24}>
			<Row type="flex" justify="space-between" gutter={[8, 8]}>
				<Col>
					<Row>
						<Col>
							<Text type="secondary">Revision Design</Text>
						</Col>
						<Col>
							<Title level={4}>{revisionData?.revisedDesign?.name}</Title>
						</Col>
					</Row>
				</Col>
				<Col>
					<Row type="flex" gutter={[16, 16]}>
						<Col>
							<Row>
								<Col>
									<Text type="secondary">Revision Version</Text>
								</Col>
								<Col>
									<Title level={4}>{revisionData.revisionVersion}</Title>
								</Col>
							</Row>
						</Col>
						<Col>
							<Row>
								<Col>
									<Text type="secondary">Revision Type</Text>
								</Col>
								<Col>
									<Title level={4}>{revisionType}</Title>
								</Col>
							</Row>
						</Col>
						<Col>
							<Row>
								<Col>
									<Text type="secondary">Revision Status</Text>
								</Col>
								<Col>
									<Title level={4}>{revisionStatus}</Title>
								</Col>
							</Row>
						</Col>
						<Col>
							<Row>
								<Col>
									<Text type="secondary">Mode</Text>
								</Col>
								<Col>
									<Title level={4}>
										<small>{HumanizeMode[revisionData.mode]}</small>
									</Title>
								</Col>
							</Row>
						</Col>
					</Row>
				</Col>
			</Row>
		</Col>
	);
};

export default RevisionDetails;
