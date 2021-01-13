/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
//TODO -convert to typescript
import { LoadingOutlined, PlusOutlined, ReloadOutlined, SendOutlined } from "@ant-design/icons";
import { fetchChatAssets } from "@api/userApi";
import ViewChatArea from "@sections/AdminChatInterface/ViewChatArea";
import useAuth from "@utils/authContext";
import chatFetcher from "@utils/chatFetcher";
import fetcher from "@utils/fetcher";
import { Input, Modal, notification, Spin, Upload } from "antd";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";

const SubmitContainer = styled.div`
	position: absolute;
	cursor: pointer;
	right: 12px;
	top: 9px;
	z-index: 2;
`;
const ChatViewActions = styled.div`
	position: absolute;
	margin-top: 16px;
	bottom: 0px;
	width: 100%;
`;
const ChatBoxContainer = styled.div`
	height: 550px;
	overflow: scroll;
	padding-bottom: 100px;
	padding-top: 40px;
`;
const SpinContainer = styled.div`
	margin: 0 auto;
	text-align: center;
`;

const LoaderLabel = styled.span`
	display: inline-block;
	margin-left: 8px;
	color: black;
	font-size: 12px;
`;
const ReloadChat = styled.span`
	background-color: white;
	border-radius: 10px;
	box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
	display: inline-block;
	padding: 4px 8px;
	font-size: 10px;
	cursor: pointer;
	position: absolute;
	bottom: 45px;
	z-index: 999;
	transform: translateX(-50%);
	left: 50%;
`;

const ResolveChat = styled.span`
	background-color: white;
	border-radius: 10px;
	box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
	display: inline-block;
	padding: 8px 15px;
	font-size: 13px;
	cursor: pointer;
	position: absolute;
	bottom: auto;
	top: 10px;
	z-index: 999;
	right: 0%;
	color: #52c41a;
`;

const ResolvedMessage = styled.div`
	text-align: center;
	font-size: 16px;
	font-weight: bold;
`;

