import Card from "@components/Card";
import Image from "@components/Image";
import { DesignImgTypes, DetailedDesign } from "@customTypes/dashboardTypes";
import ProductCard from "@sections/Cards/ProductCard";
import { BiggerButtonCarousel } from "@sections/Dashboard/styled";
import SectionHeader from "@sections/SectionHeader";
import config, { cloudinary } from "@utils/config";
import { Col, Divider, Empty, Row, Button } from "antd";
import React from "react";
import ReactPannellum from "react-pannellum";
import styled from "styled-components";

interface CustomerView {
	designData: DetailedDesign;
	projectName: string;
}

const FlatCard = styled(Card)`
	margin-top: 1rem;
`;

const PannellumOptions = {
	style: {
		width: "100%",
		height: "300px",
	},

	config: {
		autoRotate: -2,
		autoLoad: true,
		autoRotateInactivityDelay: 1000,
		uiText: {
			loadButtonLabel: "Start",
		},
	},
};

const CustomerView: React.FC<CustomerView> = ({ designData, projectName }) => {
	const pannelumImage = designData.designImages.find(image => image.imgType === DesignImgTypes.Panorama);

	return (
		<Row gutter={[4, 8]}>
			<Col sm={24} {...(pannelumImage ? { md: 18 } : {})} style={{ marginBottom: "1rem" }}>
				<BiggerButtonCarousel slidesToShow={1} slidesToScroll={1} autoplay>
					{designData.designImages
						.filter(image => image.imgType === DesignImgTypes.Render)
						.map(image => (
							<Row key={image._id}>
								<Col span={24}>
									<Image width="100%" src={`${image.cdn}`} />
								</Col>
								<Col span={24}>
									<Row justify="space-around">
										<Col>
											<a
												href={image.path}
												download={`${designData.name}-${image._id}-original.jpg`}
												target="_blank"
												rel="noreferrer noopener"
											>
												<Button type="link">Open Original</Button>
											</a>
										</Col>
										<Col>
											<a
												href={`${config.cloudinary.baseDeliveryURL}/${image.cdn}`}
												download={`${designData.name}-${image._id}-cdn.jpg`}
												target="_blank"
												rel="noreferrer noopener"
											>
												<Button type="link">Open CDN</Button>
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
						id="renderPanorama"
						sceneId="firstScene"
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
			{designData.description !== "" && (
				<Col span={24}>
					<FlatCard noMargin noShadow full bg="red">
						<div className="grid">
							<div className="col-xs-12">{designData.description}</div>
						</div>
					</FlatCard>
				</Col>
			)}
			<Col span={24}>
				<Divider>Your Shopping List</Divider>
				<ProductCard
					assets={designData.assets}
					gridCount={4}
					showLoadMore={false}
					designName={designData.name}
					designId={designData.id}
					size="150"
				/>
			</Col>
		</Row>
	);
};

export default CustomerView;
