import Image from "@components/Image";
import { DesignImgTypes, DetailedDesign } from "@customTypes/dashboardTypes";
import SectionHeader from "@sections/SectionHeader";
import { Carousel, Row, Divider, Col } from "antd";
import React from "react";
import styled from "styled-components";
import Card from "@components/Card";
import ProductCard from "@sections/Cards/ProductCard";

interface CustomerView {
	designData: DetailedDesign;
	projectName: string;
}

const FlatCard = styled(Card)`
	margin-top: 1rem;
`;

const CustomerView: React.FC<CustomerView> = ({ designData, projectName }) => {
	return (
		<Row>
			<Col style={{ marginBottom: "1rem" }}>
				<Carousel slidesToShow={1} slidesToScroll={1} autoplay>
					{designData.designImages
						.filter(image => image.imgType === DesignImgTypes.Render)
						.map(image => (
							<div key={image._id}>
								<Image width="100%" src={`${image.cdn}`} nolazy />
							</div>
						))}
				</Carousel>
				<SectionHeader size={0} hgroup={3} mini title={designData.name} description={projectName} />
				<FlatCard noMargin noShadow full bg="red">
					<div className="grid">
						<div className="col-xs-12">{designData.description}</div>
					</div>
				</FlatCard>
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
