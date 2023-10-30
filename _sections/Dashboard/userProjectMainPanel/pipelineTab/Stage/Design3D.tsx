import { editDesignApi } from "@api/designApi";
import Image from "@components/Image";
import { DetailedDesign } from "@customTypes/dashboardTypes";
import fetcher from "@utils/fetcher";
import { Button, Col, Input, notification, Row, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { StepDiv } from "../styled";

const { Text } = Typography;

interface Design3DStage {
	designData: DetailedDesign;
	setDesignData: React.Dispatch<React.SetStateAction<DetailedDesign>>;
}

const Design3D: React.FC<Design3DStage> = ({ designData, setDesignData }) => {
	const [designerNote, setDesignerNote] = useState<string>(null);

	useEffect(() => {
		if (designData) {
			setDesignerNote(designData.description);
		}
	}, [designData.description]);

	const handleTextChange = (e): void => {
		const {
			target: { value },
		} = e;
		setDesignerNote(value);
	};

	const saveDesignerNote = async (): Promise<void> => {
		const endpoint = editDesignApi(designData._id);

		const response = await fetcher({
			endPoint: endpoint,
			method: "PUT",
			body: {
				data: {
					description: designerNote,
				},
			},
		});

		if (response.statusCode <= 300) {
			setDesignData(response.data);
			notification.success({ message: "Description Added successfully" });
		} else {
			notification.error({ message: response.message });
		}
	};

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
								<Image src='/v1579933196/shared/app-store_v5bgni.svg' alt='macStore' width='284px' staticUrl />
							</a>
						</Col>
						<Col>
							<a
								target='_blank'
								rel='noopener noreferrer'
								href='//www.microsoft.com/store/apps/9n954dnxj4zx?cid=storebadge&ocid=badge'
							>
								<Image src='/v1579933196/shared/ms-store_ufzpuj.svg' alt='Microsoft Store' width='284px' staticUrl />
							</a>
						</Col>
					</Row>
				</Col>
				<Col span={24}>
					<Row gutter={[8, 8]}>
						<Col span={24}>
							<Text strong>Design Note</Text>
							<Text> (Please note this will be displayed to customer)</Text>
						</Col>
						<Col span={24}>
							<Input.TextArea
								placeholder='Please enter a design note'
								value={designerNote}
								autoSize={{ minRows: 2 }}
								onChange={handleTextChange}
							/>
						</Col>
						<Col span={24}>
							<Row justify='end'>
								<Button type='primary' onClick={saveDesignerNote}>
									Add Description
								</Button>
							</Row>
						</Col>
					</Row>
				</Col>
			</Row>
		</StepDiv>
	);
};

export default Design3D;
