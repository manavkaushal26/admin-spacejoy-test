import { CheckSquareTwoTone, CloseSquareFilled } from "@ant-design/icons";
import Image from "@components/Image";
import { QuizAnswerFieldType, QuizContext, QuizUserResponse } from "@customTypes/dashboardTypes";
import { getValueSafely, stringToUrl } from "@utils/commonUtils";
import { cloudinary } from "@utils/config";
import { Col, Row, Typography } from "antd";
import parse from "html-react-parser";
import React from "react";

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
				return (
					<Col span={24}>
						<Text>No Answer Provided</Text>
					</Col>
				);
			}
			return (
				<Col span={24}>
					<Text>{value}</Text>
				</Col>
			);
		case QuizAnswerFieldType.Select:
			if (select) {
				return (
					<Col>
						<CheckSquareTwoTone twoToneColor='#52c41a' />
					</Col>
				);
			}
			return (
				<Col>
					<CloseSquareFilled twoToneColor='#f5222d' />
				</Col>
			);
		case QuizAnswerFieldType.Text:
			if (text) {
				return (
					<Col span={24}>
						<Text>{parse(stringToUrl(text))}</Text>
					</Col>
				);
			}
			return <Text>No Answer Provided</Text>;
		case QuizAnswerFieldType.Value:
			return (
				<Col span={24}>
					<Text>{value}</Text>
				</Col>
			);
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
								<Col {...(isImage ? { sm: 12, md: 8, lg: 6 } : {})} key={file._id}>
									<Row justify='center' gutter={[4, 4]}>
										<Col>
											<a
												{...(!isImage
													? {
															href: `${cloudinary.baseDeliveryURL}/image/upload/${file.cdn}`,
															rel: "noopener noreferrer",
															target: "_blank",
													  }
													: {})}
											>
												{isImage ? <Image preview src={`w_auto/${file.cdn}`} width='150px' /> : file.cdn}
											</a>
										</Col>
										<Col span={24}>
											<Text style={{ width: "100%" }} ellipsis copyable>
												{`${cloudinary.baseDeliveryURL}/image/upload/${file.cdn}`}
											</Text>
										</Col>
									</Row>
								</Col>
							);
						})}
					</>
				);
			}
			return (
				<Col>
					<Text>No Files Uploaded</Text>
				</Col>
			);
		}
		default:
	}
};

export default QuizResponse;
