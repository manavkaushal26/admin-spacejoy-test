import { getValueSafely } from "@utils/commonUtils";
import { Col, Input, Modal, Pagination, Radio, Row, Select, Typography } from "antd";
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { SkuData } from "./useSkuIdFetcher";

const { Text } = Typography;

const StyledRadio = styled(Radio)`
	.ant-radio-inner {
		display: none;
	}
	&.ant-radio-wrapper-checked::after {
		position: absolute;
		top: 0;
		right: 8px;
		height: 35px;
		width: 35px;
		border-bottom-left-radius: 40px;
		background: #52c41a;
		content: "✓";
		padding: 0 0 8px 8px;
		display: flex;
		justify-content: center;
		align-items: center;
		color: white;
		font-size: 1.25em;
	}
`;

const convertToNumber = value => {
	return parseFloat(value);
};

const searchCriteria = {
	name: {
		key: "title",
		preProcess: undefined,
	},
	sku: {
		key: "sku",
		preProcess: undefined,
	},
	price: {
		key: "price",
		preProcess: convertToNumber,
	},
};

interface SkuIdSelectionModalType {
	skuList: SkuData[];
	isOpen: boolean;
	toggleModal: () => void;
	onSelect: (value: SkuData) => void;
}

const SkuIdSelectionModal: React.FC<SkuIdSelectionModalType> = ({ skuList, isOpen, toggleModal, onSelect }) => {
	const [selectedSkuId, setSelectedSkuId] = useState(getValueSafely(() => skuList[0]?.sku, ""));
	const [pageNumber, setPageNumber] = useState(0);
	const [limit] = useState(12);
	const [searchValue, setSearchValue] = useState("");
	const [searchKey, setSearchKey] = useState(Object.keys(searchCriteria)[0]);
	const [displaySkuList, setDisplaySkuList] = useState([...skuList]);

	const searchRef = useRef();

	const searchFunction = () => {
		setDisplaySkuList(
			skuList.filter(sku => {
				return sku[searchCriteria[searchKey].key].toString().toLowerCase().includes(searchValue);
			})
		);
		setPageNumber(0);
	};

	const onInputChange = e => {
		const {
			target: { value },
		} = e;

		setSearchValue(value.toLowerCase());
	};

	useEffect(() => {
		const id = setTimeout(() => {
			searchFunction();
		}, 300);

		return () => {
			clearTimeout(id);
		};
	}, [searchValue, skuList]);

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

	const onPageChange = value => {
		setPageNumber(value - 1);
	};

	const onSubmit = () => {
		onSelect(skuList.find(skuItem => skuItem.sku === selectedSkuId));
		toggleModal();
	};

	const searchKeyChange = value => {
		setSearchKey(value);
	};

	return (
		<Modal
			title='Select SKU Id'
			width='80%'
			visible={isOpen}
			centered
			onCancel={toggleModal}
			onOk={onSubmit}
			bodyStyle={{ height: "80vh", overflow: "auto" }}
			okButtonProps={{ title: "Submit" }}
		>
			<Row gutter={[16, 16]}>
				<Col span={24} style={{ position: "sticky", top: "-24px", background: "white", zIndex: 9 }}>
					<Row gutter={[8, 8]}>
						<Col xs={24} sm={18}>
							<Row gutter={[8, 8]}>
								<Col span={24}>
									<label htmlFor='searchQuery'>Search </label>
								</Col>
								<Col span={24}>
									<Input
										onChange={onInputChange}
										key={searchKey}
										defaultValue={searchValue}
										id='searchQuery'
										placeholder={`${searchKey[0].toLocaleUpperCase()}${searchKey.slice(1, searchKey.length)}`}
									/>
								</Col>
							</Row>
						</Col>
						<Col xs={24} sm={6}>
							<Row gutter={[8, 8]}>
								<Col span={24}>
									<label htmlFor='searchQuery'>By</label>
								</Col>
								<Col span={24}>
									<Select style={{ width: "100%" }} value={searchKey} onChange={searchKeyChange}>
										{Object.keys(searchCriteria).map(key => {
											return (
												<Select.Option key={key} value={key} style={{ textTransform: "capitalize" }}>
													{searchCriteria[key].key[0].toLocaleUpperCase()}
													{searchCriteria[key].key.slice(1, searchCriteria[key].key.length)}
												</Select.Option>
											);
										})}
									</Select>
								</Col>
							</Row>
						</Col>
					</Row>
				</Col>
				<Col span={24}>
					<Radio.Group value={selectedSkuId} onChange={onChange}>
						<Row gutter={[24, 24]}>
							{displaySkuList?.slice(pageNumber * limit, limit * (pageNumber + 1))?.map(skuItem => {
								return (
									<Col xs={24} sm={12} md={8} lg={6} key={skuItem.sku}>
										<StyledRadio value={skuItem.sku} style={{ width: "100%" }}>
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
										</StyledRadio>
									</Col>
								);
							})}
						</Row>
					</Radio.Group>
				</Col>
				<Col span={24}>
					<Row justify='center'>
						<Pagination
							showSizeChanger={false}
							showQuickJumper
							hideOnSinglePage
							pageSize={limit}
							current={pageNumber + 1}
							onChange={onPageChange}
							total={displaySkuList.length}
						/>
					</Row>
				</Col>
			</Row>
		</Modal>
	);
};

export default SkuIdSelectionModal;
