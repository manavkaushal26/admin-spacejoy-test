import { editPackageApi } from "@api/metaApi";
import { CapitalizedText } from "@components/CommonStyledComponents";
import InputField from "@components/Inputs/InputField";
import { DetailedPriceData } from "@customTypes/pricesTypes";
import fetcher from "@utils/fetcher";
import { Button, Card, Col, Drawer, Input, notification, Row, Spin, Switch, Typography } from "antd";
import React, { useEffect, useState } from "react";
import MultiInputField from "../collections/MultiInputField";

const { Text } = Typography;

interface PackageModifierModal {
	editRecordId: string;
	toggleDrawer: () => void;
	fetchPriceData: () => void;
}

const PackageModifierModal: React.FC<PackageModifierModal> = ({ editRecordId, toggleDrawer, fetchPriceData }) => {
	const [editPackage, setEditPackage] = useState<DetailedPriceData>(null);
	const [loading, setLoading] = useState<boolean>(false);

	const [openIncludedFeatures, setOpenIncludedFeatures] = useState<boolean>();
	const [openExcludedFeatures, setOpenExcludedFeatures] = useState<boolean>();

	const fetchAndPopulatePackage = async (): Promise<void> => {
		const endPoint = `${editPackageApi(editRecordId)}`;
		setLoading(true);
		try {
			const response = await fetcher({ endPoint, method: "GET" });
			if (response.statusCode <= 300) {
				setEditPackage(response.data);
			} else {
				notification.error({ message: "Failed to load package" });
			}
		} catch (e) {
			notification.error({ message: "Failed to load package" });
		}
		setLoading(false);
	};

	const toggleFeatureDrawer = (type: "included" | "excluded"): void => {
		if (type === "included") {
			setOpenIncludedFeatures(prevState => !prevState);
		} else {
			setOpenExcludedFeatures(prevState => !prevState);
		}
	};

	const onChange = (name, value): void => {
		if (name.split(".").length === 2) {
			const nameSplit = name.split(".");
			setEditPackage({
				...editPackage,
				[nameSplit[0]]: {
					...editPackage[nameSplit[0]],
					[nameSplit[1]]: value,
				},
			});
		} else {
			setEditPackage({
				...editPackage,
				[name]: value,
			});
		}
	};

	const saveRecord = async (): Promise<void> => {
		setLoading(true);
		if (editPackage?.slug !== "") {
			const endPoint = editPackageApi(editPackage._id);
			try {
				const response = await fetcher({ endPoint, method: "PUT", body: { data: editPackage } });
				if (response.statusCode <= 300) {
					fetchPriceData();
					setEditPackage(response.data);
				} else {
					notification.error({
						message: "There was an error updating package",
						description: response.message || response.data,
					});
				}
			} catch (e) {
				notification.error({ message: "Failed to update packages" });
			}
		} else {
			notification.error({ message: "Missing important fields" });
		}
		setLoading(false);
	};

	useEffect(() => {
		setEditPackage(prevState => ({
			...prevState,
			savings: {
				label: "You Save",
				inAmount: prevState?.price?.value - prevState?.salePrice?.value,
				inPercent: parseInt(
					(((prevState?.price?.value - prevState?.salePrice?.value) / prevState?.price?.value) * 100).toFixed(0),
					10
				),
			},
		}));
	}, [editPackage?.price?.value, editPackage?.salePrice?.value]);

	useEffect(() => {
		if (editRecordId) {
			fetchAndPopulatePackage();
		}
	}, [editRecordId]);

	return (
		<>
			<Drawer width={360} visible={!!editRecordId} title='Edit Package' onClose={toggleDrawer}>
				<Spin spinning={loading}>
					<Row gutter={[8, 8]}>
						<Col span={24}>
							<CapitalizedText strong>{editPackage?.slug} Package Details</CapitalizedText>
						</Col>
						<Col span={24}>
							<Card size='small'>
								<Row gutter={[4, 4]}>
									<Col span={24}>
										<InputField onChange={onChange} name='slug' label='Slug' value={editPackage?.slug} />
									</Col>
									<Col span={24}>
										<InputField
											onChange={onChange}
											name='description'
											label='Description'
											value={editPackage?.description}
										/>
									</Col>
									<Col span={24}>
										<InputField
											onChange={onChange}
											name='price.label'
											label='Actual Price Label'
											value={editPackage?.price?.label}
										/>
									</Col>
									<Col span={24}>
										<InputField
											onChange={onChange}
											name='price.value'
											label='Price'
											value={editPackage?.price?.value}
										/>
									</Col>
									<Col span={24}>
										<InputField
											onChange={onChange}
											name='salePrice.label'
											label='Sale Label'
											value={editPackage?.salePrice?.label}
										/>
									</Col>
									<Col span={24}>
										<InputField
											onChange={onChange}
											name='salePrice.value'
											label='Sale Price'
											value={editPackage?.salePrice?.value}
										/>
									</Col>
									<Col span={24}>
										<Row>
											<Col span={24}>
												<Text strong>Savings</Text>
											</Col>
											<Col span={24}>
												<Row gutter={[4, 4]}>
													<Col span={12}>
														<Input prefix='$' disabled name='savings.value' value={editPackage?.savings?.inAmount} />
													</Col>
													<Col span={12}>
														<Input prefix='%' disabled name='savings.value' value={editPackage?.savings?.inPercent} />
													</Col>
												</Row>
											</Col>
										</Row>
									</Col>
									<Col span={24}>
										<InputField
											onChange={onChange}
											name='turnAroundTime'
											label='Turn Around time'
											value={editPackage?.turnAroundTime}
										/>
									</Col>
								</Row>
							</Card>
						</Col>
						<Col span={24}>
							<CapitalizedText strong>{editPackage?.slug} Revision Details</CapitalizedText>
						</Col>
						<Col span={24}>
							<Card size='small'>
								<Row>
									<Col span={24}>
										<InputField
											onChange={onChange}
											name='revisionMeta.maxRevisionsAllowed'
											label='Max revisons in package'
											value={editPackage?.revisionMeta?.maxRevisionsAllowed}
										/>
									</Col>
									<Col span={24}>
										<Row>
											<InputField
												onChange={onChange}
												name='revisionMeta.maxRevisionTat'
												label='Max Revision TAT'
												value={editPackage?.revisionMeta?.maxRevisionTat}
											/>
										</Row>
									</Col>
									<Col span={24}>
										<Row>
											<InputField
												onChange={onChange}
												name='revisionMeta.minRevisionTat'
												label='Min Revision TAT'
												value={editPackage?.revisionMeta?.minRevisionTat}
											/>
										</Row>
									</Col>
									<Col span={24}>
										<Row>
											<InputField
												onChange={onChange}
												name='revisionMeta.maxProductRequestsAllowed'
												label='Max Product requests'
												value={editPackage?.revisionMeta?.maxProductRequestsAllowed}
											/>
										</Row>
									</Col>
								</Row>
							</Card>
						</Col>
						<Col span={24}>
							<Card size='small'>
								<Row gutter={[4, 4]}>
									<Col span={24}>
										<Text strong>Features</Text>
									</Col>
									<Col span={24}>
										<Button type='primary' block onClick={(): void => toggleFeatureDrawer("included")}>
											Edit Included Features
										</Button>
									</Col>
									<Col span={24}>
										<Button type='primary' block onClick={(): void => toggleFeatureDrawer("excluded")}>
											Edit Excluded Features
										</Button>
									</Col>
								</Row>
							</Card>
						</Col>
						<Col span={24}>
							<Card size='small'>
								<Row>
									<Col span={24}>
										<Text strong>Is Sale Active?</Text>
									</Col>
									<Col span={24}>
										<Switch
											onChange={(checked): void => onChange("isSaleActive", checked)}
											checked={editPackage?.isSaleActive}
											checkedChildren='Yes'
											unCheckedChildren='No'
										/>
									</Col>
								</Row>
							</Card>
						</Col>

						<Col span={24}>
							<Row justify='end'>
								<Button loading={loading} type='primary' onClick={saveRecord}>
									Save
								</Button>
							</Row>
						</Col>
					</Row>
				</Spin>
				<Drawer
					destroyOnClose
					title='Included features'
					width={360}
					visible={openIncludedFeatures}
					onClose={(): void => toggleFeatureDrawer("included")}
				>
					<MultiInputField list={editPackage?.includedFeatures || []} onChange={onChange} name='includedFeatures' />
				</Drawer>
				<Drawer
					destroyOnClose
					title='Excluded features'
					width={360}
					visible={openExcludedFeatures}
					onClose={(): void => toggleFeatureDrawer("excluded")}
				>
					<MultiInputField list={editPackage?.excludedFeatures || []} onChange={onChange} name='excludedFeatures' />
				</Drawer>
			</Drawer>
		</>
	);
};

export default PackageModifierModal;
