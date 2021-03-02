import Card from "@components/Card";
import Image from "@components/Image";
import fetcher from "@utils/fetcher";
import { notification, Typography } from "antd";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import styled, { css } from "styled-components";
const { Text, Title } = Typography;

const OutOfStock = css`
	background-color: ${({ theme }) => theme.colors.mild.red};
	.description,
	.quantity,
	.price,
	.remove {
		filter: grayscale(1);
		pointer-events: none;
	}
	.quantity {
		display: none;
	}
	.thumbnail {
		img {
			filter: grayscale(1);
		}
	}
`;

const ProductThumbnail = styled.div``;

const Wrapper = styled(Card)`
	${({ inStock }) => (!inStock ? OutOfStock : "")};
	display: grid;
	grid-template-columns: repeat(10, minmax(25px, 1fr));
	grid-gap: 1rem;
	padding: 2rem;
	align-items: center;
	text-align: center;
	@media (max-width: 1600px) {
		padding: 1rem;
	}
	@media (max-width: 768px) {
		grid-template-columns: repeat(7, minmax(20px, 1fr));
	}
	& + & {
		margin-top: 1rem;
	}
	.unit {
		&:nth-child(2) {
			grid-column: 2/6;
		}
		&:nth-child(3) {
			grid-column: 6/8;
		}
		&:nth-child(4) {
			grid-column: 8/10;
		}
		&.thumbnail {
			position: relative;
			img {
				max-height: 100px;
				@media (max-width: 768px) {
					max-height: 100%;
					width: 100%;
				}
			}
			.label {
				position: absolute;
				top: -1rem;
				left: -35px;
				background: ${({ theme }) => theme.colors.bg.dark2};
				color: white;
				padding: 2px 10px 2px 5px;
				text-transform: uppercase;
				z-index: 1;
				white-space: nowrap;
				@media (max-width: 1600px) {
					left: -20px;
					top: -0.5rem;
				}
				small {
					position: relative;
					top: -1px;
					text-shadow: 1px 1px #00000012;
				}
				&:after {
					content: "";
					position: absolute;
					left: 0;
					top: 25px;
					border-top: 3px solid ${({ theme }) => theme.colors.bg.dark1};
					border-right: 3px solid ${({ theme }) => theme.colors.bg.dark1};
					border-left: 3px solid transparent;
					border-bottom: 3px solid transparent;
				}
				&.fast-selling {
					background: ${({ theme }) => theme.colors.red};
					&:after {
						border-top: 3px solid #b9102d;
						border-right: 3px solid #b9102d;
					}
				}
				&.few-left {
					background: ${({ theme }) => theme.colors.primary2};
					&:after {
						border-top: 3px solid #b9750b;
						border-right: 3px solid #b9750b;
					}
				}
				&.out-of-stock {
					background: ${({ theme }) => theme.colors.white};
					border: 1px solid ${({ theme }) => theme.colors.bg.light2};
					border-top-width: 0;
					border-left-width: 0;
					color: ${({ theme }) => theme.colors.red};
				}
			}
		}
		&.description {
			text-align: left;
			h4 {
				max-width: calc(100% - 105px);
				color: ${({ theme }) => theme.colors.fc.dark1};
				margin: 0;
				display: inline-block;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}
			p {
				color: ${({ theme }) => theme.colors.fc.dark2};
				margin: 0;
				font-size: 0.85em;
			}
		}
		&.price {
			padding: 0 1rem;
			h3 {
				margin: 0;
			}
		}
		&.remove {
			text-align: center;
			span {
				font-size: 1.5rem;
			}
			@media (max-width: 768px) {
				display: none;
			}
		}
		@media (max-width: 768px) {
			grid-template-rows: 1fr 1fr;
			&:nth-child(1) {
				grid-row: 1/3;
				grid-column: 1/4;
			}
			&:nth-child(2) {
				grid-column: 1/8;
			}
			&:nth-child(3) {
				text-align: left;
				margin-bottom: 0.25rem;
				grid-row: 4/5;
				grid-column: 1/4;
			}
			&:nth-child(4) {
				text-align: right;
				grid-column: 4/8;
			}
		}
	}
`;

