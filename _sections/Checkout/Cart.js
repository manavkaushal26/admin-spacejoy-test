import BenefitList from "@components/BenefitList";
import Card from "@components/Card";
import Divider from "@components/Divider";
import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";

const CartStyled = styled(Card)``;

const CartHeaderStyled = styled.div`
	border-top: 1px solid ${({ theme }) => theme.colors.bg.dark1};
	border-bottom: 1px solid ${({ theme }) => theme.colors.bg.dark1};
	margin: 1rem 0;
`;

const CartHeaderRowStyled = styled.div`
	display: flex;
	div {
		flex: 1;
		&:last-child {
			text-align: right;
		}
		h4 {
			margin: 0.5rem 0;
			&.accent {
				color: ${({ theme }) => theme.colors.accent};
			}
		}
	}
`;

function Cart({ paymentType }) {
	return (
		<CartStyled bg="white">
			<h4>{paymentType === "freeTrial" ? "What you get" : "Order Details"}</h4>
			{paymentType !== "freeTrial" && (
				<CartHeaderStyled>
					<CartHeaderRowStyled>
						<div>
							<h4 className="accent">Bliss</h4>
						</div>
						<div>
							<h4>$49.00</h4>
						</div>
					</CartHeaderRowStyled>
					<CartHeaderRowStyled>
						<div>
							<h4>Total</h4>
						</div>
						<div>
							<h4>$49.00</h4>
						</div>
					</CartHeaderRowStyled>
				</CartHeaderStyled>
			)}
			<BenefitList>
				<BenefitList.Item icon="tick" nature="positive">
					Get {paymentType === "freeTrial" ? "1" : "2"} concept design{paymentType === "freeTrial" ? "" : "s"} in your
					style & Budget
				</BenefitList.Item>
				<BenefitList.Item icon="tick" nature="positive">
					See your home in 3D App
				</BenefitList.Item>
				<BenefitList.Item
					icon={paymentType === "freeTrial" ? "cross" : "tick"}
					nature={paymentType === "freeTrial" ? "negative" : "positive"}
				>
					Give feedback & get revisions
				</BenefitList.Item>
				<BenefitList.Item
					icon={paymentType === "freeTrial" ? "cross" : "tick"}
					nature={paymentType === "freeTrial" ? "negative" : "positive"}
				>
					Track project progress
				</BenefitList.Item>
				<BenefitList.Item
					icon={paymentType === "freeTrial" ? "cross" : "tick"}
					nature={paymentType === "freeTrial" ? "negative" : "positive"}
				>
					Access your designs anywhere, anytime
				</BenefitList.Item>
				<BenefitList.Item
					icon={paymentType === "freeTrial" ? "cross" : "tick"}
					nature={paymentType === "freeTrial" ? "negative" : "positive"}
				>
					Shop products with ease
				</BenefitList.Item>
			</BenefitList>
			<Divider size="xs" />
			<h4 className="accent">Did you know?</h4>
			<p>
				Your are saving <strong>thousands of dollars</strong> on standard interior designer fees by choosing Spacejoy.
			</p>
		</CartStyled>
	);
}

Cart.defaultProps = {
	paymentType: ""
};

Cart.propTypes = {
	paymentType: PropTypes.string
};

export default Cart;
