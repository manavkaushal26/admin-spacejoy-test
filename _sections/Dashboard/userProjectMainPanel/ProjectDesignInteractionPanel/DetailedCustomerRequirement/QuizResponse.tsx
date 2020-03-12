import Image from "@components/Image";
import { QuizAnswerFieldType, QuizContext, QuizUserResponse } from "@customTypes/dashboardTypes";
import { cloudinary } from "@utils/config";
import { Icon, Typography } from "antd";
import React from "react";
import { getValueSafely } from "@utils/commonUtils";

const { Text } = Typography;

interface QuizResponse {
	response: QuizUserResponse;
	context: QuizContext;
}

const QuizResponse: React.FC<QuizResponse> = ({ context, response }) => {
	const { files, text, select, value } = getValueSafely(
		() => ({ value: response.value, files: response.files, text: response.text, select: response.select }),
		{
			files: [],
			text: "",
			select: false,
			value: 0,
		}
	);

	switch (context.fieldType) {
		case QuizAnswerFieldType.Stepper:
			if (!select) {
				return <Text>No Answer Provided</Text>;
			}
			return <Text>{value}</Text>;
		case QuizAnswerFieldType.Select:
			if (select) {
				return <Icon type="check-square" theme="twoTone" twoToneColor="#52c41a" />;
			}
			return <Icon type="close-square" theme="twoTone" twoToneColor="#f5222d" />;
		case QuizAnswerFieldType.Text:
			if (text) {
				return <Text>{text}</Text>;
			}
			return <Text>No Answer Provided</Text>;
		case QuizAnswerFieldType.Value:
			return <Text>{value}</Text>;
		case QuizAnswerFieldType.Image:
		case QuizAnswerFieldType.File: {
			if (files.length !== 0) {
				return (
					<>
						{files.map(file => {
							const isImage =
								file.cdn.endsWith("jpg") ||
								file.cdn.endsWith("jpeg") ||
								file.cdn.endsWith("png") ||
								file.cdn.endsWith("gif");
							return (
								<a
									key={file._id}
									href={`${cloudinary.baseDeliveryURL}/image/upload/${file.cdn}`}
									rel="noopener noreferrer"
									target="_blank"
								>
									{isImage ? <Image src={file.cdn} width="150px" /> : file.cdn}
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
			return <Text>Unknown Error</Text>;
	}
};

export default QuizResponse;
