import { getAllPricePackages, getPackageVersionInfo, editPackageApi } from "@api/metaApi";
import { PriceData } from "@customTypes/pricesTypes";
import User, { Role } from "@customTypes/userType";
import { MaxHeightDiv } from "@sections/Dashboard/styled";
import PageLayout from "@sections/Layout";
import { company } from "@utils/config";
import fetcher from "@utils/fetcher";
import IndexPageMeta from "@utils/meta";
import { Col, notification, Typography, Table, Button, Modal, Row, Input, Switch } from "antd";
import { NextPage } from "next";
import Head from "next/head";
import React, { useState, useEffect } from "react";
import { EDEADLK } from "constants";
import { LoudPaddingDiv } from ".";

const { Text, Title } = Typography;

const PriceManager: NextPage<{
	isServer: boolean;
	authVerification: Partial<User>;
	currentlyActiveVersions: Partial<PriceData>[];
}> = ({ authVerification, isServer, currentlyActiveVersions }) => {
	const [allPrices, setAllPrices] = useState<PriceData[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const [currentlyActivePackages, setCurrentlyActivePackages] = useState<Partial<PriceData>[]>([]);
	const [editRecord, setEditRecord] = useState<PriceData>(null);
	useEffect(() => {
		setCurrentlyActivePackages(currentlyActiveVersions);
	}, [currentlyActiveVersions]);

	const fetchPriceData = async (): Promise<void> => {
		const endPoint = getAllPricePackages();

		try {
			const response = await fetcher({ endPoint, method: "GET" });
			if (response.statusCode <= 300) {
				setAllPrices(response.data.list);
			} else {
				notification.error({ message: "Failed to get all price packages" });
			}
		} catch (e) {
			notification.error({ message: "Failed to get all price packages" });
		}
	};

	const columns = [
		{
			title: "Name",
			dataIndex: "slug",
			key: "slug",
		},
		{
			title: "Version Number",
			dataIndex: "versionNumber",
			key: "versionNumber",
		},
		{
			title: "Original Price",
			dataIndex: "price.value",
			key: "price.value",
		},
		{
			title: "Sale Price",
			dataIndex: "salePrice.value",
			key: "salePrice.value",
		},
		{
			title: "Is sale Live?",
			dataIndex: "isSaleActive",
			render: (text, index) => {
				if (text === true) {
					return "Yes";
				}
				return "No";
			},
			key: "isSaleActive",
		},
		{
			displayName: "Action",
			title: "Action",
			key: "action",
			// eslint-disable-next-line react/display-name
			render: (_, record): JSX.Element => (
				<span>
					<Button type="link" onClick={(): void => setEditRecord(record)}>
						Edit
					</Button>
				</span>
			),
		},
	];

	useEffect(() => {
		fetchPriceData();
	}, []);

	const onChange = (e): void => {
		const {
			target: { name, value },
		} = e;
		if (name.split(".").length === 2) {
			const nameSplit = name.split(".");
			setEditRecord({
				...editRecord,
				[nameSplit[0]]: {
					...editRecord[nameSplit[0]],
					[nameSplit[1]]: value,
				},
			});
		} else {
			setEditRecord({
				...editRecord,
				[name]: value,
			});
		}
	};

	const saveRecord = async (): Promise<void> => {
		const endPoint = editPackageApi(editRecord._id);
		try {
			const response = await fetcher({ endPoint, method: "PUT", body: { data: editRecord } });
			if (response.statusCode <= 300) {
				fetchPriceData();
				setEditRecord(null);
			} else {
				notification.error({ message: "There was an error updating package", description: response.message });
			}
		} catch (e) {
			notification.error({ message: "Failed to update packages" });
		}
	};

	return (
		<PageLayout pageName="Price Manager" isServer={isServer} authVerification={authVerification}>
			<Head>
				<title>Package Manager | {company.product}</title>
				{IndexPageMeta}
			</Head>
			<MaxHeightDiv>
				<LoudPaddingDiv>
					<Col span={24}>
						<Title>Package Manager</Title>
					</Col>
					<Col span={24}>
						<Table dataSource={allPrices} columns={columns} />
					</Col>
				</LoudPaddingDiv>
			</MaxHeightDiv>
			{editRecord && (
				<Modal visible title="Edit Package" onOk={saveRecord} onCancel={(): void => setEditRecord(null)}>
					<Row gutter={[8, 8]}>
						<Col>
							<Row>
								<Col>
									<Text>Slug</Text>
								</Col>
								<Col>
									<Input onChange={onChange} name="slug" value={editRecord.slug} />
								</Col>
							</Row>
						</Col>
						<Col>
							<Row>
								<Col>
									<Text>Price</Text>
								</Col>
								<Col>
									<Input onChange={onChange} name="price.value" value={editRecord.price.value} />
								</Col>
							</Row>
						</Col>
						<Col>
							<Row>
								<Col>
									<Text>Sale Price</Text>
								</Col>
								<Col>
									<Input onChange={onChange} name="salePrice.value" value={editRecord.salePrice.value} />
								</Col>
							</Row>
						</Col>
						<Col>
							<Row>
								<Col>
									<Text>Is Sale Active?</Text>
								</Col>
								<Col>
									<Switch
										onChange={checked => onChange({ target: { name: "isSaleActive", value: checked } })}
										checked={editRecord.isSaleActive}
										checkedChildren="Yes"
										unCheckedChildren="No"
									/>
								</Col>
							</Row>
						</Col>
					</Row>
				</Modal>
			)}
		</PageLayout>
	);
};
PriceManager.getInitialProps = async ({
	req,
}): Promise<{
	isServer: boolean;
	authVerification: Partial<User>;
	currentlyActiveVersions: Partial<PriceData>[];
}> => {
	const isServer = !!req;
	const authVerification = {
		name: "",
		role: Role.Guest,
	};
	const endPoint = getPackageVersionInfo();
	try {
		const currentlyActivePackages = await fetcher({ endPoint, method: "GET" });
		return {
			isServer,
			authVerification,
			currentlyActiveVersions: currentlyActivePackages.data,
		};
	} catch (e) {
		return {
			isServer,
			authVerification,
			currentlyActiveVersions: [],
		};
	}
};

export default PriceManager;
