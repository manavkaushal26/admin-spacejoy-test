import { getValueSafely } from "@utils/commonUtils";
import { Col, Empty, Input, Modal, Pagination, Radio, Row, Typography } from "antd";
import React, { useEffect, useState } from "react";
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
	const [titleSearchValue, setTitleSearchValue] = useState("");
	const [priceSearchValue, setPriceSearchValue] = useState("");
	const [skuSearchValue, setskuSearchValue] = useState("");

	const [displaySkuList, setDisplaySkuList] = useState([...skuList]);

	const searchFunction = () => {
		setDisplaySkuList(
			skuList.filter(sku => {
				const titleMatch = sku?.title?.toString().toLowerCase().includes(titleSearchValue.toLowerCase());
				const skuMatch = sku?.sku?.toString().toLowerCase().includes(skuSearchValue.toLowerCase());
				const priceMatch = priceSearchValue !== "" ? sku?.price?.toString().toLowerCase() === priceSearchValue : true;

				return titleMatch && skuMatch && priceMatch;
			})
		);
		setPageNumber(0);
	};

	const onInputChange = (e, type) => {
		const {
			target: { value },
		} = e;
		if (type === "title") {
			setTitleSearchValue(value.toLowerCase());
		} else if (type === "price") {
			setPriceSearchValue(value);
		} else {
			setskuSearchValue(value.toLowerCase());
		}
	};

	useEffect(() => {
		const id = setTimeout(() => {
			searchFunction();
		}, 300);

		return () => {
			clearTimeout(id);
		};
	}, [titleSearchValue, priceSearchValue, skuSearchValue, skuList]);

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
				<Col
					span={24}
					style={{ position: "sticky", top: "-24px", background: "white", zIndex: 9, paddingBottom: "1rem" }}
				>
					<Row gutter={[8, 8]}>
						<Col sm={24} md={8}>
							<Row gutter={[8, 8]}>
								<Col span={24}>
									<label htmlFor='searchQuery'>Name</label>
								</Col>
								<Col span={24}>
									<Input
										onChange={e => onInputChange(e, "title")}
										defaultValue={titleSearchValue}
										id='searchQuery'
										placeholder={"Name"}
									/>
								</Col>
							</Row>
						</Col>
						<Col sm={12} md={8}>
							<Row gutter={[8, 8]}>
								<Col span={24}>
									<label htmlFor='price'>Price </label>
								</Col>
								<Col span={24}>
									<Input
										onChange={e => onInputChange(e, "price")}
										defaultValue={titleSearchValue}
										id='price'
										placeholder={"Price"}
									/>
								</Col>
							</Row>
						</Col>
						<Col sm={12} md={8}>
							<Row gutter={[8, 8]}>
								<Col span={24}>
									<label htmlFor='sku'>SKU </label>
								</Col>
								<Col span={24}>
									<Input
										onChange={e => onInputChange(e, "sku")}
										defaultValue={titleSearchValue}
										id='sku'
										placeholder={"SKU"}
									/>
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
					<Row justify='space-around'>{displaySkuList?.length === 0 && <Empty description='No SKU found' />}</Row>
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
