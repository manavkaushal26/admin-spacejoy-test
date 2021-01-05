import { updateAssetStockApi } from "@api/assetApi";
import { getValueSafely } from "@utils/commonUtils";
import fetcher from "@utils/fetcher";
import { Button, Col, Form, InputNumber, Modal, notification, Radio, Row } from "antd";
import { useForm } from "antd/lib/form/Form";
import React, { useEffect, useState } from "react";

interface UpdateAssetdataModal {
	price: number;
	prices: number[];
	available: boolean;
	open: boolean;
	toggleModal: () => void;
	id: string;
	assetName: string;
}

const UpdateAssetDataModal: React.FC<UpdateAssetdataModal> = ({
	id,
	price,
	prices,
	available,
	open,
	toggleModal,
	assetName,
}) => {
	const [form] = useForm();
	const [loading, setLoading] = useState(false);

	const onSave = async data => {
		setLoading(true);
		const endPoint = updateAssetStockApi();
		try {
			const response = await fetcher({ endPoint, method: "POST", body: [{ ...data, id }] });
			if (response.statusCode <= 300) {
				notification.success({ message: "Updated Asset data" });
			} else {
				throw new Error();
			}
		} catch (e) {
			notification.error({ message: "Failed to save Asset data" });
		}
		setLoading(false);
	};
	useEffect(() => {
		if (price || prices || available) {
			form.setFieldsValue({
				...{
					...(!!price || !!prices
						? { price: getValueSafely(() => prices[0], undefined) || parseInt((price as unknown) as string) }
						: {}),
				},
				available,
			});
		}
	}, [open]);

	return (
		<Modal title={`Update ${assetName}`} visible={open} footer={null} onCancel={() => toggleModal()}>
			<Form
				initialValues={{
					...{
						...(!!price || !!prices
							? { price: getValueSafely(() => prices[0], undefined) || parseInt((price as unknown) as string) }
							: {}),
					},
					available,
				}}
				labelCol={{ span: 24 }}
				onFinish={onSave}
			>
				{(!!price || !!prices) && (
					<Form.Item
						name='price'
						label='Price'
						rules={[{ type: "number", required: true, ...{ ...(prices ? { min: prices[0], max: prices[1] } : {}) } }]}
					>
						<InputNumber style={{ width: "100%" }} />
					</Form.Item>
				)}
				<Form.Item name='available' label='Availablity' rules={[{ required: true }]}>
					<Radio.Group>
						<Radio value={true}>Available</Radio>
						<Radio value={false}>Out of Stock</Radio>
					</Radio.Group>
				</Form.Item>
				<Form.Item>
					<Row gutter={[8, 8]} justify='end'>
						<Col>
							<Button type='default' onClick={() => toggleModal()}>
								Cancel
							</Button>
						</Col>
						<Col>
							<Button loading={loading} type='primary' htmlType='submit'>
								Save
							</Button>
						</Col>
					</Row>
				</Form.Item>
			</Form>
		</Modal>
	);
};

export default UpdateAssetDataModal;
