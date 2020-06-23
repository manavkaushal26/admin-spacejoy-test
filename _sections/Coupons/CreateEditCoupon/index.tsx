import React, { useState } from "react";
import { Drawer, Row, Col } from "antd";
import { BasicCoupon } from "@customTypes/couponTypes";
import InputField from "@components/Inputs/InputField";

interface CreateEditCoupon {
	couponData: BasicCoupon;
	modifyCouponValue: (value: BasicCoupon) => void;
	toggleCreateEditCoupon: () => void;
	createEditCouponVisible: boolean;
}

const CreateEditCoupon: React.FC<CreateEditCoupon> = ({
	couponData,
	modifyCouponValue,
	toggleCreateEditCoupon,
	createEditCouponVisible,
}) => {
	const [coupon, setCoupon] = useState<Partial<BasicCoupon>>({});

	const onChange = (name, value) => {
		if (name.split(".").length === 2) {
			const nameSplit = name.split(".");

			setCoupon({
				[nameSplit[0]]: {
					[nameSplit[1]]: value,
				},
			});
			return;
		}
		setCoupon({
			[name]: value,
		});
	};

	return (
		<Drawer visible={createEditCouponVisible || true} title="Coupon">
			<Row>
				<Col>
					<InputField onChange={onChange} value={coupon.title} name="title" label="Title" />
				</Col>
				<Col>
					<InputField onChange={onChange} value={coupon.title} name="title" label="Title" />
				</Col>
				<Col>
					<InputField onChange={onChange} value={coupon.title} name="title" label="Title" />
				</Col>
			</Row>
		</Drawer>
	);
};

export default CreateEditCoupon;
