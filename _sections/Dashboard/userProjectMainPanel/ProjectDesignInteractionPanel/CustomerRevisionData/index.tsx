import { editRevisionFormAPI, getRevisionFormForProjectId } from "@api/projectApi";
import { RevisionForm } from "@customTypes/dashboardTypes";
import { SilentDivider } from "@sections/Dashboard/styled";
import fetcher from "@utils/fetcher";
import { Card, Col, Empty, notification, Row, Select, Typography } from "antd";
import React, { useMemo, useState } from "react";
import RevisionDetails from "../RevisionDetails";
import CommentsDrawer, { CommentList } from "./CommentsDrawer";
import DesignWiseSelectedProductCards from "./DesignWiseSelectedProductCards";
import EditRevisionDataDrawer from "./EditRevisionDataDrawer";
import RequestProductCard from "./RequestProductCard";

const { Text } = Typography;

interface CustomerRevisionData {
	revisionData: RevisionForm;
	updateRevisionData: (revisonData: RevisionForm) => void;
}

const CustomerRevisionData: React.FC<CustomerRevisionData> = ({ revisionData, updateRevisionData }) => {
	const [designId, setSelectedDesignId] = useState<string>(
		revisionData.revisionVersion === 1 ? revisionData.fullDesignList[0]._id : revisionData.revisedDesign._id
	);
	const [editRevison, setEditRevision] = useState<boolean>(false);
	const [commentsDrawerOpen, setCommentsDrawerOpen] = useState<boolean>(false);
	const handleChange = (value): void => {
		setSelectedDesignId(value);
	};

	const toggleEditRevision = (): void => {
		setEditRevision(prevState => !prevState);
	};

	const toggleCommentsDrawer = (): void => {
		setCommentsDrawerOpen(prevState => !prevState);
	};

	const onSave = async (data?: Partial<RevisionForm>): Promise<void> => {
		const endPoint = editRevisionFormAPI(revisionData.project);
		const body = {
			...data,
		};
		try {
			const response = await fetcher({ endPoint, body, method: "PUT" });
			if (response.statusCode < 300) {
				updateRevisionData({
					...revisionData,
					...response.data,
				});
				notification.success({
					key: "success",
					message: "Updated Revision Form",
				});
			} else {
				notification.error({ message: "Failed to Update revision form" });
			}
		} catch (e) {
			notification.error({ message: "Failed to Update revision form" });
		}
	};

	const deleteCard = (id): void => {
		const updatedList = revisionData.requestedProducts.filter(product => {
			return product._id !== id;
		});
		onSave({ requestedProducts: updatedList });
	};

	const authors = useMemo(() => Array.from(new Set(revisionData.comments.map(comment => comment.authorName))), [
		revisionData,
	]);

	return (
		<>
			<Row gutter={[8, 16]}>
				<Col span={24}>
					<RevisionDetails revisionData={revisionData} toggleEditRevision={toggleEditRevision} />
				</Col>
				<Col span={24}>
					<SilentDivider />
				</Col>
				<Col span={24}>
					<Card title="Customer feedback on Designs">
						<CommentList comments={revisionData.comments} authors={authors} />
					</Card>
				</Col>
				<Col span={24}>
					<Row gutter={[16, 16]} style={{ position: "relative" }}>
						<Col>
							<Card
								title={
									<Row type="flex" align="middle" gutter={[8, 8]}>
										<Col>
											<Text strong>Products shortlisted by customer from</Text>
										</Col>
										<Col>
											<Select onChange={handleChange} value={designId}>
												{revisionData.fullDesignList
													.filter(design => !design.name.toLowerCase().includes("revision"))
													.map(design => {
														return (
															<Select.Option key={design._id} value={design._id}>
																{design.name}
															</Select.Option>
														);
													})}
											</Select>
										</Col>
									</Row>
								}
							>
								<Col span={24}>
									<Row type="flex" gutter={[8, 8]}>
										<DesignWiseSelectedProductCards
											designId={designId}
											revisionRetainedAssets={revisionData.retainedAssets}
										/>
									</Row>
								</Col>
							</Card>
						</Col>
						<Col span={24}>
							<Row gutter={[8, 16]}>
								<Col span={24}>
									<Text strong>Retained Products</Text>
								</Col>
								<Col span={24}>
									<Row gutter={[8, 8]}>
										{revisionData?.requestedProducts && revisionData.requestedProducts.length ? (
											revisionData.requestedProducts.map(requestedStore => {
												return (
													<Col key={requestedStore._id} span={24}>
														<RequestProductCard
															designId={revisionData.revisedDesign._id}
															url={requestedStore.url}
															id={requestedStore._id}
															deleteCard={deleteCard}
															comment={requestedStore.comment}
														/>
													</Col>
												);
											})
										) : (
											<Empty description="No new products requested" />
										)}
									</Row>
								</Col>
							</Row>
						</Col>
					</Row>
				</Col>
			</Row>
			<EditRevisionDataDrawer
				open={editRevison}
				toggleDrawer={toggleEditRevision}
				revisionData={revisionData}
				updateRevisonData={updateRevisionData}
			/>

			<CommentsDrawer
				open={commentsDrawerOpen}
				toggleDrawer={toggleCommentsDrawer}
				revisionData={revisionData}
				updateRevisonData={updateRevisionData}
			/>
		</>
	);
};

export default CustomerRevisionData;
