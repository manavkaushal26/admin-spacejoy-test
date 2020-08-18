import { Button, Col, Form, InputNumber, Modal, Row } from "antd";
import { useForm } from "antd/lib/form/Form";
import React, { useEffect } from "react";

interface CapturePaymentsModal {
	open: boolean;
	toggleModal: () => void;
	onComplete: (id, data) => void;
	id: string;
	initialValue: number;
}

const CapturePaymentsModal: React.FC<CapturePaymentsModal> = ({ open, toggleModal, onComplete, id, initialValue }) => {
	const [form] = useForm();
	const okClickOk = data => {
		onComplete(id, data);
	};

	useEffect(() => {
		if (id && initialValue) {
			form.setFieldsValue({ amount: initialValue });
		}
		return () => {
			form.setFieldsValue({ amount: 0 });
		};
	}, [id, initialValue]);

	return (
		<Modal title='Debit Payment' visible={open} footer={null}>
			<Form form={form} labelCol={{ span: 24 }} onFinish={okClickOk} initialValues={{ amount: initialValue }}>
				<Row>
					<Col span={24}>
						<Form.Item
							name='amount'
							label='Amount to be Debited'
							rules={[{ required: true, type: "number", min: 0, max: initialValue }]}
						>
							<InputNumber style={{ width: "100%" }} />
						</Form.Item>
					</Col>
					<Col span={24}>
						<Row justify='end' gutter={[8, 8]}>
							<Col>
								<Button onClick={toggleModal} htmlType='reset'>
									Cancel
								</Button>
							</Col>
							<Col>
								<Button htmlType='submit' type='primary'>
									Debit
								</Button>
							</Col>
						</Row>
					</Col>
				</Row>
			</Form>
		</Modal>
	);
};

export default CapturePaymentsModal;
