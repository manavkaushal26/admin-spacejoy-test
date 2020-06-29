import { UploadOutlined } from "@ant-design/icons";
import {
	createJobApi,
	getAllJobs,
	getSingleJobs,
	getSingleSource,
	sourceUploadFileApi,
	startRenderJob,
} from "@api/renderEngineApi";
import { AllJobs, DetailedSource, RenderEngineStatus } from "@customTypes/renderEngineTypes";
import User, { Role } from "@customTypes/userType";
import { MaxHeightDiv } from "@sections/Dashboard/styled";
import PageLayout from "@sections/Layout";
import CreateNewJob from "@sections/RenderEngine/CreateNewJob";
import DetailText from "@sections/RenderEngine/DetailText";
import JobCard from "@sections/RenderEngine/JobCard";
import JobDetailsModal from "@sections/RenderEngine/JobDetailsModal";
import { redirectToLocation, withAuthVerification } from "@utils/auth";
import { getValueSafely } from "@utils/commonUtils";
import { company } from "@utils/config";
import fetcher from "@utils/fetcher";
import IndexPageMeta from "@utils/meta";
import { Button, Col, Input, notification, PageHeader, Result, Row, Spin, Typography, Upload } from "antd";
import { UploadChangeParam, UploadFile } from "antd/lib/upload/interface";
import moment from "moment";
import { NextPage, NextPageContext } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { LoudPaddingDiv } from "pages/platformanager";
import React, { useEffect, useMemo, useState } from "react";
import io from "socket.io-client";

const { Text, Paragraph } = Typography;

interface SourcePageProps {
	isServer: boolean;
	authVerification: Partial<User>;
	sourceData: DetailedSource;
}

