import { completedPhases, PhaseInternalNames } from "@customTypes/dashboardTypes";
import { Col, Progress, Row, Typography } from "antd";
import React from "react";

const { Text } = Typography;

interface ProgressBarProps {
	phase: PhaseInternalNames;
	days: number;
	size: number;
}

const getTextColor = days => {
	if (days < 3) {
		return { color: "red" };
	}
	if (days < 6) {
		return { color: "orange" };
	}

	return {};
};

const ProgressBar: React.FC<ProgressBarProps> = ({ phase, size = 14, days }): JSX.Element => {
	const smallSize = size * 0.8;
	if (completedPhases.includes(phase)) {
		return (
			<Col span={24}>
				<Row justify='center'>
					<Progress percent={100} type='circle' width={30} />
				</Row>
			</Col>
		);
	}
	return (
		<Row justify='center' gutter={[0, 0]} style={getTextColor(days)}>
			<Col span={24}>
				<Row justify='center'>
					<Text strong style={{ ...getTextColor(days), fontSize: `${size}px` }}>
						{Math.abs(days)}
					</Text>
				</Row>
			</Col>
			<Col span={24}>
				<Row justify='center'>
					<Text style={{ ...getTextColor(days), fontSize: `${smallSize}px` }}>
						<small>
							<small>
								{Math.abs(days) === 1 ? "day" : "days"} {days < 0 ? "late" : "left"}
							</small>
						</small>
					</Text>
				</Row>
			</Col>
		</Row>
	);
};

export default ProgressBar;
