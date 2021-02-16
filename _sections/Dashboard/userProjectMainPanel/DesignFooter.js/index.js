import fetcher from "@utils/fetcher";
import { Button, Col, Input, notification, Row, Select, Switch } from "antd";
import React, { useEffect, useState } from "react";
export default function index({ designData }) {
	const [category, setCategory] = useState("");
	const [customName, setCustomName] = useState("");
	const [isActive, setIsActive] = useState(false);
	const [footerData, setFooterData] = useState([]);

	const fetchLatestData = async () => {
		const resData = await fetcher({ endPoint: `/v1/footer/model/${designData?._id}`, method: "GET" });
		const { data, statusCode } = resData;
		if (statusCode && statusCode <= 201) {
			setFooterData(data?.data);
		}
	};

	useEffect(() => {
		fetchLatestData();
	}, []);

	useEffect(() => {
		setCategory(footerData[0]?.footerCategory);
		setCustomName(footerData[0]?.footerCustomName);
		setIsActive(footerData[0]?.active);
	}, [footerData]);

	const handleCategory = value => {
		setCategory(value);
	};

	const handleCustomName = e => {
		setCustomName(e.target.value);
	};

	const handleIsActive = value => {
		setIsActive(value);
	};

	const modifyFooter = async type => {
		const payload =
			type === "create"
				? {
						active: isActive,
						document: designData?._id,
						documentModel: designData?.designImages ? "Design" : "Collection",
						footerCategory: category,
						footerCustomName: customName,
				  }
				: {
						active: isActive,
						footerCategory: category,
						footerCustomName: customName,
				  };
		const method = type === "create" ? "POST" : "PUT";
		const endPoint = type === "create" ? "/v1/footer" : `/v1/footer/model/${designData?._id}`;
		const resData = await fetcher({ endPoint: endPoint, body: payload, method: method });
		const { statusCode } = resData;
		if (statusCode && statusCode <= 201) {
			notification.success({ message: "Successfully Created/Updated" });
			fetchLatestData();
		} else {
			notification.error({ message: "Creation Failed. Please try again." });
		}
	};

	return (
		<div>
			<Row gutter={[8, 8]}>
				<Col span={8}>
					<Select showSearch onChange={value => handleCategory(value)} style={{ width: "100%" }} value={category}>
						<Select.Option value='special'>Special</Select.Option>
						<Select.Option value='featured'>Featured</Select.Option>
					</Select>
				</Col>
				<Col span={8}>
					<Input onChange={handleCustomName} value={customName} />
				</Col>
				<Col span={8}>
					<Switch checked={isActive} onChange={handleIsActive} />
				</Col>
				<Col span={8}>
					<Button onClick={() => modifyFooter(footerData.length ? "update" : "create")}>
						{footerData.length ? "Update" : "Create"}
					</Button>
				</Col>
			</Row>
		</div>
	);
}
