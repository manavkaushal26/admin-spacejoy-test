import { CollectionFAQType } from "@customTypes/collectionTypes";
import { Button, Card, Col, Form, Input, InputNumber, Row } from "antd";
import { useForm } from "antd/lib/form/Form";
import React, { useEffect } from "react";

interface AddNewFAQType {
	item?: CollectionFAQType;
	onSave: (data: Partial<CollectionFAQType>, type: "add" | "update" | "delete") => void;
	onCancel?: () => void;
}

const AddNewFAQ: React.FC<AddNewFAQType> = ({ item, onSave, onCancel }) => {
	const [form] = useForm();

	useEffect(() => {
		if (item) {
			const { question = "", answer = "", sequence } = item;
			form.setFieldsValue({ question, answer, sequence });
		}
	}, [item]);

	const onComplete = data => {
		if (item) {
			onSave({ ...item, ...data }, "update");
		} else {
			onSave({ ...data }, "add");
			form.setFieldsValue({ question: "", answer: "", sequence: "" });
		}
	};

	return (
		<Card size='small' title={item ? "Update FAQ" : "Add new FAQ"}>
			<Form form={form} labelCol={{ span: 24 }} onFinish={onComplete}>
				<Row gutter={[8, 0]}>
					<Col span={24}>
						<Form.Item name='sequence' label='Position' rules={[{ required: true, type: "number", min: 0 }]}>
							<InputNumber style={{ width: "100%" }} />
						</Form.Item>
					</Col>
					<Col span={24}>
						<Form.Item name='question' label='Question' rules={[{ required: true }]}>
							<Input />
						</Form.Item>
					</Col>
					<Col span={24}>
						<Form.Item name='answer' label='Answer' rules={[{ required: true }]}>
							<Input />
						</Form.Item>
					</Col>
					<Col>
						<Form.Item>
							<Button htmlType='submit' type='primary'>
								{item ? "Update" : "Add"}
							</Button>
						</Form.Item>
					</Col>
					{onCancel && (
						<Col>
							<Button onClick={onCancel}>Cancel</Button>
						</Col>
					)}
				</Row>
			</Form>
		</Card>
	);
};

export default AddNewFAQ;
