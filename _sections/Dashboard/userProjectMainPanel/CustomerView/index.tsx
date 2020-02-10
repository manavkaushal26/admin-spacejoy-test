import Card from "@components/Card";
import Image from "@components/Image";
import { DesignImgTypes, DetailedDesign } from "@customTypes/dashboardTypes";
import ProductCard from "@sections/Cards/ProductCard";
import SectionHeader from "@sections/SectionHeader";
import { Carousel, Col, Divider, Row, Empty } from "antd";
import React from "react";
import styled from "styled-components";
import ReactPannellum from "react-pannellum";
import { cloudinary } from "@utils/config";

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

const BiggerButtonCarousel = styled(Carousel)`
	> .slick-dots li button {
		background: #ff7875;
		height: 8px !important;
		width: 20px;
	}
	> .slick-dots li.slick-active button {
		background: #ff7875;
		width: 28px;
	}
`;

const CustomerView: React.FC<CustomerView> = ({ designData, projectName }) => {
	const pannelumImage = designData.designImages.find(image => image.imgType === DesignImgTypes.Panorama);

	return (
		<Row>
			<Col sm={24} {...(pannelumImage ? { md: 18 } : {})} style={{ marginBottom: "1rem" }}>
				<BiggerButtonCarousel slidesToShow={1} slidesToScroll={1} autoplay>
					{designData.designImages
						.filter(image => image.imgType === DesignImgTypes.Render)
						.map(image => (
							<div key={image._id}>
								<Image width="100%" src={`${image.cdn}`} />
							</div>
						))}
				</BiggerButtonCarousel>
			</Col>
			<Col {...(pannelumImage ? { sm: 18 } : { sm: 0 })} {...(pannelumImage ? { md: 6 } : { md: 0 })}>
				{pannelumImage ? (
					<ReactPannellum
						id="renderPanorama"
						sceneId="firstScene"
						imageSource={`${cloudinary.baseDeliveryURL}/image/upload/${pannelumImage.cdn}`}
						{...PannellumOptions}
					/>
				) : (
					<Empty description="No Panorama images found" />
				)}
			</Col>
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
