import { ArrowLeftOutlined, UploadOutlined } from "@ant-design/icons";
import { bulkMessageApi } from "@api/userApi";
import { MaxHeightDiv, SilentDivider } from "@sections/Dashboard/styled";
import PageLayout from "@sections/Layout";
import { ProtectRoute } from "@utils/authContext";
import { company } from "@utils/config";
import fetcher from "@utils/fetcher";
import IndexPageMeta from "@utils/meta";
import { Button, Col, Input, Modal, notification, Row, Typography, Upload } from "antd";
import { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { LoudPaddingDiv } from ".";

const { Title, Text } = Typography;
const formatToSend = data => {
	const dataToSend = { message: "", start: "", end: "" };
	dataToSend.message = data.message;
	dataToSend.start = data.dateRange[0].toISOString();
	dataToSend.end = data.dateRange[1].toISOString();
	return dataToSend;
};

const BroadcastMessage: NextPage = () => {
	const router = useRouter();
	const [fileList, setFileList] = useState([]);
	const [message, setMessage] = useState("");
	const [loading, setLoading] = useState(false);

	const onChange = (e): void => {
		const {
			target: { value },
		} = e;
		setMessage(value);
	};

	const beforeUpload = (file): boolean => {
		setFileList(prevFileList => [...prevFileList, file]);
		return false;
	};
	const sendData = async file => {
		const endPoint = bulkMessageApi();
		try {
			const result = await fetcher({ endPoint, method: "POST", body: formatToSend(data) });
			if (result.statusCode <= 300) {
				notification.success({ message: "Message sent to users" });
			} else {
				throw result.data.error;
			}
		} catch (e) {
			notification.error({ message: e.message });
		}
	};

	const handleUpload = async (): Promise<void> => {
		if (message !== "") {
			const endPoint = bulkMessageApi();
			setLoading(true);
			const formData = new FormData();
			fileList.forEach(file => {
				formData.append("file", file, file.fileName);
			});

			formData.append("messages", message);

			const response = await fetcher({
				isMultipartForm: true,
				endPoint,
				method: "POST",
				body: formData,
			});

			if (response.statusCode <= 300) {
				setFileList([]);
				setMessage("");
				notification.success({ message: "File uploaded successfully." });
			} else {
				notification.error({ message: "Something went wrong. Please try again later" });
			}

			setLoading(false);
		}
	};

	const confirmData = () => {
		Modal.confirm({ title: `Send "${message}" to customers?`, onOk: () => handleUpload() });
	};

	return (
		<PageLayout pageName='Coupon Manager'>
			<Head>
				<title>Broadcast Message | {company.product}</title>
				{IndexPageMeta}
			</Head>
			<MaxHeightDiv>
				<LoudPaddingDiv>
					<Row gutter={[8, 8]}>
						<Col span={24}>
							<Row justify='space-between'>
								<Col>
									<Title level={3}>
										<Row gutter={[8, 8]}>
											<Col>
												<ArrowLeftOutlined onClick={() => router.back()} />
											</Col>
											<Col>Broadcast chat</Col>
										</Row>
									</Title>
									<Text strong>Warning: Please use this module with caution as actual customers will be contacted</Text>
								</Col>
							</Row>
						</Col>
						<Col span={24}>
							<SilentDivider />
						</Col>
						<Col span={24}>
							<Row gutter={[8, 8]}>
								<Col span={24}>
									<Text>Message to Customer</Text>
								</Col>
								<Col span={24}>
									<Input.TextArea onChange={onChange} />
								</Col>
								<Col span={24}>
									<Text>Select file with Project Id&apos;s</Text>
								</Col>
								<Col span={24}>
									<Upload beforeUpload={beforeUpload} accept='.csv'>
										<Button disabled={!message} icon={<UploadOutlined />}>
											Select file
										</Button>
									</Upload>
								</Col>

								<Col span={24}>
									<Row justify='end'>
										<Button type='primary' htmlType='submit' onClick={confirmData}>
											Send
										</Button>
									</Row>
								</Col>
							</Row>
						</Col>
					</Row>
				</LoudPaddingDiv>
			</MaxHeightDiv>
		</PageLayout>
	);
};

export default ProtectRoute(BroadcastMessage);
