import React from "react";
import { QuizUserResponse, QuizContext, QuizAnswerFieldType } from "@customTypes/dashboardTypes";
import Image from "@components/Image";
import { Icon, Typography } from "antd";

const { Text } = Typography;

interface QuizResponse {
	response: QuizUserResponse;
	context: QuizContext;
}

const QuizResponse: React.FC<QuizResponse> = ({ context, response }) => {
	switch (context.fieldType) {
		case QuizAnswerFieldType.Stepper:
			if (!response.select) {
				return <Text>No Answer Provided</Text>;
			}
			return <Text>{response.value}</Text>;
		case QuizAnswerFieldType.Select:
			if (response.select) {
				return <Icon type="check-square" theme="twoTone" twoToneColor="#52c41a" />;
			}
			return <Icon type="close-square" theme="twoTone" twoToneColor="#f5222d" />;
		case QuizAnswerFieldType.Text:
			if (response.text) {
				return <Text>{response.text}</Text>;
			}
			return <Text>No Answer Provided</Text>;
		case QuizAnswerFieldType.Image:
		case QuizAnswerFieldType.File: {
			if (response.files.length !== 0) {
				return (
					<>
						{response.files.map(file => {
							const isImage =
								file.endsWith("jpg") || file.endsWith("jpeg") || file.endsWith("png") || file.endsWith("gif");
							return (
								<a key={file} href={file} rel="noopener noreferrer" target="_blank">
									{isImage ? <Image src={file} width="150px" /> : file}
								</a>
							);
						})}
					</>
				);
			}
			return (
				<>
					<Text>No Files Uploaded</Text>
				</>
			);
		}
		default:
			return <Text>Clueless</Text>;
	}
};

export default QuizResponse;
