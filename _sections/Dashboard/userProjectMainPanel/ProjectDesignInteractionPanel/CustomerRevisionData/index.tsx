import { editRevisionFormAPI } from "@api/projectApi";
import { RevisionForm, HumanizeMode, DisplayDIYStatus, DisplayDARStatus } from "@customTypes/dashboardTypes";
import { SilentDivider } from "@sections/Dashboard/styled";
import fetcher from "@utils/fetcher";
import { Button, Col, notification, Radio, Row, Typography, Empty } from "antd";
import React, { useMemo, useState } from "react";
import DesignWiseSelectedProductCards from "./DesignWiseSelectedProductCards";
import EditRevisionDataDrawer from "./EditRevisionDataDrawer";
import RequestProductCard from "./RequestProductCard";
import CommentsDrawer from "./CommentsDrawer";

const { Text, Title } = Typography;

interface CustomerRevisionData {
	revisionData: RevisionForm;
	updateRevisionData: (revisonData: RevisionForm) => void;
}

const CustomerRevisionData: React.FC<CustomerRevisionData> = ({ revisionData, updateRevisionData }) => {
	const [designId, setSelectedDesignId] = useState<string>(revisionData.fullDesignList[0]._id);
	const [editRevison, setEditRevision] = useState<boolean>(false);
	const [commentsDrawerOpen, setCommentsDrawerOpen] = useState<boolean>(false);

	const handleChange = (e): void => {
		const {
			target: { value },
		} = e;
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

	return (
		<>
			<Row gutter={[8, 16]}>
				<Col span={24}>
					<Row type="flex" justify="end" gutter={[4, 4]}>
						<Col>
							<Button onClick={toggleEditRevision} block type="danger">
								Edit Revision Form
							</Button>
						</Col>
						<Col>
							<Button onClick={toggleCommentsDrawer} block type="primary">
								Open Chat
							</Button>
						</Col>
					</Row>
				</Col>
				<Col span={24}>
					<SilentDivider />
				</Col>
				<Col span={24}>
					<Row gutter={[16, 16]} style={{ position: "relative" }}>
						<Col sm={24} lg={16}>
							<Row gutter={[16, 16]}>
								<Col span={24}>
									<Text strong>Retained Products</Text>
								</Col>
								<Col span={24}>
									<Row type="flex" justify="center">
										<Radio.Group value={designId} onChange={handleChange}>
											{revisionData.fullDesignList.map(design => {
												return (
													<Radio.Button key={design._id} value={design._id}>
														{design.name}
													</Radio.Button>
												);
											})}
										</Radio.Group>
									</Row>
								</Col>
								<Col span={24}>
									<Row type="flex" gutter={[8, 8]}>
										<DesignWiseSelectedProductCards
											designId={designId}
											revisionRetainedAssets={revisionData.retainedAssets}
										/>
									</Row>
								</Col>
							</Row>
						</Col>
						<Col sm={24} lg={8} style={{ position: "sticky", top: 0 }}>
							<Row gutter={[8, 16]}>
								<Col span={24}>
									<Text strong>Requested Products</Text>
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
