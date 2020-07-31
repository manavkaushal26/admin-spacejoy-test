import OrderDelivered from "@components/Email/OrderDelivered";
import OrderShipped from "@components/Email/OrderShipped";
import OrderUpdate from "@components/Email/OrderUpdate";
import { OrderItems } from "@customTypes/ecommerceTypes";
import { SizeAdjustedModal } from "@sections/AssetStore/styled";
import React from "react";

interface EmailPreviewModal {
	firstName: string;
	address: string;
	shippingCharge: number;
	selectedProducts: OrderItems[];
	productTotal: number;
	subTotal: string;
	discount: number;
	amount: number;
	tax: number;
	visible: boolean;
	onOk: () => Promise<void> | void;
	onCancel: () => void;
	type: string;
}

const EmailPreviewModal: React.FC<EmailPreviewModal> = ({
	firstName,
	address,
	shippingCharge,
	selectedProducts,
	productTotal,
	subTotal,
	discount,
	amount,
	tax,
	visible,
	onOk,
	onCancel,
	type,
}) => {
	return (
		<SizeAdjustedModal visible={visible} onOk={onOk} okText='Send Mail' onCancel={onCancel}>
			{type === "delivered" && (
				<OrderDelivered
					firstName={firstName}
					address={address}
					shippingCharge={shippingCharge}
					selectedProducts={selectedProducts}
					productTotal={productTotal}
					subTotal={parseFloat(subTotal)}
					discount={discount}
					amount={amount}
					tax={tax}
				/>
			)}
			{type === "confirmed" && (
				<OrderUpdate
					firstName={firstName}
					address={address}
					shippingCharge={shippingCharge}
					selectedProducts={selectedProducts}
					productTotal={productTotal}
					subTotal={parseFloat(subTotal)}
					discount={discount}
					amount={amount}
					tax={tax}
				/>
			)}
			{type === "shipped" && (
				<OrderShipped
					firstName={firstName}
					address={address}
					shippingCharge={shippingCharge}
					selectedProducts={selectedProducts}
					productTotal={productTotal}
					subTotal={parseFloat(subTotal)}
					discount={discount}
					amount={amount}
					tax={tax}
				/>
			)}
		</SizeAdjustedModal>
	);
};

export default EmailPreviewModal;