const Index = ({ projectId, designID }) => {
	//define limits for chat asset fetching
	const currentLimit = 15;
	const [chatAssets, setChatAssets] = useState([]);
	// const [currentLimit, setCurrentLimit] = useState(15);
	const [currentOffset, setCurrentoffset] = useState(0);
	const [isLoading, setLoadingStatus] = useState(false);
	const [currentComment, setComment] = useState("");
	const [designImages, setDesignImages] = useState([]);
	const [isFetchingOldMessages, setIsFetchingOldMessages] = useState(false);
	const [scrollPos, setScrollPos] = useState(null);
	const [direction, setDirection] = useState(null);
	const [previewVisible, setPreviewVisible] = useState(false);
	const [previewTitle, setPreviewTitle] = useState("");
	const [previewImage, setPreviewImage] = useState("");

	const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

	const { user: { name: userName = "" } = {} } = useAuth();
	const inputRef = useRef(null);
	const messageEndRef = useRef(null);
	const chatBoxRef = useRef(null);
	const fetchCustomerChatData = async (endPoint, currentLimit, currentOffset) => {
		const currentChatData = `${endPoint}&skip=${currentOffset}&limit=${currentLimit}`;

		try {
			const resData = await fetcher({ endPoint: currentChatData, method: "GET" });
			const { data, statusCode } = resData;
			if (statusCode && statusCode <= 201) {
				return data?.data;
			} else {
				throw new Error();
			}
		} catch {
			throw new Error();
		}
	};

	const scrollToBottom = () => {
		if (messageEndRef && messageEndRef.current) {
			messageEndRef.current.scrollIntoView({ behavior: "smooth" });
		}
	};

	useEffect(() => {
		if (chatBoxRef && chatBoxRef.current) {
			setScrollPos(chatBoxRef.current.scrollTop);
		}
	}, [chatBoxRef]);

	useEffect(() => {
		const endPoint = fetchChatAssets(projectId.toString(), designID?.toString());

		setLoadingStatus(true);
		fetchCustomerChatData(endPoint, currentLimit, currentOffset)
			.then(chatData => {
				const sortedArray = [...chatData].sort((a, b) => moment(a.createdAt) - moment(b.createdAt));
				setChatAssets(sortedArray);
			})
			.catch(() => notification.error({ message: "Failed to older messages" }))
			.finally(() => {
				setLoadingStatus(false);
				scrollToBottom();
			});
	}, []);

	useEffect(() => {
		const endPoint = fetchChatAssets(projectId.toString(), designID?.toString());
		if (currentOffset !== 0) {
			setIsFetchingOldMessages(true);
			fetchCustomerChatData(endPoint, currentLimit, currentOffset)
				.then(chatData => {
					const sortedArray = [...chatData].sort((a, b) => moment(a.createdAt) - moment(b.createdAt));
					setChatAssets([...sortedArray, ...chatAssets]);
				})
				.catch(() => notification.error({ message: "Failed to older messages" }))
				.finally(() => {
					setIsFetchingOldMessages(false);
					setDirection(null);
				});
		}
	}, [currentOffset]);
	const getBase64 = (img, callback) => {
		const reader = new FileReader();
		reader.addEventListener("load", () => callback(reader.result));
		reader.readAsDataURL(img);
	};

	const getBase64File = file => {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = () => resolve(reader.result);
			reader.onerror = error => reject(error);
		});
	};

	const handlePreview = async file => {
		if (!file.url && !file.preview) {
			file.preview = await getBase64File(file.originFileObj);
		}
		setPreviewImage(file.url || file.preview);
		setPreviewVisible(true);
		setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf("/") + 1));
	};

	const parseLocalImages = imgArr => {
		let count = 0;
		return new Promise(resolve => {
			if (imgArr.length) {
				const arr = [];
				imgArr.forEach(item =>
					getBase64(item.originFileObj, imageUrl => {
						count++;
						arr.push(imageUrl);
						if (count === imgArr.length) {
							resolve(arr);
						}
					})
				);
			} else {
				resolve([]);
			}
		});
	};

	const submitChat = async () => {
		if (designImages.length || currentComment.length) {
			setLoadingStatus(true);
			const formData = new FormData();
			for (let i = 0; i < designImages.length; i++) {
				const { originFileObj } = designImages[i];
				formData.append("files", originFileObj, originFileObj.name);
			}
			formData.append("message", currentComment);
			formData.append("type", "project");
			formData.append("project", projectId);
			if (designID) {
				formData.append("design", designID);
			}
			formData.append("userType", "team");
			// const res = await chatFetcher({ endPoint: "/v1/userProjectDiscussions", method: "POST", body: formData });
			try {
				await chatFetcher({ endPoint: "/v1/userProjectDiscussions", method: "POST", body: formData });
				parseLocalImages(designImages).then(imgArr => {
					const payload = {
						images: imgArr,
						message: currentComment,
						userType: "team",
						type: "project",
						project: projectId,
						design: designID,
						user: {
							profile: {
								firstName: userName,
							},
						},
					};
					setChatAssets([...chatAssets, payload]);
					setComment("");
					setDesignImages([]);
					refreshChat();
				});
			} catch (e) {
				setChatAssets(chatAssets.filter((_, i) => i !== chatAssets.length - 1));
				notification.error({ message: "Failed to send message. Please try again" });
			} finally {
				setLoadingStatus(false);
				scrollToBottom();
			}
		}
	};
	useEffect(() => {
		if (designImages.length > 5) {
			notification.error({ message: "You can attach a maximum of 5 files at one time." });
			setDesignImages([...designImages].slice(-5));
		}
	}, [designImages]);
	const updateCurrentComment = e => {
		setComment(e.target.value);
	};
	const uploadButton = (
		<div>
			<PlusOutlined />
		</div>
	);
	const handleChange = ({ fileList }) => {
		setDesignImages(fileList);
	};
	const beforeUpload = () => {
		return false;
	};
	const handleScroll = e => {
		if (scrollPos > e.target.scrollTop) {
			setDirection("up");
		} else if (scrollPos < e.target.scrollTop) {
			setDirection("down");
		}
		setScrollPos(e.target.scrollTop);
		if (e.target.scrollTop === 0 && direction === "up") {
			setCurrentoffset(currentOffset + currentLimit);
		}
	};
	const refreshChat = msg => {
		const endPoint = fetchChatAssets(projectId.toString(), designID?.toString());
		fetchCustomerChatData(endPoint, currentLimit, 0)
			.then(chatData => {
				const sortedArray = [...chatData].sort((a, b) => moment(a.createdAt) - moment(b.createdAt));
				setChatAssets(sortedArray);
				setCurrentoffset(0);
				if (msg) notification.success({ message: msg });
			})
			.catch(() => notification.error({ message: "Failed to older messages" }))
			.finally(() => {
				setLoadingStatus(false);
				scrollToBottom();
			});
	};

	const handleCancel = () => {
		setPreviewVisible(false);
	};

	const resolveChat = async () => {
		const latestAssetId = chatAssets[chatAssets.length - 1]?._id;
		const endPoint = `/v1/userProjectDiscussions/${latestAssetId}`;
		const payload = {
			resolved: "true",
		};
		if (latestAssetId) {
			try {
				const resData = await fetcher({ endPoint: endPoint, method: "PUT", body: payload });
				const { data, statusCode } = resData;
				if (statusCode && statusCode <= 201) {
					refreshChat("Chat has been resolved.");
					return data;
				} else {
					throw new Error();
				}
			} catch {
				throw new Error();
			}
		}
	};
	const isChatActive = chatAssets.length && !chatAssets[chatAssets.length - 1]?.resolved;
	return (
		<ChatBoxContainer className='container admin-chat-container' onScroll={handleScroll} ref={chatBoxRef}>
			{isChatActive ? <ResolveChat onClick={() => resolveChat()}>Resolve chat</ResolveChat> : null}
			<ReloadChat onClick={() => refreshChat("Chat has been refreshed.")}>
				<ReloadOutlined></ReloadOutlined>
				<span style={{ paddingLeft: "4px" }}>Refresh Chat</span>
			</ReloadChat>
			{isFetchingOldMessages ? (
				<SpinContainer>
					<Spin indicator={antIcon} />
					<LoaderLabel>Fetching Older Messages ...</LoaderLabel>
				</SpinContainer>
			) : null}

			<Spin spinning={isLoading}>
				<ViewChatArea chatData={chatAssets} />
				<div ref={messageEndRef}></div>
			</Spin>
			<ChatViewActions>
				<Input.TextArea
					style={{ height: "40px", resize: "none", width: "calc(100% - 50px)", left: "50px", zIndex: 1 }}
					value={currentComment}
					onChange={updateCurrentComment}
					placeholder='Type your message here ...'
					readOnly={isLoading ? true : false}
					ref={inputRef}
				/>
				<SubmitContainer onClick={submitChat}>
					<SendOutlined style={{ color: "#1890ff" }} />
				</SubmitContainer>
				<div className='upload-container'>
					<Upload
						listType='picture-card'
						fileList={designImages}
						onPreview={handlePreview}
						onChange={handleChange}
						beforeUpload={beforeUpload}
						style={{ height: "45px" }}
						multiple={true}
						accept='image/*'
					>
						{/* {designImages.length >= 5 ? null : uploadButton} */}
						{uploadButton}
					</Upload>
					<Modal visible={previewVisible} title={previewTitle} footer={null} onCancel={handleCancel}>
						<img alt='example' style={{ width: "100%" }} src={previewImage} />
					</Modal>
				</div>
			</ChatViewActions>
			{!isChatActive ? (
				<ResolvedMessage>This chat is closed. Send a new message to open the chat.</ResolvedMessage>
			) : null}
		</ChatBoxContainer>
	);
};

export default Index;
