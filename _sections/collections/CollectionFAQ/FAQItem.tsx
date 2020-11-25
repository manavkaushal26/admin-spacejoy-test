import { CollectionFAQType } from "@customTypes/collectionTypes";
import { Col, Row, Typography } from "antd";
import React from "react";

const { Text } = Typography;

interface FAQItem {
	item: CollectionFAQType;
}

const FAQItem: React.FC<FAQItem> = ({ item }) => {
	const { question = "", answer = "" } = item;

	return (
		<Row>
			<Col span={24}>
				<Text strong>
					{item?.sequence}. {question}
				</Text>
			</Col>
			<Col span={24}>
				<Text>A: {answer}</Text>
			</Col>
		</Row>
	);
};

export default FAQItem;
