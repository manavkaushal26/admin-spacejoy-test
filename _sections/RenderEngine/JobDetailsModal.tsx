import { getSingleJobs } from "@api/renderEngineApi";
import { DetailedJob } from "@customTypes/renderEngineTypes";
import { SizeAdjustedModal } from "@sections/AssetStore/styled";
import fetcher from "@utils/fetcher";
import { notification, Row, Spin, Col, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { BiggerButtonCarousel } from "@sections/Dashboard/styled";
import Image from "@components/Image";
import moment from "moment";
import DetailText from "./DetailText";

const { Text } = Typography;

interface JobDetailsModal {
	sourceId: string;
	jobId: string;
	closeModal: () => void;
}

const JobDetailsModal: React.FC<JobDetailsModal> = ({ sourceId, jobId, closeModal }) => {
	const [jobDetails, setJobDetails] = useState<DetailedJob>(null);
	const [loading, setLoading] = useState<boolean>(false);

	const fetchJobDetails = async (): Promise<void> => {
		setLoading(true);
		const endPoint = getSingleJobs(sourceId, jobId);

		const response = await fetcher({ endPoint, method: "GET", hasBaseURL: true });

		if (!response.err) {
			setJobDetails(response.data);
		} else {
			notification.error({ message: "Failed to fetch job details" });
		}
		setLoading(false);
	};

	useEffect(() => {
		if (jobId) {
			fetchJobDetails();
		}
	}, [jobId]);

	return (
		<Spin spinning={loading}>
			<SizeAdjustedModal title="Job Details" onCancel={closeModal} visible={!!jobId} footer={null}>
				<Row gutter={[16, 16]}>
					<DetailText name="Name" value={jobDetails?.name} />
					<DetailText name="Status" value={jobDetails?.status} />
					<DetailText name="Camera Type" value={jobDetails?.options?.cameraType} />
					<DetailText name="Samples" value={jobDetails?.options?.samples} />
					<DetailText name="Source ID" value={jobDetails?.source.name} />
					<DetailText name="CPU" value={jobDetails?.process?.cpu} />
					<DetailText name="GPU" value={jobDetails?.process?.gpu} />
					<DetailText name="Cloud" value={jobDetails?.process?.cloud} />
					<DetailText name="Created At" value={moment(jobDetails?.createdAt).format("DD-MM-YYYY hh:mm a")} />

					{jobDetails?.renders.length !== 0 && (
						<Col span={24}>
							<Row gutter={[8, 8]}>
								<Col>
									<Text strong>Renders</Text>
								</Col>

								<Col>
									<BiggerButtonCarousel dotPosition="top" slidesToShow={1} slidesToScroll={1} autoplay>
										{jobDetails?.renders.map(
											(image): JSX.Element => (
												<Row key={image._id} gutter={[16, 16]}>
													<Col span={24}>
														<Image width="100%" src={image.url} />
													</Col>
													<Col span={24}>
														<Row type="flex" justify="space-around">
															<Col>
																<Row type="flex" style={{ whiteSpace: "pre", flexFlow: "row" }} gutter={[4, 4]}>
																	<Text strong>Time: </Text>
																	<Text ellipsis>{image?.meta?.time}</Text>
																</Row>
															</Col>
															<Col>
																<Row type="flex" style={{ whiteSpace: "pre", flexFlow: "row" }} gutter={[4, 4]}>
																	<Text strong>Created At: </Text>
																	<Text ellipsis>{moment(image?.meta?.createdAt).format("DD-MM-YYYY hh:mm a")}</Text>
																</Row>
															</Col>
															<Col>
																<a download={`${image._id} - ${jobDetails.name}`} href={image.url}>
																	Download Image
																</a>
															</Col>
														</Row>
													</Col>
												</Row>
											)
										)}
									</BiggerButtonCarousel>
								</Col>
							</Row>
						</Col>
					)}
				</Row>
			</SizeAdjustedModal>
		</Spin>
	);
};

export default JobDetailsModal;
