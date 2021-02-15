import fetcher from "@utils/fetcher";
import { Button, Col, Input, Row, Select, Switch } from "antd";
import React, { useState } from "react";
export default function index({ data }) {
	const [category, setCategory] = useState("");
	const [customName, setCustomName] = useState("");
	const [isActive, setIsActive] = useState(false);
	const endPoint = "/api/v1/footer";

	const fetchLatestData = async () => {
		const resData = await fetcher({ endPoint: `${endPoint}/model/id`, method: "GET" });
		const { data, statusCode } = resData;
		if (statusCode && statusCode <= 201) {
			return data;
		}
	};

	const handleCategory = value => {
		setCategory(value);
	};

	const handleCustomName = e => {
		setCustomName(e.target.value);
	};

	const handleIsActive = value => {
		setIsActive(value);
	};

	const createFooter = async () => {
		const payload = {
			active: isActive,
			document: data?._id,
			documentModel: data?.designImages ? "Design" : "Collection",
			footerCategory: category,
			footerCustomName: customName,
		};
		const resData = await fetcher({ endPoint: endPoint, body: payload, method: "POST" });
		const { data, statusCode } = resData;
		if (statusCode && statusCode <= 201) {
			return data;
		}
	};

	return (
		<div>
			<Row gutter={[8, 8]}>
				<Col span={8}>
					<Select showSearch onChange={value => handleCategory(value)} style={{ width: "100%" }}>
						<Select.Option value='special'>Special</Select.Option>
						<Select.Option value='featured'>Featured</Select.Option>
					</Select>
				</Col>
				<Col span={8}>
					<Input onChange={handleCustomName} />
				</Col>
				<Col span={8}>
					<Switch checked={isActive} onChange={handleIsActive} />
				</Col>
				<Col span={8}>
					<Button onClick={createFooter} />
				</Col>
			</Row>
		</div>
	);
}
