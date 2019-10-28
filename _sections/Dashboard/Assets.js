import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";

const ProductThumbStyled = styled.div`
	background: url(${({ src }) => src}) no-repeat;
	min-height: 100px;
	width: 100%;
	background-size: contain;
	background-position: center;
`;

function Assets({ assets }) {
	return (
		<>
			{assets.map(asset => (
				<div className="grid align-start">
					<div className="col-xs-3 col-bleed">
						<ProductThumbStyled
							src={
								"https://api.homefuly.com/projects/5d5116716ec2df1947e6280c/rooms/5d7b3a0e0eefdd279a564f1a/versions/5da02283f791b977e0336c7d/designimages/final%201_c.png" ||
								asset.productImage
							}
						/>
					</div>
					<div className="col-xs-9">
						Products like {asset.productName} from {asset.productRetailer}
					</div>
				</div>
			))}
		</>
	);
}

Assets.defaultProps = {
	assets: {}
};

Assets.propTypes = {
	assets: PropTypes.arrayOf(
		PropTypes.shape({
			productCost: PropTypes.number,
			productCurrency: PropTypes.string,
			productId: PropTypes.string,
			productImage: PropTypes.string,
			productInventory: PropTypes.string,
			productName: PropTypes.string,
			productRetailer: PropTypes.string
		})
	)
};

export default Assets;
