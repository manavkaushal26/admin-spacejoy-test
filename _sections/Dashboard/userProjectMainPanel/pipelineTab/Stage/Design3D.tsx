import { StepDiv } from "../styled";
import { CustomDiv } from "@sections/Dashboard/styled";
import { Typography } from "antd";
import Image from "@components/Image";

const { Text } = Typography;

const Design3D: React.FC = () => {
	return (
		<StepDiv>
			<CustomDiv px="1rem" py="1rem">
				<CustomDiv pb="1rem">
					<CustomDiv>
						<Text strong>Description</Text>
					</CustomDiv>
					<CustomDiv>
						<Text>
							Please download the 3D Design app from the respective app store based on the system you are using. Mark
							this step as complete once the <b>design is completed</b> in the 3D App.
						</Text>
					</CustomDiv>
				</CustomDiv>
				<CustomDiv type="flex" justifyContent="space-evenly" width="100%">
					<CustomDiv inline>
						<a target="_blank" href="https://apps.apple.com/us/app/spacejoy/id1489951014?ls=1&mt=12">
							<Image src="q_80,w_284/v1571050296/shared/app-store_dvz21i.png" alt="macStore" width="284px" />
						</a>
					</CustomDiv>
					<CustomDiv inline>
						<a target="_blank" href="//www.microsoft.com/store/apps/9n954dnxj4zx?cid=storebadge&ocid=badge">
							<Image src="q_80,w_284/v1571050296/shared/windows_m7lpx7.png" alt="Microsoft Store" width="284px" />
						</a>
					</CustomDiv>
				</CustomDiv>
			</CustomDiv>
		</StepDiv>
	);
};

export default Design3D;
