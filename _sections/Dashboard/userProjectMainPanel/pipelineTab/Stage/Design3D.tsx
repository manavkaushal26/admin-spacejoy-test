import { Typography, Row, Col } from "antd";
import Image from "@components/Image";
import React from "react";
import { StepDiv } from "../styled";

const { Text } = Typography;

const Design3D: React.FC = () => {
	return (
		<StepDiv>
			<Row style={{ paddingTop: "1rem" }} gutter={[0, 24]}>
				<Col>
					<Row gutter={[12, 0]}>
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
				<Col>
					<Row type="flex" justify="space-around" gutter={[16, 16]}>
						<Col>
							<a
								target="_blank"
								rel="noopener noreferrer"
								href="https://apps.apple.com/us/app/spacejoy/id1489951014?ls=1&mt=12"
							>
								<Image
									src={
										process.env.NODE_ENV === "production"
											? "q_80,w_284/v1579933196/shared/app-store_v5bgni.svg"
											: "q_80,w_284/v1571050296/shared/app-store_dvz21i.png"
									}
									alt="macStore"
									width="284px"
								/>
							</a>
						</Col>
						<Col>
							<a
								target="_blank"
								rel="noopener noreferrer"
								href={
									process.env.NODE_ENV === "production"
										? "v1579933196/shared/ms-store_ufzpuj.svg"
										: "//www.microsoft.com/store/apps/9n954dnxj4zx?cid=storebadge&ocid=badge"
								}
							>
								<Image src="q_80,w_284/v1571050296/shared/windows_m7lpx7.png" alt="Microsoft Store" width="284px" />
							</a>
						</Col>
					</Row>
				</Col>
			</Row>
		</StepDiv>
	);
};

export default Design3D;
