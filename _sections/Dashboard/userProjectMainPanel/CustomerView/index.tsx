import { CheckOutlined, CloseOutlined, RedoOutlined } from "@ant-design/icons";
import Card from "@components/Card";
import Image from "@components/Image";
import { DesignImgTypes, DetailedDesign, DetailedProject } from "@customTypes/dashboardTypes";
import ProductCard from "@sections/AssetStore/assetMainpanel/ProductCard";
import { BiggerButtonCarousel } from "@sections/Dashboard/styled";
import SectionHeader from "@sections/SectionHeader";
import { getValueSafely } from "@utils/commonUtils";
import config, { cloudinary } from "@utils/config";
import { useScraper } from "@utils/customHooks/useScraper";
import { Button, Card as AntdCard, Col, Divider, notification, Row, Typography } from "antd";
import React, { useEffect, useMemo } from "react";
import ReactPannellum from "react-pannellum";
import styled from "styled-components";

const { Text, Title } = Typography;
interface CustomerView {
	designData: DetailedDesign;
	projectName: string;
	projectData: DetailedProject;
}

const FlatCard = styled(Card)`
	margin-top: 1rem;
`;

const PannellumOptions = {
	style: {
		width: "100%",
	},

	config: {
		autoRotate: -2,
		autoLoad: true,
		autoRotateInactivityDelay: 1000,
		uiText: {
			loadButtonLabel: "Start",
		},
		hfov: 60,
	},
};

const PackageDetails: React.FC<{
	items: string;
}> = ({ items }) => {
	if (items.includes("euphoria"))
		return (
			<>
				<Col>
					<CheckOutlined style={{ color: "green" }} />
					<Text strong> Paint Recommendations </Text>
				</Col>
				<Col>
					<CheckOutlined style={{ color: "green" }} />
					<Text strong> Window Treatment </Text>
				</Col>
			</>
		);
	if (items.includes("bliss"))
		return (
			<>
				<Col>
					<CheckOutlined style={{ color: "green" }} />
					<Text strong> Paint Recommendations </Text>
				</Col>
				<Col>
					<CloseOutlined style={{ color: "red" }} />
					<Text strong> Window Treatment </Text>
				</Col>
			</>
		);
	if (items.includes("delight"))
		return (
			<>
				<Col>
					<CloseOutlined style={{ color: "red" }} />
					<Text strong>Paint Recommendations </Text>
				</Col>
				<Col>
					<CloseOutlined style={{ color: "red" }} />
					<Text strong> Window Treatment </Text>
				</Col>
			</>
		);
};

