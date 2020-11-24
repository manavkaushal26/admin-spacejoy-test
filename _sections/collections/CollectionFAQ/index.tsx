//TODO: Make it drawer in the collection page

import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { getCollectionFaqApi } from "@api/metaApi";
import { CollectionFAQType } from "@customTypes/collectionTypes";
import fetcher from "@utils/fetcher";
import { Card, Col, List, notification, Row, Typography } from "antd";
import React, { useEffect, useState } from "react";
import AddNewFAQ from "./AddNewFAQ";

const { Text } = Typography;

interface CollectionFAQComponentType {
	id: string;
}

const CollectionFAQ: React.FC<CollectionFAQComponentType> = ({ id }) => {
	const [collectionFAQList, setCollectionFAQList] = useState<CollectionFAQType[]>([]);
	const [editingFAQ, setEditingFAQ] = useState<string>("");

	const fetchCollectionFAQ = async () => {
		const endPoint = getCollectionFaqApi(id, "designCollections");
		try {
			const response = await fetcher({ endPoint, method: "GET" });
			if (response.statusCode <= 300) {
				setCollectionFAQList(
					response.data.data
						.map(faq => {
							return {
								_id: faq.faq._id,
								question: faq.faq.question,
								category: faq.faq.category,
								answer: faq.faq.answer,
								sequence: faq.faq.sequence,
								createdAt: faq.createdAt,
								updatedAt: faq.updatedAt,
							};
						})
						.sort((faqA, faqB) => {
							return faqA.sequence - faqB.sequence;
						})
				);
			} else {
				throw new Error(response?.data?.message);
			}
		} catch (e) {
			notification.error({ message: e.message });
		}
	};

	useEffect(() => {
		if (id) {
			fetchCollectionFAQ();
		}
	}, [id]);

	const updateList = (data: Partial<CollectionFAQType>, type: "update" | "add" | "delete") => {
		if (type === "add") {
			setCollectionFAQList(
				[...collectionFAQList, data as CollectionFAQType].sort((faqA, faqB) => {
					return faqA.sequence - faqB.sequence;
				})
			);
		} else if (type === "update") {
			setCollectionFAQList(
				collectionFAQList
					.map(faq => {
						if (faq._id === data._id) {
							return data as CollectionFAQType;
						}
						return faq;
					})
					.sort((faqA, faqB) => {
						return faqA.sequence - faqB.sequence;
					})
			);
			setEditingFAQ("");
		} else if (type === "delete") {
			setCollectionFAQList(
				collectionFAQList.filter(faq => {
					return faq._id !== data._id;
				})
			);
		}
	};

	const onAdd = async (data: Partial<CollectionFAQType>, type: "add") => {
		const endPoint = getCollectionFaqApi(data?._id, "designCollections");
		const body = {
			documentId: id,
			category: "designCollections",
			...data,
		};
		try {
			const response = await fetcher({ endPoint, method: type === "add" ? "POST" : "PUT", body });

			if (response.statusCode <= 300) {
				updateList(response.data, type);
			} else {
				throw new Error(response?.data?.message);
			}
		} catch (e) {
			notification.error({ message: e.message });
		}
	};

	const onEdit = _id => {
		setEditingFAQ(_id);
	};

	const onModify = async (faq: Partial<CollectionFAQType>, type: "update" | "delete") => {
		const endPoint = `${getCollectionFaqApi()}/${faq._id}`;
		const body = {
			documentId: id,
			category: "designCollections",
			...faq,
		};
		try {
			const response = await fetcher({
				endPoint,
				...(type === "update" ? { method: "PUT", body } : { method: "DELETE" }),
			});

			if (response.statusCode <= 300) {
				updateList({ ...faq }, type);
			} else {
				throw new Error(response?.data?.message);
			}
		} catch (e) {
			notification.error({ message: e.message });
		}
	};

	return (
		<Row gutter={[4, 4]}>
			<Col span={24}>
				<List
					itemLayout='vertical'
					grid={{ column: 1, gutter: 4 }}
					rowKey='_id'
					dataSource={collectionFAQList}
					renderItem={faq => {
						return (
							<List.Item key={faq._id}>
								{editingFAQ !== faq._id ? (
									<Card
										size='small'
										actions={
											editingFAQ !== faq._id
												? [
														<EditOutlined key='edit' onClick={() => onEdit(faq._id)} />,
														<DeleteOutlined key='delete' onClick={() => onModify(faq, "delete")} />,
												  ]
												: []
										}
									>
										<Card.Meta title={`${faq.sequence}. ${faq.question}`} description={`A: ${faq.answer}`} />
									</Card>
								) : (
									<AddNewFAQ onSave={onModify} item={faq} onCancel={() => setEditingFAQ("")} />
								)}
							</List.Item>
						);
					}}
				/>
			</Col>
			{!editingFAQ && (
				<Col span={24}>
					<AddNewFAQ onSave={onAdd} />
				</Col>
			)}
		</Row>
	);
};

export default CollectionFAQ;
