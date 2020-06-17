import { getAllPricePackages, getPackageVersionInfo, editPackageApi } from "@api/metaApi";
import { PriceData } from "@customTypes/pricesTypes";
import User, { Role } from "@customTypes/userType";
import { MaxHeightDiv } from "@sections/Dashboard/styled";
import PageLayout from "@sections/Layout";
import { company } from "@utils/config";
import fetcher from "@utils/fetcher";
import IndexPageMeta from "@utils/meta";
import { Col, notification, Typography, Table, Button, Modal, Row, Input, Switch, Spin, Tag, Popconfirm } from "antd";
import { NextPage } from "next";
import Head from "next/head";
import React, { useState, useEffect } from "react";
import { LoudPaddingDiv } from ".";

const { Text, Title } = Typography;

const dataFormatter = (data: PriceData[]) => {
	const formattedData = data.reduce((acc, packageData) => {
		if (acc[packageData.versionNumber]) {
			acc[packageData.versionNumber].children.push({
				_id: packageData._id,
				key: packageData._id,
				slug: packageData.slug,
				versionNumber: packageData.versionNumber,
				price: packageData.price,
				salePrice: packageData.salePrice,
				savings: packageData.savings,
				isSaleActive: packageData.isSaleActive,
			});
		} else {
			acc[packageData.versionNumber] = {
				versionNumber: packageData.versionNumber,
				key: packageData.versionNumber,
				children: [
					{
						_id: packageData._id,
						slug: packageData.slug,
						versionNumber: packageData.versionNumber,
						price: packageData.price,
						salePrice: packageData.salePrice,
						savings: packageData.savings,
						isSaleActive: packageData.isSaleActive,
					},
				],
			};
		}
		return [...acc];
	}, []);
	return formattedData;
};

const PriceManager: NextPage<{
	isServer: boolean;
	authVerification: Partial<User>;
}> = ({ authVerification, isServer }) => {
	const [allPrices, setAllPrices] = useState<PriceData[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const [currentActiveVersion, setCurrentActiveVersion] = useState<number>(null);
	const [editRecord, setEditRecord] = useState<PriceData>(null);

	const fetchPriceData = async (): Promise<void> => {
		setLoading(true);
		const endPoint = `${getAllPricePackages()}?limit=100`;
		try {
			const response = await fetcher({ endPoint, method: "GET" });
			if (response.statusCode <= 300) {
				setAllPrices(dataFormatter(response.data.list));
			} else {
				notification.error({ message: "Failed to get all price packages" });
			}
		} catch (e) {
			notification.error({ message: "Failed to get all price packages" });
		}
		setLoading(false);
	};

	const fetchCurrentActivePackages = async (): Promise<void> => {
		setLoading(true);
		const endPoint = getPackageVersionInfo();

		try {
			const response = await fetcher({ endPoint, method: "GET" });
			if (response.statusCode <= 300) {
				setCurrentActiveVersion(response.data[0].versionNumber);
			} else {
				notification.error({ message: "Failed to fetch Active version" });
			}
		} catch (e) {
			notification.error({ message: "Failed to fetch Active version" });
		}
		setLoading(false);
	};

	const copyAsNewVersion = async (children: Partial<PriceData>[]): Promise<void> => {
		const copyPromiseArray = children.map(packageEntry => {
			return new Promise((resolve, reject) => {
				const endPoint = editPackageApi(packageEntry._id);
				try {
					fetcher({ endPoint, method: "POST", body: { data: {} } }).then(data => {
						resolve(data);
					});
				} catch (e) {
					reject(e);
				}
			});
		});

		await Promise.allSettled(copyPromiseArray);

		fetchPriceData();
	};

	const setAsActive = async (children: Partial<PriceData>[]): Promise<void> => {
		const packagesToActivate = children.map(packageEntry => {
			return {
				key: packageEntry.slug,
				versionNumber: packageEntry.versionNumber,
			};
		});

		const endPoint = getPackageVersionInfo();
		try {
			const response = await fetcher({
				endPoint,
				method: "PUT",
				body: {
					data: {
						options: packagesToActivate,
					},
				},
			});
			if (response.statusCode <= 300) {
				fetchCurrentActivePackages();
			}
		} catch (e) {
			notification.error({ message: "Failed to update active packages" });
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
			sorter: (a, b): number => {
				return a.versionNumber - b.versionNumber;
			},
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
			render: (text): string => {
				if (text === true) {
					return "Yes";
				}
				if (text === false) {
					return "No";
				}
				return "";
			},
			key: "isSaleActive",
		},
		{
			title: "Package status",
			dataIndex: "versionNumber",
			// eslint-disable-next-line react/display-name
			render: (text): JSX.Element => {
				if (text === currentActiveVersion) {
					return <Tag color="green">Active</Tag>;
				}
				return <Tag>Inactive</Tag>;
			},
		},
		{
			displayName: "Action",
			title: "Action",
			key: "action",
			// eslint-disable-next-line react/display-name
			render: (_, record): JSX.Element =>
				record.slug ? (
					<span>
						<Button type="link" onClick={(): void => setEditRecord(record)}>
							Edit
						</Button>
					</span>
				) : (
					<span>
						<Popconfirm
							title="This will create a copy of the packages with new version numbers? Are you sure?"
							onConfirm={(): Promise<void> => copyAsNewVersion(record.children)}
						>
							<Button type="link" onClick={(e): void => e.stopPropagation()}>
								Copy
							</Button>
						</Popconfirm>
						{record.versionNumber !== currentActiveVersion && (
							<Popconfirm
								title="This will mark this version as live prices. Are you sure?"
								onConfirm={(): Promise<void> => setAsActive(record.children)}
							>
								<Button type="link" onClick={(e): void => e.stopPropagation()}>
									Set as Active
								</Button>
							</Popconfirm>
						)}
					</span>
				),
		},
	];

	useEffect(() => {
		fetchPriceData();
		fetchCurrentActivePackages();
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
		setLoading(true);
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
			<Spin spinning={loading}>
				<MaxHeightDiv>
					<LoudPaddingDiv>
						<Col span={24}>
							<Title>Package Manager</Title>
						</Col>
						<Col span={24}>
							<Table dataSource={allPrices} columns={columns} rowKey={(record): string => record._id} />
						</Col>
					</LoudPaddingDiv>
				</MaxHeightDiv>
			</Spin>
			{editRecord && (
				<Modal
					visible
					title="Edit Package"
					onOk={saveRecord}
					onCancel={(): void => setEditRecord(null)}
					okButtonProps={{ loading }}
				>
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
										onChange={(checked): void => onChange({ target: { name: "isSaleActive", value: checked } })}
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
}> => {
	const isServer = !!req;
	const authVerification = {
		name: "",
		role: Role.Guest,
	};
	try {
		return {
			isServer,
			authVerification,
		};
	} catch (e) {
		return {
			isServer,
			authVerification,
		};
	}
};

export default PriceManager;