const CustomerView: React.FC<CustomerView> = ({ designData, projectName, projectData }) => {
	const pannelumImage = designData.designImages.find(image => image.imgType === DesignImgTypes.Panorama);
	const { scrapedData, scraping, triggerScraping, error: scrapingError } = useScraper(
		designData._id,
		designData?.assets?.map(asset => asset?.asset?._id)
	);

	const nonBillableAssets = useMemo(
		() => designData.assets.filter(asset => !asset.billable || !asset.asset?.shoppable),
		[designData?.assets]
	);

	useEffect(() => {
		if (scraping) notification.info({ message: "Scraping Products data. This may take a minute" });
	}, [scraping]);

	useEffect(() => {
		if (scrapingError) notification.error({ message: "Failed to scrape Data" });
	}, [scrapingError]);

	const items = useMemo(() => {
		if (projectData?.order) {
			return projectData?.order?.items
				.map(item => {
					return getValueSafely(() => item.name, "");
				})
				.join(",");
		}
		return "";
	}, [projectData?.order]);
	return (
		<Row gutter={[4, 16]}>
			<Col sm={24} {...(pannelumImage ? { md: 18 } : {})} style={{ marginBottom: "1rem" }}>
				<BiggerButtonCarousel slidesToShow={1} slidesToScroll={1} autoplay>
					{designData.designImages
						.filter(image => image.imgType === DesignImgTypes.Render)
						.map(image => (
							<Row key={image._id}>
								<Col span={24}>
									<Image width='100%' src={`${image.cdn}`} preview />
								</Col>
								<Col span={24}>
									<Row justify='space-around'>
										<Col>
											<a
												href={image.path}
												download={`${designData.name}-${image._id}-original.jpg`}
												target='_blank'
												rel='noreferrer noopener'
											>
												<Button type='link'>Open Original</Button>
											</a>
										</Col>
										<Col>
											<a
												href={`${config.cloudinary.baseDeliveryURL}/${image.cdn}`}
												download={`${designData.name}-${image._id}-cdn.jpg`}
												target='_blank'
												rel='noreferrer noopener'
											>
												<Button type='link'>Open CDN</Button>
											</a>
										</Col>
									</Row>
								</Col>
							</Row>
						))}
				</BiggerButtonCarousel>
			</Col>
			{pannelumImage ? (
				<Col sm={18} md={6}>
					<ReactPannellum
						id='renderPanorama'
						sceneId='firstScene'
						imageSource={`${cloudinary.baseDeliveryURL}/image/upload/${pannelumImage.cdn}`}
						{...PannellumOptions}
					/>
				</Col>
			) : (
				<></>
			)}
			<Col span={24}>
				<SectionHeader size={0} hgroup={3} mini title={designData.name} description={projectName} />
			</Col>
			{designData.description !== "" && designData.description !== undefined && (
				<Col span={24}>
					<FlatCard noMargin noShadow full bg='red'>
						<div className='grid'>
							<div className='col-xs-12'>{designData.description}</div>
						</div>
					</FlatCard>
				</Col>
			)}
			<Col span={24}>
				<Divider />
			</Col>
			{projectData && (
				<Col span={24}>
					<AntdCard size='small'>
						<Row gutter={[8, 8]} justify='space-around' align='middle'>
							<PackageDetails items={items} />
						</Row>
					</AntdCard>
				</Col>
			)}
			<Col span={24}>
				<Divider />
			</Col>
			<Col span={24}>
				<Row gutter={[8, 16]}>
					<Col span={24}>
						<Row justify='space-between'>
							<Col>
								<Title level={4}>Shopping List</Title>
							</Col>
							<Col>
								<Button
									size='small'
									type='link'
									onClick={triggerScraping}
									icon={<RedoOutlined spin={scraping} style={{ transform: "rotate(180deg)" }} />}
								>
									{scrapedData ? "Refetch Data" : "Fetch Data"}
								</Button>
							</Col>
						</Row>
					</Col>
					<Col span={24}>
						<Row gutter={[8, 8]}>
							{designData.assets.map(asset => {
								if (asset.billable && asset.asset?.shoppable) {
									return (
										<Col sm={12} md={8} lg={6} key={asset._id}>
											<ProductCard
												{...(scrapedData && scrapedData[asset?.asset?._id]
													? { scrapedData: scrapedData[asset?.asset?._id] }
													: {})}
												hoverable={false}
												asset={asset?.asset}
												noVertical
											/>
										</Col>
									);
								}
								return <></>;
							})}
						</Row>
					</Col>
				</Row>
			</Col>

			{nonBillableAssets.length > 0 && (
				<Col span={24}>
					<Row gutter={[0, 16]}>
						<Col span={24}>
							<Title level={4}>Non-Billable Assets</Title>
						</Col>
						<Col span={24}>
							<Row gutter={[8, 8]}>
								{nonBillableAssets.map(asset => {
									if (!asset.billable || !asset.asset?.shoppable) {
										return (
											<Col sm={12} md={8} lg={6} key={asset._id}>
												<ProductCard hoverable={false} asset={asset?.asset} noVertical />
											</Col>
										);
									}
									return <></>;
								})}
							</Row>
						</Col>
					</Row>
				</Col>
			)}
		</Row>
	);
};

export default CustomerView;
