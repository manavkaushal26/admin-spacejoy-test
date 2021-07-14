import { getValueSafely } from "@utils/commonUtils";
import { Col, Modal, Radio, Row, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { SkuData } from "./useSkuIdFetcher";

const { Text } = Typography;

interface SkuIdSelectionModalType {
	skuList: SkuData[];
	isOpen: boolean;
	toggleModal: () => void;
	onSelect: (value: SkuData) => void;
}

const SkuIdSelectionModal: React.FC<SkuIdSelectionModalType> = ({ skuList, isOpen, toggleModal, onSelect }) => {
	const [selectedSkuId, setSelectedSkuId] = useState(getValueSafely(() => skuList[0]?.sku, ""));

	useEffect(() => {
		if (skuList?.length) {
			setSelectedSkuId(skuList[0].sku);
		}
	}, [skuList]);

	const onChange = e => {
		const {
			target: { value },
		} = e;
		setSelectedSkuId(value);
	};

	const onSubmit = () => {
		onSelect(skuList.find(skuItem => skuItem.sku === selectedSkuId));
		toggleModal();
	};

	return (
		<Modal
			title='Select SKU Id'
			visible={isOpen}
			onCancel={toggleModal}
			onOk={onSubmit}
			okButtonProps={{ title: "Submit" }}
		>
			<Radio.Group value={selectedSkuId} onChange={onChange}>
				<Row gutter={[8, 8]}>
					{skuList?.map(skuItem => {
						return (
							<Col span={12} key={skuItem.sku}>
								<Radio value={skuItem.sku} style={{ width: "100%" }}>
									<Row gutter={[8, 8]}>
										<Col span={24}>
											<img style={{ width: "100%" }} src={skuItem?.img} />
										</Col>
										<Col span={24}>
											<Text strong>Name: </Text>
											<Text style={{ whiteSpace: "normal" }}>{skuItem.title}</Text>
										</Col>
										<Col span={24}>
											<Text strong>SKU: </Text>
											<Text style={{ whiteSpace: "normal" }}>{skuItem.sku}</Text>
										</Col>
										<Col span={24}>
											<Text strong>Price: </Text>
											<Text style={{ whiteSpace: "normal" }}>{skuItem.price}</Text>
										</Col>
									</Row>
								</Radio>
							</Col>
						);
					})}
				</Row>
			</Radio.Group>
		</Modal>
	);
};

export default SkuIdSelectionModal;
