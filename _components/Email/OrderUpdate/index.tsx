import Image from "@components/Image";
import { OrderItems, OrderItemStatuses } from "@customTypes/ecommerceTypes";
import React from "react";

interface OrderUpdate {
	firstName: string;
	address: string;
	selectedProducts: OrderItems[];
	productTotal: number;
	shippingCharge: number;
	subTotal: number;
	discount: number;
	amount: number;
	tax: number;
}

const OrderUpdate: React.FC<OrderUpdate> = ({
	firstName,
	address,
	selectedProducts,
	productTotal,
	shippingCharge,
	subTotal,
	discount,
	amount,
	tax,
}) => {
	const confirmedProducts = selectedProducts.filter(item => {
		return item.status === OrderItemStatuses.confirmed;
	});

	const unconfirmedProducts = selectedProducts.filter(
		item =>
			item.status === OrderItemStatuses.pending ||
			item.status === OrderItemStatuses.returnApproved ||
			item.status === OrderItemStatuses.returnDeclined ||
			item.status === OrderItemStatuses.returnInitiated
	);

	const cancelledProducts = selectedProducts.filter(
		item =>
			item.status === OrderItemStatuses.cancellationApproved ||
			item.status === OrderItemStatuses.cancellationInitiated ||
			item.status === OrderItemStatuses.cancellationDeclined
	);

	return (
		<table
			width='100%'
			cellPadding='0'
			cellSpacing='0'
			className='main-wrapper'
			style={{
				fontFamily:
					" Open Sans, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, Helvetica, Arial, sans-serif",
			}}
		>
			<tbody className='font-md'>
				<tr>
					<td style={{ margin: "3rem 0" }}>
						<table
							style={{
								borderSpacing: "0px",
								boxShadow: "0 3px 6px rgba(0, 0, 0, 0.02),  0 3px 6px rgba(0, 0, 0, 0.035)",
								backgroundColor: "#ffffff",
								borderRadius: "4px",
							}}
							className='tables'
						>
							<tr>
								<td style={{ padding: "2.5rem 0 0 0" }}>
									<img
										src='https://res.cloudinary.com/spacejoy/image/upload/c_scale,q_auto,w_200/v1591441264/Email/email-v2/Logo_kcsvkj.png'
										width='80px'
									/>
								</td>
							</tr>
							<tr>
								<td style={{ verticalAlign: "top" }}>
									<table className='responsive-spacing'>
										<tr>
											<td>
												<p style={{ fontSize: "16px" }}>
													<strong>We have an update for you, {firstName}.</strong>
												</p>
											</td>
										</tr>

										{confirmedProducts.length !== 0 && (
											<tr>
												<td>
													<p>
														The following items from your order
														<strong>have been confirmed.</strong>
													</p>
													<hr className='hr-full' style={{ marginTop: 0 }} />
													<br />
													<table
														className='order-tables products'
														width='100%'
														style={{ borderCollapse: "collapse" }}
														cellSpacing='0'
														cellPadding='2'
													>
														<tbody className='right-align'>
															{confirmedProducts.map(item => (
																<tr key={item._id}>
																	<td width='20%'>
																		<a href={`https://www.spacejoy.com/product-view/${item.product._id}`}>
																			<Image src={item?.product?.cdn} width='64' height='64' alt='' />
																		</a>
																	</td>
																	<td width='60%' align='left'>
																		<span>
																			<strong>{item.product.name}</strong>
																		</span>
																		<br />
																		<span>Price: ${item.price}</span>
																		<br />
																		<span>Status: {item.status}</span>
																		<br />

																		{item.comments.length !== 0 && (
																			<span>Updates: {item.comments[item.comments.length - 1].quote} </span>
																		)}
																	</td>
																	<td width='20%'>Qty: {item.quantity}</td>
																</tr>
															))}
														</tbody>
													</table>
													<hr className='hr-full' style={{ marginBottom: "10px" }} />
													<br />
													<p>You’ll receive more updates from us when these products are ready to be shipped.</p>
												</td>
											</tr>
										)}
										{unconfirmedProducts.length !== 0 && (
											<tr>
												<td>
													<p>
														The following items from your orders
														<strong>have not been confirmed.</strong> When you place an order on Spacejoy, we execute a
														back to back order with the retailer. In certain cases, the product goes out of stock before
														our order is registered or it may get cancelled on the retailers end. We apologize for the
														inconvenience.
													</p>
													<hr className='hr-full' style={{ marginTop: "0" }} />
													<br />
													<table
														className='order-tables products'
														width='100%'
														style={{ borderCollapse: "collapse" }}
														cellSpacing='0'
														cellPadding='2'
													>
														<tbody className='right-align'>
															{unconfirmedProducts.map(item => {
																return (
																	<tr key={item._id}>
																		<td width='20%'>
																			<a href={`https://www.spacejoy.com/product-view/${item._id}`}>
																				<Image src={item.product.cdn} width='64' height='64' alt='' />
																			</a>
																		</td>
																		<td width='60%' align='left'>
																			<span>
																				<strong>{item.product.name}</strong>
																			</span>
																			<br />
																			<span>Price: ${item.price}</span>
																			<br />
																			<span>Status: {item.status}</span>
																			<br />
																			{item.return && (
																				<span>
																					Reason:
																					{item.return ? (
																						item.return.reason
																					) : item.comments.length ? (
																						item.comments[0].quote
																					) : (
																						<></>
																					)}
																				</span>
																			)}
																		</td>
																		<td width='20%'>Qty: {item.quantity}</td>
																	</tr>
																);
															})}
														</tbody>
													</table>
													<hr className='hr-full' style={{ marginBottom: "10px" }} />
													<br />
												</td>
											</tr>
										)}
										{cancelledProducts.length !== 0 && (
											<tr>
												<td>
													<p>
														The following items from your order are <strong>cancelled or are out of stock.</strong> When
														you place an order on Spacejoy, we execute a back to back order with the retailer. In
														certain cases, the product goes out of stock before our order is registered or it may get
														cancelled on the retailers end. We apologize for the inconvenience.
													</p>
													<hr className='hr-full' style={{ marginTop: "0" }} />
													<br />
													<table
														className='order-tables products'
														width='100%'
														style={{ borderCollapse: "collapse" }}
														cellSpacing='0'
														cellPadding='2'
													>
														<tbody className='right-align'>
															{cancelledProducts.map(item => {
																return (
																	<tr key={item._id}>
																		<td width='20%'>
																			<a href={`https://www.spacejoy.com/product-view/${item._id}`}>
																				<Image src={item.product.cdn} width='64' height='64' alt='' />
																			</a>
																		</td>
																		<td width='60%' align='left'>
																			<span>
																				<strong>{item.product.name}</strong>
																			</span>
																			<br />
																			<span>Price: ${item.price}</span>
																			<br />
																			<span>Status: {item.status}</span>
																			<br />
																			<span>
																				Reason:
																				{item.cancellation ? (
																					item.cancellation.reason
																				) : item.comments.length ? (
																					item.comments[0].quote
																				) : (
																					<></>
																				)}
																			</span>
																		</td>
																		<td width='20%'>Qty: {item.quantity}</td>
																	</tr>
																);
															})}
														</tbody>
													</table>
													<hr className='hr-full' style={{ marginBottom: "10px" }} />
													<br />
												</td>
											</tr>
										)}
									</table>
								</td>
								<td className='right-align' style={{ verticalAlign: "top" }}>
									<div className='hidden-sm' style={{ paddingRight: "2rem" }}>
										<img
											src='https://res.cloudinary.com/spacejoy/image/upload/c_scale,q_auto,w_350/v1591427030/Email/email-v2/side-image_fd6jla.png'
											alt='Spacejoy'
											width='100'
										/>
									</div>
								</td>
							</tr>
						</table>
					</td>
				</tr>
				<tr>
					<td>
						<table
							cellPadding='0'
							cellSpacing='0'
							style={{
								marginTop: "14px",
								marginBottom: "14px",
								borderSpacing: "7px",
							}}
							className='tables'
						>
							<tbody className='font-sm'>
								<tr>
									<td>
										<div style={{ display: "inline-block" }} className='vr-line'>
											<img
												style={{ paddingLeft: "5px", verticalAlign: "middle" }}
												src='https://res.cloudinary.com/spacejoy/image/upload/c_scale,q_auto,w_60/v1591074326/Email/email-v2/mail_xej5f1.png'
												width='14xp'
												height='14px'
												alt='mail'
											/>
											<span style={{ paddingLeft: "5px", verticalAlign: "middle" }}>
												<a style={{ textDecoration: "none", color: "inherit" }} href='mailto:hello@spacejoy.com'>
													<span>hello@spacejoy.com</span>
												</a>
											</span>
										</div>
										<div style={{ display: "inline-block" }}>
											<img
												style={{ paddingLeft: "5px", verticalAlign: "middle" }}
												src='https://res.cloudinary.com/spacejoy/image/upload/c_scale,q_auto,w_60/v1591074327/Email/email-v2/phone_qa4s40.png'
												width='14xp'
												height='14px'
												alt='phone'
											/>
											<span style={{ paddingLeft: "5px", verticalAlign: "middle" }}>
												<a style={{ textDecoration: "none", color: "inherit" }} href='tel:+1(310)4837722'>
													<span>+1 (310) 483-7722</span>
												</a>
											</span>
										</div>
									</td>
								</tr>
								<tr>
									<td>
										1450 2nd Street, 155 <br />
										Santa Monica, CA 90401
									</td>
								</tr>
								<tr>
									<td>
										<table style={{ color: "#ffffff", marginTop: "5px" }}>
											<tr>
												<td>
													<a
														href='https://www.facebook.com/spacejoyapp?&utm_source=sendgrid&utm_medium=email'
														target='_blank'
														rel='noopener noreferrer'
													>
														<img
															src='https://res.cloudinary.com/spacejoy/image/upload/c_scale,q_auto,w_60/v1590734575/Email/email-v2/facebook_ctbdcq.png'
															alt='facebook'
															className='social-media-logo'
															style={{
																width: "22px",
																height: "22px",
																opacity: 0.6,
																paddingLeft: "1px",
															}}
														/>
													</a>
												</td>
												<td>
													<a
														href='https://www.instagram.com/spacejoyapp?&utm_source=sendgrid&utm_medium=email'
														target='_blank'
														rel='noopener noreferrer'
													>
														<img
															src='https://res.cloudinary.com/spacejoy/image/upload/c_scale,q_auto,w_60/v1590734575/Email/email-v2/instagram_kc7kug.png'
															alt='instagram'
															className='social-media-logo'
															style={{
																width: "22px",
																height: "22px",
																opacity: 0.6,
																paddingLeft: "1px",
															}}
														/>
													</a>
												</td>
												<td>
													<a
														href='https://www.linkedin.com/company/spacejoy?&utm_source=sendgrid&utm_medium=email'
														target='_blank'
														rel='noopener noreferrer'
													>
														<img
															src='https://res.cloudinary.com/spacejoy/image/upload/c_scale,q_auto,w_60/v1590734575/Email/email-v2/linkedin_tznxx1.png'
															className='social-media-logo'
															alt='linkedin'
															style={{
																width: "22px",
																height: "22px",
																opacity: 0.6,
																paddingLeft: "1px",
															}}
														/>
													</a>
												</td>
												<td>
													<a
														href='https://twitter.com/spacejoyapp?&utm_source=sendgrid&utm_medium=email'
														target='_blank'
														rel='noopener noreferrer'
													>
														<img
															src='https://res.cloudinary.com/spacejoy/image/upload/c_scale,q_auto,w_60/v1590734575/Email/email-v2/twitter_bsmh8c.png'
															className='social-media-logo'
															alt='twitter'
															style={{
																width: "22px",
																height: "22px",
																opacity: 0.6,
																paddingLeft: "1px",
															}}
														/>
													</a>
												</td>
												<td>
													<a
														href='https://www.youtube.com/channel/UCLP1JJg_muwRyCJd-gjQvWg?&utm_source=sendgrid&utm_medium=email'
														target='_blank'
														rel='noopener noreferrer'
													>
														<img
															src='https://res.cloudinary.com/spacejoy/image/upload/c_scale,q_auto,w_60/v1590734576/Email/email-v2/youtube_jdtova.png'
															className='social-media-logo'
															alt='youtube'
															style={{
																width: "22px",
																height: "22px",
																opacity: 0.6,
																paddingLeft: "1px",
															}}
														/>
													</a>
												</td>
											</tr>
										</table>
										<hr
											style={{
												width: "25px",
												backgroundColor: "rgba(0, 0, 0, 0.25)",
												boxShadow: "none",
												border: 0,
												height: "1px",
											}}
										/>
									</td>
								</tr>
								<tr>
									<td>
										<a
											style={{ textDecoration: "none", color: "inherit" }}
											href='https://www.spacejoy.com/terms?&utm_source=sendgrid&utm_medium=email'
											target='_blank'
											rel='noopener noreferrer'
										>
											Terms & Conditions
										</a>
									</td>
								</tr>
							</tbody>
						</table>
					</td>
				</tr>
			</tbody>
		</table>
	);
};

export default OrderUpdate;
