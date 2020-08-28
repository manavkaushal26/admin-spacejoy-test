import { SearchOutlined } from "@ant-design/icons";
import Image from "@components/Image";
import { OrderItems, OrderItemStatus } from "@customTypes/ecommerceTypes";
import { ScrapedAssetType } from "@customTypes/moodboardTypes";
import { company } from "@utils/config";
import { Button, Col, Input, Row, Table, Tooltip, Typography } from "antd";
import React, { useState } from "react";
import UpdateAssetDataModal from "./UpdateAssetDataModal";

const { Text, Link } = Typography;

interface OrderItemTable {
	orderItems: OrderItems[];
	toggleOrderItemDrawer?: (data: OrderItems) => void;
	orderId?: string;
	scrapedData?: Record<string, ScrapedAssetType>;
}

const OrderItemTable: React.FC<OrderItemTable> = ({ orderItems, toggleOrderItemDrawer, orderId, scrapedData }) => {
	const [searchText, setSearchText] = useState("");
	const [singleScrapedData, setSingleScrapedData] = useState<ScrapedAssetType>(undefined);
	const [modalVisible, setModalVisible] = useState<boolean>(false);
	const [assetName, setAssetName] = useState<string>("");
	const toggleModal = (data?: ScrapedAssetType, name?: string) => {
		setModalVisible(!!data);
		setAssetName(name);
		setSingleScrapedData(data);
	};

	const searchOrderItem = e => {
		const {
			target: { value },
		} = e;
		setSearchText(value);
	};

	return (
		<>
			<Table
				rowKey='_id'
				dataSource={
					orderItems?.filter(item => {
						return (
							item.product?.name?.toLowerCase()?.includes(searchText) ||
							item?.product?.retailer?.name?.toLowerCase()?.includes(searchText)
						);
					}) || []
				}
				scroll={{ x: 768 }}
				pagination={{ hideOnSinglePage: true }}
			>
				<Table.Column
					key='_id'
					title='Name'
					filterDropdown={() => {
						return <Input onChange={searchOrderItem} value={searchText} />;
					}}
					filterIcon={<SearchOutlined style={{ color: searchText !== "" ? "#1890ff" : undefined }} />}
					render={(_, record: OrderItems) => {
						return (
							<Row gutter={[8, 8]} align='middle'>
								{((record?.product?.productImages && record?.product?.productImages[0]?.cdn) ||
									record?.product?.cdn) && (
									<Col>
										<Image
											src={
												(record?.product?.productImages && record?.product?.productImages[0]?.cdn) ||
												record?.product?.cdn
											}
											preview
											width='50px'
										/>
									</Col>
								)}
								<Col>
									<Row>
										<Col span={24}>
											<Link
												strong
												href={`${company.customerPortalLink}/product-view/${record?.product?._id}`}
												target='_blank'
												rel='noopener noreferrer'
											>
												{record?.product?.name}
											</Link>
										</Col>
										<Col span={24}>
											<Link href={record?.product?.retailLink} target='_blank' rel='noopener noreferrer'>
												{record?.product?.retailer?.name}
											</Link>
										</Col>
										<Col span={24}>
											<Text type='secondary' copyable>
												{record?.orderItemId}
											</Text>
										</Col>
									</Row>
								</Col>
							</Row>
						);
					}}
				/>
				<Table.Column key='_id' title='Status' dataIndex='status' render={text => OrderItemStatus[text]} />
				<Table.Column key='_id' title='Quantity' dataIndex='quantity' />
				<Table.Column key='_id' title='Price' dataIndex='price' render={text => <>${text}</>} />
				{scrapedData && (
					<Table.Column
						key='_id'
						title='Retailer Price'
						render={(_, record: OrderItems) => {
							if (scrapedData[record?.product?._id]?.scrape?.available) {
								if (scrapedData[record?.product?._id]?.scrape?.price) {
									return <>${scrapedData[record?.product?._id]?.scrape?.price}</>;
								} else if (scrapedData[record?.product?._id]?.scrape?.prices) {
									return <>${scrapedData[record?.product?._id]?.scrape?.prices?.join("-")}</>;
								}
							} else {
								return (
									<Tooltip title='No Information'>
										<>-</>
									</Tooltip>
								);
							}
						}}
					/>
				)}
				{scrapedData && (
					<Table.Column
						key='_id'
						title='Difference'
						render={(_, record: OrderItems) => {
							if (scrapedData[record?.product?._id]?.scrape?.price) {
								const difference = scrapedData[record?.product?._id]?.scrape?.price - record?.product?.price;
								const fixedDifference = difference.toFixed(2);
								return (
									<>
										{difference < 0 ? `-$${-fixedDifference}` : `$${-fixedDifference}`} (
										{((difference * 100) / record?.product?.price).toFixed(2)}%)
									</>
								);
							} else if (scrapedData[record?.product?._id]?.scrape?.prices) {
								const priceRange = scrapedData[record?.product?._id]?.scrape?.prices.join("-");
								return <>${priceRange}</>;
							} else {
								return (
									<Tooltip title='No Information'>
										<>-</>
									</Tooltip>
								);
							}
						}}
					/>
				)}
				{scrapedData && (
					<Table.Column
						key='_id'
						title='Availability'
						render={(_, record: OrderItems) => (
							<>{scrapedData[record?.product?._id]?.scrape?.available ? "Available" : "Out of Stock"}</>
						)}
					/>
				)}
				<Table.Column
					key='_id'
					title='Total'
					render={(_, record: OrderItems) => {
						return <>${record.price * record.quantity}</>;
					}}
				/>
				<Table.Column
					key='_id'
					title='Actions'
					render={(_, record: OrderItems) => (
						<Row align='middle'>
							<>
								<Col>
									{toggleOrderItemDrawer ? (
										<Button type='link' onClick={() => toggleOrderItemDrawer(record)}>
											Modify Order Item
										</Button>
									) : (
										<Link
											href={`/ecommerce/ordertracking/orderdetails?orderId=${orderId}&orderItemId=${record.orderItemId}`}
										>
											Modify Order Item
										</Link>
									)}
								</Col>
								{scrapedData && !!scrapedData[record?.product?._id] && (
									<Col>
										<Button
											type='link'
											onClick={() => toggleModal(scrapedData[record?.product?._id], record?.product?.name)}
										>
											Update Asset
										</Button>
									</Col>
								)}
							</>
						</Row>
					)}
				/>
			</Table>
			<UpdateAssetDataModal
				open={modalVisible}
				toggleModal={toggleModal}
				id={singleScrapedData?._id}
				price={singleScrapedData?.scrape?.price}
				prices={singleScrapedData?.scrape?.prices}
				available={singleScrapedData?.scrape?.available}
				assetName={assetName}
			/>
		</>
	);
};

export default OrderItemTable;