const BrandArea = styled.div`
	position: relative;
	padding-left: 1rem;
	@media (max-width: 576px) {
		padding-left: 0;
	}
	& + & {
		margin-top: 1rem;
	}
	.brand-name-box {
		position: absolute;
		z-index: 1;
		height: calc(100% - 2rem);
		width: 0.5rem;
		top: 1rem;
		left: 0;
		border: 1px dashed ${({ theme }) => theme.colors.fc.dark2};
		border-right: 0;
		text-transform: uppercase;
		@media (max-width: 576px) {
			left: -1rem;
		}
		span.name {
			position: absolute;
			display: inline-block;
			text-align: center;
			width: 150px;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
			top: 50%;
			left: -85px;
			transform: rotate(-90deg);
			transform-origin: center top;
			color: ${({ theme }) => theme.colors.fc.dark2};
			background: ${({ theme }) => theme.colors.mild.black};
		}
	}
`;

export default function CartDetails({ id }) {
	const [cartData, setcartData] = useState({});

	const getCartDetails = async () => {
		const response = await fetcher({ endPoint: `/v1/carts/userCart?userId=${id}`, method: "GET" });

		if (response.status === "success") {
			setcartData(response.data.data);
		} else {
			notification.error({ message: "Failed to fetch Themes" });
		}
	};

	useEffect(() => {
		getCartDetails();
	}, []);

	return (
		<div>
			{cartData &&
				Object.entries(cartData?.cartItems).map(brand => (
					<BrandArea key={brand[0]}>
						{brand[1].name ? (
							<div className='brand-name-box'>
								<span className='name'>{brand[1].name}</span>
							</div>
						) : null}
						{Object.entries(brand[1]?.products).map(product => (
							<Wrapper noMargin bg='white' inStock key={product[0]}>
								<div className='unit thumbnail'>
									{product[1]?.fewLeft && (
										<div className='label few-left'>
											<span className='icon-bell' /> <small>Few Left</small>
										</div>
									)}
									{product[1]?.trending && (
										<div className='label fast-selling'>
											<span className='icon-zap' /> <small>Trending</small>
										</div>
									)}
									{product[1]?.outOfStock && (
										<div className='label out-of-stock'>
											<span className='icon-info' /> <small>Out Of Stock</small>
										</div>
									)}
									<ProductThumbnail>
										{product[1]?.slug ? (
											<Link
												href={{ pathname: "/product-view", query: { slug: product[1]?.slug } }}
												as={`/product-view/${product[1]?.slug}`}
											>
												<a href={`/product-view/${product[1]?.slug}`} target='_blank' rel='noreferrer'>
													<Image width='100%' src={`w_500/${product[1]?.cdn}`} />
												</a>
											</Link>
										) : (
											<Image width='100%' src={`w_500/${product[1]?.cdn}`} />
										)}
									</ProductThumbnail>
								</div>
								<div className='unit description'>
									<Link
										href={{ pathname: "/product-view", query: { slug: product[1]?.slug } }}
										as={`/product-view/${product[1]?.slug}`}
									>
										<a href={`/product-view/${product[1]?.slug}`} target='_blank' rel='noreferrer'>
											<h4>{product[1]?.name}</h4>
											<p>Ships From: {brand[1]?.name || product[1]?.retailer}</p>
											<p>{brand[1]?.shippingMethod ? `Shipping Method: ${brand[1]?.shippingMethod}` : ""}</p>
											<p>{brand[1]?.ETA ? `ETA:${brand[1]?.ETA}` : ""}</p>
										</a>
									</Link>
								</div>
								<div className='unit price'>
									<h3>${product[1]?.displayPrice || product[1]?.price}</h3>
								</div>
							</Wrapper>
						))}
					</BrandArea>
				))}
		</div>
	);
}