const SourcePage: NextPage<SourcePageProps> = ({ isServer, authVerification, sourceData: fetchedSourceData }) => {
	const [jobs, setJobs] = useState<AllJobs[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const [sourceData, setSourceData] = useState<DetailedSource>(fetchedSourceData);
	const [jobCreationModalVisible, setJobCreationModalVisible] = useState<boolean>(false);
	const [uploadedFile, setUploadedFile] = useState<UploadFile[]>([]);
	const [jobId, setJobId] = useState<string>("");

	const [searchText, setSearchText] = useState<string>("");

	const Router = useRouter();

	const fetchJobs = async (): Promise<void> => {
		setLoading(true);
		const endPoint = `${getAllJobs(sourceData._id)}&skip=0&limit=50`;
		const response = await fetcher({ endPoint, method: "GET", hasBaseURL: true });

		if (!response.err) {
			// console.log("Jobs", response.data);
			setJobs(response.data);
		} else {
			notification.error({ message: "Failed to fetch jobs" });
		}
		setLoading(false);
	};

	const socket = useMemo(() => io("https://krmasternode.spacejoy.com"), []);

	useEffect(() => {
		return (): void => {
			socket.removeAllListeners();
			socket.disconnect();
		};
	}, []);

	const toggleJobCreationModal = (): void => {
		setJobCreationModalVisible(prevState => !prevState);
	};

	useEffect(() => {
		fetchJobs();
	}, []);

	const toggleJobDetails = (job?: AllJobs): void => {
		if (job) {
			setJobId(job._id);
		} else {
			setJobId("");
		}
	};

	const createJob = async (state: Record<string, string | number>): Promise<void> => {
		setLoading(true);
		const endPoint = createJobApi(sourceData._id);

		const data = {
			name: state.name,
			description: state.description,
			options: {
				samples: state.samples,
				cameraType: state.cameraType,
				...(state.cameraType === "specific" ? { cameraSpecific: state.cameraSpecific } : {}),
			},
		};

		const response = await fetcher({
			endPoint,
			method: "POST",
			body: {
				data,
			},
			hasBaseURL: true,
		});
		if (!response.err) {
			notification.success({ message: "Created Job Successfully" });
			// console.log("Create Job Resoponse", response.data);
			setJobs(prevState => [response.data, ...prevState]);
			toggleJobCreationModal();
		} else {
			notification.error({ message: "Failed to create Job" });
		}
		setLoading(false);
	};

	const handleFileChange = (info: UploadChangeParam<UploadFile>): void => {
		const { fileList } = info;
		const prunedFileList = fileList.slice(-1);
		setUploadedFile(prunedFileList);
		if (info.file.status === "done") {
			notification.success({ message: "File upload Complete" });
			// console.log("File Upload Response", info.file.response.data);

			setSourceData(info.file.response.data);
		}
	};

	const onStartJobClick = async (jobID: string): Promise<void> => {
		const endPoint = startRenderJob(sourceData._id, jobID);

		const response = await fetcher({
			endPoint,
			method: "POST",
			hasBaseURL: true,
		});
		if (!response.err) {
			const modifiedJobs = jobs.map(job => {
				if (job._id === jobID) {
					return { ...response.data };
				}
				return job;
			});
			setJobs(modifiedJobs);
		} else {
			notification.error({ message: "Failed to start render" });
		}
	};

	const cancelJob = async (jobID: string): Promise<void> => {
		const endPoint = startRenderJob(sourceData._id, jobID);

		const response = await fetcher({
			endPoint,
			method: "DELETE",
			hasBaseURL: true,
		});
		if (!response.err) {
			const modifiedJobs = jobs.map(job => {
				if (job._id === jobID) {
					return { ...job, status: RenderEngineStatus.pending };
				}
				return job;
			});
			setJobs(modifiedJobs);
		} else {
			notification.error({ message: "Failed to start render" });
		}
	};

	const deleteJob = async (jobID: string): Promise<void> => {
		const endPoint = `${getSingleJobs(sourceData._id, jobID)}?hard=true`;
		try {
			const response = await fetcher({ endPoint, method: "DELETE", hasBaseURL: true });
			if (!response.err) {
				const remainingJobs = jobs.filter(job => {
					return job._id !== jobID;
				});

				setJobs(remainingJobs);
				notification.success({ message: "Deleted job Successfully" });
			} else {
				throw Error();
			}
		} catch (e) {
			notification.error({ message: "Failed to delete job" });
		}
	};

	const handleSearch = (e): void => {
		const {
			target: { value },
		} = e;
		setSearchText(value.toLowerCase());
	};
	return (
		<PageLayout isServer={isServer} authVerification={authVerification} pageName='Render Engine'>
			<Head>
				<title>Render Engine | {company.product}</title>
				{IndexPageMeta}
			</Head>
			<Spin spinning={loading}>
				<MaxHeightDiv>
					<LoudPaddingDiv>
						<Row gutter={[0, 16]}>
							<Col span={24}>
								<PageHeader
									style={{ paddingLeft: "0px", paddingRight: "0px" }}
									onBack={(): void => Router.back()}
									title='Source Details'
									extra={[
										sourceData.storage ? (
											<Button key='create' onClick={toggleJobCreationModal} type='primary'>
												Create new Job
											</Button>
										) : (
											<Upload
												accept='.blend'
												fileList={uploadedFile}
												onChange={handleFileChange}
												action={sourceUploadFileApi(sourceData._id)}
											>
												<Button type='primary'>
													<UploadOutlined />
													Click to upload
												</Button>
											</Upload>
										),
									]}
								/>
							</Col>

							<Col span={24}>
								<Row gutter={[8, 8]}>
									<DetailText name='Name' value={sourceData.name} />
									<DetailText name='Created At' value={moment(sourceData.createdAt).format("D-MMM-YYYY")} />
									<DetailText name='Source Id' value={sourceData._id} />
									{!!sourceData.storage && (
										<Col sm={12} md={8} lg={6}>
											<Row style={{ whiteSpace: "pre", flexFlow: "row" }}>
												<Text strong>File uploaded: </Text>

												<Text ellipsis>
													{getValueSafely(() => sourceData.storage.key.split("/").pop(), "No file uploaded")}
												</Text>
											</Row>
										</Col>
									)}
									<Col span={24}>
										<Text strong>Description</Text>
										<Paragraph ellipsis={{ rows: 3, expandable: true }}>
											{sourceData.description || "No Description"}
										</Paragraph>
									</Col>
								</Row>
							</Col>
							{jobs.length !== 0 && (
								<Col span={24}>
									<Row gutter={[8, 8]}>
										<Col span={24}>
											<Text strong>Search</Text>
										</Col>
										<Col span={24}>
											<Input name='search' placeholder='Search nbby name' onChange={handleSearch} />
										</Col>
									</Row>
								</Col>
							)}
							<Col span={24}>
								<Row gutter={[8, 8]}>
									{jobs.length !== 0 && sourceData.cameras.length !== 0
										? jobs
												.filter(job => {
													return job.name.toLowerCase().includes(searchText);
												})
												.map(job => {
													return (
														<JobCard
															key={`${job._id}-${job.status}`}
															job={job}
															onDelete={deleteJob}
															onClick={toggleJobDetails}
															startJob={onStartJobClick}
															socket={socket}
															cancelJob={cancelJob}
														/>
													);
												})
										: !!sourceData.storage && (
												<Col span={24}>
													<Result status='404' title='No Jobs' subTitle='Create a new Job to see it here' />
												</Col>
										  )}
									{(!sourceData.storage || sourceData.cameras.length === 0) && (
										<Col span={24}>
											<Row justify='space-around'>
												<Upload
													accept='.blend'
													fileList={uploadedFile}
													onChange={handleFileChange}
													action={sourceUploadFileApi(sourceData._id)}
												>
													<Result
														style={{ cursor: "pointer" }}
														status='500'
														title='Click to upload source'
														subTitle={
															sourceData.cameras.length === 0
																? "Uploaded file has no Cameras"
																: "No file has been uploaded"
														}
													/>
												</Upload>
											</Row>
										</Col>
									)}
								</Row>
							</Col>
						</Row>
					</LoudPaddingDiv>
					<CreateNewJob
						createJob={createJob}
						isOpen={jobCreationModalVisible}
						closeModal={toggleJobCreationModal}
						loading={loading}
						cameras={sourceData.cameras}
					/>
					<JobDetailsModal sourceId={sourceData._id} jobId={jobId} closeModal={toggleJobDetails} />
				</MaxHeightDiv>
			</Spin>
		</PageLayout>
	);
};

SourcePage.getInitialProps = async (ctx: NextPageContext): Promise<SourcePageProps> => {
	const {
		req,
		res,
		query: { srcId },
	} = ctx;
	const isServer = !!req;
	const authVerification = {
		name: "",
		role: Role.Guest,
	};

	let sourceData = null;

	if (srcId) {
		const endPoint = getSingleSource(srcId as string);
		const response = await fetcher({ endPoint, method: "GET", hasBaseURL: true });
		if (!response.err) {
			sourceData = response.data;
		} else {
			throw Error();
		}
	} else {
		redirectToLocation({ res, pathname: "/renderengine" });
	}

	return {
		isServer,
		authVerification,
		sourceData,
	};
};

export default withAuthVerification(SourcePage);
