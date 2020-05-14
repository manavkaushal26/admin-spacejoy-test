import React, { useState, useEffect, useMemo } from "react";
import User, { Role } from "@customTypes/userType";
import { DetailedSource, AllJobs } from "@customTypes/renderEngineTypes";
import io from "socket.io-client";
import PageLayout from "@sections/Layout";
import { company } from "@utils/config";
import { NextPage, NextPageContext } from "next";
import Head from "next/head";
import IndexPageMeta from "@utils/meta";
import { redirectToLocation, withAuthVerification } from "@utils/auth";
import fetcher from "@utils/fetcher";
import {
	getSingleSource,
	getAllJobs,
	createJobApi,
	sourceUploadFileApi,
	startRenderJob,
	getSingleJobs,
} from "@api/renderEngineApi";
import { MaxHeightDiv } from "@sections/Dashboard/styled";
import { LoudPaddingDiv } from "pages/platformanager";
import { Typography, Col, Row, Upload, Button, Icon, notification, Spin, PageHeader, Result, Input } from "antd";
import moment from "moment";
import { getValueSafely } from "@utils/commonUtils";
import CreateNewJob from "@sections/RenderEngine/CreateNewJob";
import JobCard from "@sections/RenderEngine/JobCard";
import DetailText from "@sections/RenderEngine/DetailText";
import JobDetailsModal from "@sections/RenderEngine/JobDetailsModal";
import { useRouter } from "next/router";
import { UploadFile, UploadChangeParam } from "antd/lib/upload/interface";

const { Text, Title, Paragraph } = Typography;

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

	const socket = useMemo(() => io("https://krmasternode.spacejoy.com"), []);

	const Router = useRouter();

	const fetchJobs = async (): Promise<void> => {
		setLoading(true);
		const endPoint = `${getAllJobs(sourceData._id)}&skip=0&limit=50`;
		const response = await fetcher({ endPoint, method: "GET", hasBaseURL: true });

		if (!response.err) {
			setJobs(response.data);
		} else {
			notification.error({ message: "Failed to fetch jobs" });
		}
		setLoading(false);
	};

	useEffect(() => {}, []);

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
				...(state.cameraType === "specific" ? { cameraSpecific: state.caneraSpecific } : {}),
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
		<PageLayout isServer={isServer} authVerification={authVerification}>
			<Head>
				<title>Render Engine | {company.product}</title>
				{IndexPageMeta}
			</Head>
			<Spin spinning={loading}>
				<MaxHeightDiv>
					<LoudPaddingDiv>
						<Row gutter={[0, 16]}>
							<Col>
								<Title>Render Engine</Title>
							</Col>
							<Col>
								<PageHeader
									style={{ paddingLeft: "0px", paddingRight: "0px" }}
									onBack={(): void => Router.back()}
									title="Source Details"
									extra={[
										<Button key="create" onClick={toggleJobCreationModal} type="primary">
											Create new Job
										</Button>,
									]}
								/>
							</Col>

							<Col>
								<Row gutter={[8, 8]}>
									<DetailText name="Name" value={sourceData.name} />
									<DetailText name="Created At" value={moment(sourceData.createdAt).format("D-MMM-YYYY")} />
									<DetailText name="Source Id" value={sourceData._id} />
									<Col sm={12} md={8} lg={6}>
										<Row type="flex" style={{ whiteSpace: "pre", flexFlow: "row" }}>
											<Text strong>File uploaded: </Text>
											{sourceData.storage ? (
												<Text ellipsis>
													{getValueSafely(() => sourceData.storage.key.split("/").pop(), "No file uploaded")}
												</Text>
											) : (
												<Upload
													accept=".blend"
													fileList={uploadedFile}
													onChange={handleFileChange}
													action={sourceUploadFileApi(sourceData._id)}
												>
													<Button style={{ padding: 0, height: "auto" }} type="link">
														<Icon type="upload" />
														Click to upload
													</Button>
												</Upload>
											)}
										</Row>
									</Col>
									<Col span={24}>
										<Text strong>Description</Text>
										<Paragraph ellipsis={{ rows: 3, expandable: true }}>{sourceData.description}</Paragraph>
									</Col>
								</Row>
							</Col>
							<Col>
								<Row gutter={[8, 8]}>
									<Col span={24}>
										<Text strong>Search</Text>
									</Col>
									<Col span={24}>
										<Input name="search" placeholder="Search nbby name" onChange={handleSearch} />
									</Col>
								</Row>
							</Col>
							<Col>
								<Row gutter={[8, 8]}>
									{jobs.length !== 0 ? (
										jobs
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
													/>
												);
											})
									) : (
										<Result status="404" title="No Jobs" subTitle="Create a new Job to see it here" />
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
		redirectToLocation({ res, pathname: `/renderengine` });
	}

	return {
		isServer,
		authVerification,
		sourceData,
	};
};

export default withAuthVerification(SourcePage);
