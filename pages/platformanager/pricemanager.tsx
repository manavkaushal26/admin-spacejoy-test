import { editPackageApi, getAllPricePackages, getPackageVersionInfo } from "@api/metaApi";
import { PriceData } from "@customTypes/pricesTypes";
import User, { Role } from "@customTypes/userType";
import { MaxHeightDiv } from "@sections/Dashboard/styled";
import PageLayout from "@sections/Layout";
import PackageModifierModal from "@sections/PriceManager/PackageModifierModal";
import { withAuthVerification } from "@utils/auth";
import { company } from "@utils/config";
import fetcher from "@utils/fetcher";
import IndexPageMeta from "@utils/meta";
import { Button, Col, notification, Popconfirm, Spin, Table, Tag, Typography } from "antd";
import { NextPage } from "next";
import Head from "next/head";
import React, { useEffect, useState } from "react";
import { LoudPaddingDiv } from ".";

const { Title } = Typography;

const dataFormatter = (data: PriceData[]) => {
	const formattedData = data.reduce((acc, packageData) => {
		if (acc[packageData.versionNumber]) {
			acc[packageData.versionNumber].children.push({
				versionNumber: packageData.versionNumber,

				_id: packageData._id,
				key: packageData._id,
				slug: packageData.slug,
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
						versionNumber: packageData.versionNumber,
						_id: packageData._id,
						slug: packageData.slug,
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

		await Promise.all(copyPromiseArray);

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
			render: (text, record): JSX.Element => {
				if (!record._id) {
					if (text === currentActiveVersion) {
						return <Tag color='green'>Active</Tag>;
					}
					return <Tag>Inactive</Tag>;
				}
				return <></>;
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
						<Button type='link' onClick={(): void => setEditRecord(record)}>
							Edit
						</Button>
					</span>
				) : (
					<span>
						<Popconfirm
							title='This will create a copy of the packages with new version numbers? Are you sure?'
							onConfirm={(): Promise<void> => copyAsNewVersion(record.children)}
						>
							<Button type='link' onClick={(e): void => e.stopPropagation()}>
								Copy
							</Button>
						</Popconfirm>
						{record.versionNumber !== currentActiveVersion && (
							<Popconfirm
								title='This will mark this version as live prices. Are you sure?'
								onConfirm={(): Promise<void> => setAsActive(record.children)}
							>
								<Button type='link' onClick={(e): void => e.stopPropagation()}>
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

	useEffect(() => {
		if (editRecord) {
			if (editRecord.price.value && editRecord.salePrice.value) {
				setEditRecord({
					...editRecord,
					savings: {
						...editRecord.savings,
						inAmount: editRecord.price.value - editRecord.salePrice.value,
						inPercent: parseFloat(
							(((editRecord.price.value - editRecord.salePrice.value) / editRecord.price.value) * 100).toFixed(0)
						),
					},
				});
			}
		}
	}, [editRecord?.salePrice?.value, editRecord?.price?.value]);

	const toggleDrawer = (): void => {
		setEditRecord(null);
	};

	return (
		<PageLayout pageName='Price Manager' isServer={isServer} authVerification={authVerification}>
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
							<Table
								loading={loading}
								dataSource={allPrices}
								columns={columns}
								rowKey={(record): string => record._id}
							/>
						</Col>
					</LoudPaddingDiv>
				</MaxHeightDiv>
			</Spin>
			<PackageModifierModal
				editRecordId={editRecord?._id}
				toggleDrawer={toggleDrawer}
				fetchPriceData={fetchPriceData}
			/>
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

export default withAuthVerification(PriceManager);
