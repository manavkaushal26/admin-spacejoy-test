/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable no-useless-escape */
import { Image } from "antd";
import moment from "moment-timezone";
import React from "react";
import ReactHtmlParser from "react-html-parser";
import styled from "styled-components";
const MessageRow = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: ${props => (props.userType === "customer" ? "flex-start" : "flex-end")};
	margin: 8px 0;
`;
const MessageBubble = styled.div`
	background: ${props => (props.userType === "customer" ? "white" : "#1890ff")};
	color: ${props => (props.userType === "customer" ? "black" : "white")};
	padding: 8px 12px;
	border-radius: 20px;
	word-break: break-word;
	a {
		color: #ffc53d;
		font-weight: bold;
	}
`;
const MessageWrapper = styled.div`
	display: block;
	display: flex;
	flex-direction: column;
	background: transparent;
	max-width: 75%;
`;
const ImageWrapper = styled.div`
	display: flex;
	flex-wrap: wrap;
`;
const FlexWrapper = styled.div`
	display: flex;
	flex-direction: column;
	border-radius: 20px;
	background-color: white;
`;
const TimeFromSent = styled.small`
	text-align: right;
`;
const MessageInfoWrapper = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	font-size: 12px;
	align-items: baseline;
`;
const TextWrapper = styled.span`
	white-space: pre-wrap;
`;

const ViewChatArea = ({ chatData }) => {
	const renderChatImages = imageArr => {
		return imageArr.map((img, index) => (
			<div key={index} style={{ width: "30%", margin: "4px 8px 4px 0", border: "1px solid #f5f5f5" }}>
				<Image style={{ maxWidth: "100%", marginRight: "12px;" }} key={index} src={img}></Image>
			</div>
		));
	};

	const checkIfUrl = text => {
		let replacedText = "";
		let replacePattern1 = "";
		let replacePattern2 = "";
		let replacePattern3 = "";

		replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
		replacedText = text.replace(replacePattern1, "<a href='$1' target='_blank'>$1</a>");

		replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
		replacedText = replacedText.replace(replacePattern2, "$1<a href='http://$2' target='_blank'>$2</a>");

		replacePattern3 = /(([a-zA-Z0-9\-\_\.])+@[a-zA-Z\_]+?(\.[a-zA-Z]{2,6})+)/gim;
		replacedText = replacedText.replace(replacePattern3, "<a href='mailto:$1'>$1</a>");
		return ReactHtmlParser(replacedText);
	};

	const renderChatViewArea = chatData => {
		return chatData.map(chatItem => {
			return (
				<MessageRow key={chatItem._id} userType={chatItem.userType}>
					<MessageWrapper>
						<FlexWrapper>
							<ImageWrapper>{renderChatImages(chatItem.images)}</ImageWrapper>
							{chatItem.message.length ? (
								<MessageBubble userType={chatItem.userType}>
									<TextWrapper>{checkIfUrl(chatItem.message)}</TextWrapper>
								</MessageBubble>
							) : null}
						</FlexWrapper>
						<MessageInfoWrapper>
							<TimeFromSent>{moment(chatItem?.updatedAt).fromNow(true)} ago</TimeFromSent>
							<div style={{ paddingLeft: "8px" }}>
								<strong>{chatItem.user.profile.firstName || ""}</strong>
							</div>
						</MessageInfoWrapper>
					</MessageWrapper>
				</MessageRow>
			);
		});
	};
	return <div className='chat-view-area'>{renderChatViewArea(chatData)}</div>;
};

export default ViewChatArea;
