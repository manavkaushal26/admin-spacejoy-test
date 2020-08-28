import Image from "@components/Image";
import { Col, Row, Typography } from "antd";
import React from "react";
import { StepDiv } from "../styled";

const { Text } = Typography;

const Design3D: React.FC = () => {
	return (
		<StepDiv>
			<Row gutter={[8, 8]}>
				<Col span={12}>
					<Row gutter={[4, 4]}>
						<Col>
							<Text strong>Description</Text>
						</Col>
						<Col>
							<Text>
								Please download the 3D Design app from the respective app store based on the system you are using. Mark
								this step as complete once the <b>design is completed</b> in the 3D App.
							</Text>
						</Col>
					</Row>
				</Col>
				<Col span={12}>
					<Row justify='space-around' gutter={[16, 16]}>
						<Col>
							<a
								target='_blank'
								rel='noopener noreferrer'
								href='https://apps.apple.com/us/app/spacejoy/id1489951014?ls=1&mt=12'
							>
								<Image src='fl_lossy,q_auto,/v1579933196/shared/app-store_v5bgni.svg' alt='macStore' width='284px' />
							</a>
						</Col>
						<Col>
							<a
								target='_blank'
								rel='noopener noreferrer'
								href='//www.microsoft.com/store/apps/9n954dnxj4zx?cid=storebadge&ocid=badge'
							>
								<Image
									src='fl_lossy,q_auto,/v1579933196/shared/ms-store_ufzpuj.svg'
									alt='Microsoft Store'
									width='284px'
								/>
							</a>
						</Col>
					</Row>
				</Col>
			</Row>
		</StepDiv>
	);
};

export default Design3D;
