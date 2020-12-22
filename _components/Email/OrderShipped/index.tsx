import Image from "@components/Image";
import { OrderItems } from "@customTypes/ecommerceTypes";
import React from "react";

interface OrderShipped {
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

const OrderShipped: React.FC<OrderShipped> = ({
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
	return (
		<table
			width='100%'
			cellPadding='0'
			cellSpacing='0'
			className='main-wrapper'
			style={{
				fontFamily:
					" Open Sans, -apple-system, BlinkMacSystemFont, Roboto,Helvetica Neue, Helvetica, Arial, sans-serif",
				color: "rgba(0, 0, 0, 0.85)",
			}}
		>
			<tbody className='font-md'>
				<tr>
					<td style={{ margin: "3rem 0" }}>
						<table
							style={{
								margin: "auto",
								borderSpacing: "0px",
								boxShadow: "0 3px 6px rgba(0, 0, 0, 0.02), 0 3px 6px rgba(0, 0, 0, 0.035)",
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
													<strong>We’ve got exciting news, {firstName}!</strong>
												</p>
												<p>Some items from your order are out of the door and on their way to you.</p>
											</td>
										</tr>
										<tr>
											<td>
												<a
													style={{
														color: "#ffffff",
														textDecoration: "none",
														fontWeight: "bold",
													}}
													href='https://spacejoy.com/orders/history'
													target='_blank'
													rel='noopener noreferrer'
												>
													<div
														style={{
															background: "linear-gradient(135deg,rgb(245, 41, 110) 0%,rgb(243, 156, 18) 100% )",
															letterSpacing: "1px",
															padding: "7px 24px",
															color: "#ffffff",
															borderRadius: "3px",
															textAlign: "center",
															display: "inline-block",
														}}
													>
														Track Package
													</div>
												</a>
											</td>
										</tr>
										<tr>
											<td>
												<br />
												<p>
													You can find the updated tracking information in your dashboard, under the “My Orders” tab.
												</p>
												<hr className='hr-full' style={{ marginBottom: "10px" }} />
												<p className='heading ' style={{ width: "50%" }}>
													<strong>Shipped to:</strong>
												</p>
												<p style={{ width: "50%" }}>
													{firstName}, {address}
													<br />
												</p>
											</td>
										</tr>
										<tr>
											<td>
												<table
													className='order-tables products'
													width='100%'
													style={{ borderCollapse: "collapse" }}
													cellSpacing='0'
													cellPadding='2'
												>
													<tbody className='right-align'>
														{selectedProducts.map(item => (
															<tr key={item._id}>
																<td width='20%'>
																	<a href={`https://www.spacejoy.com/product-view/${item.product._id}`}>
																		<Image
																			src={`w_64,h_64,c_fill/${item?.product?.cdn}`}
																			width='64'
																			height='64'
																			alt=''
																		/>
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
																		<span>Live Update: {item.comments[item.comments.length - 1].quote}</span>
																	)}
																</td>
																<td width='20%'>Qty: {item.quantity}</td>
															</tr>
														))}
													</tbody>
												</table>
												<hr className='hr-full' style={{ marginBottom: "10px" }} />
												<br />
											</td>
										</tr>

										<tr>
											<td>
												<p className='heading'>
													<strong>Billing Summary </strong>{" "}
												</p>
												<div
													className=''
													style={{
														display: "inline-block",
														width: "38%",
														verticalAlign: "top",
													}}
												>
													<p>
														<strong>Billing Address:</strong>
														<br />
														{address}
														<br />
													</p>
												</div>
												<div
													className=''
													style={{
														display: "inline-block",
														width: "58%",
													}}
												>
													<table className='bill-summary' width='100%' cellSpacing='0'>
														<tr>
															<td width='60%'>Estimated Product Total:</td>
															<td>${productTotal}</td>
														</tr>
														<tr>
															<td width='60%'>Estimated Shipping:</td>
															<td>${shippingCharge}</td>
														</tr>
														<tr>
															<td width='60%'>
																Estimated Tax:
																<br />
															</td>
															<td>${tax}</td>
														</tr>
														<tr>
															<td width='60%' style={{ paddingTop: "10px" }}>
																<strong>Estimated Sub Total:</strong>
															</td>
															<td style={{ paddingTop: "10px" }}>
																<strong> ${subTotal}</strong>
															</td>
														</tr>
														<tr>
															<td width='60%'>
																<strong>Discount:</strong>
															</td>
															<td>
																<strong> ${discount}</strong>
															</td>
														</tr>
														<tr>
															<td width='60%'>
																<strong>Estimated Total:</strong>
															</td>
															<td>
																<strong> ${amount}</strong>
															</td>
														</tr>
													</table>
												</div>
											</td>
										</tr>
										<tr>
											<td>
												<p>
													If you have additional questions for us please write to
													<a
														style={{ color: "#f5296e", textDecoration: "none" }}
														href='mailto:hello@spacejoy.com'
														target='_blank'
														rel='noopener noreferrer'
													>
														hello@spacejoy.com
													</a>
													and we’ll be with you right away.
												</p>
											</td>
										</tr>
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

export default OrderShipped;
