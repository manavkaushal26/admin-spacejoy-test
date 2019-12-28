import { updateNotesApi } from "@api/designApi";
import Image from "@components/Image";
import { DesignerNotes, DetailedDesign } from "@customTypes/dashboardTypes";
import User from "@customTypes/userType";
import { getValueSafely } from "@utils/commonUtils";
import fetcher from "@utils/fetcher";
import { getLocalStorageValue } from "@utils/storageUtils";
import { Avatar, Button, Card, Col, Icon, Input, Row, Typography, message } from "antd";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { CustomDiv, CustomUl, EndCol, FitIcon, BorderedParagraph } from "../styled";

const { Text, Paragraph } = Typography;

interface NotesTab {
	designData: DetailedDesign;
	refetchDesignData: () => void;
}

const NotesImageURL =
	process.env.NODE_ENV === "production"
		? "q_80,h_125/v1576131412/call_customer_b1xjqf.svg"
		: "q_80,h_125/v1574849424/shared/call_customer_b1xjqf.svg";

const NotesTab = ({ designData, refetchDesignData }: NotesTab): JSX.Element => {
	const [designerNotes, setDesignerNotes] = useState<DesignerNotes[]>(designData.designerNotes);
	const [authVerification, setAuthVerification] = useState<User>(null);
	const [newNote, setNewNote] = useState<string>("");

	useEffect(() => {
		setAuthVerification(getLocalStorageValue<User>("authVerification"));
	}, []);

	const saveNotes = async (notes = []) => {
		const endpoint = updateNotesApi(designData._id);
		const body = notes;
		const response = await fetcher({ endPoint: endpoint, body: { data: { designerNotes: body } }, method: "PUT" });
		if (response.statusCode <= 300) {
			setDesignerNotes(data.data.designerNotes);
		}
	};

	const onNewNote = e => {
		const {
			target: { value }
		} = e;
		setNewNote(value);
	};

	const addNote = async () => {
		const body = [
			...designerNotes.map(note => {
				return note;
			})
		];
		const data: DesignerNotes[] = [
			{
				author: authVerification.id,
				text: newNote
			},
			...body
		];
		try {
			await saveNotes(data);
			message.success("Note Added");
			setNewNote("");
		} catch (e) {
			message.error("Failed to add Note");
		}
	};

	const editNote = async (id: string, value) => {
		const modifiedDesignerNotes = designerNotes.map(note => {
			if (note._id === id) {
				note.text = value;
			}
			return {
				...note
			};
		});
		try {
			await saveNotes(modifiedDesignerNotes);
			message.success("Note edited");
		} catch (e) {
			message.error("Failed to add Note");
		}
	};

	const deleteNote = async (id: string) => {
		const modifiedDesignerNotes = designerNotes.filter(note => {
			return note._id !== id;
		});
		message.success("Note deleted");
		try {
			await saveNotes(modifiedDesignerNotes);
		} catch (e) {}
	};

	return (
		designData && (
			<CustomDiv px="10px" py="10px">
				<CustomDiv py="10px">
					<Card>
						<CustomDiv type="flex" width="100%" justifyContent="stretch" flexDirection="row" flexWrap="no-wrap">
							<CustomDiv width="30%">
								<Image src={NotesImageURL} height="125px" width="100%" />
							</CustomDiv>
							<CustomDiv width="70%" px="24px">
								<Text type="secondary">
									{
										"Please call the customer and check if they or you have any further questions to be answered. This helps build the credibility of Spacejoy being customer-centric company."
									}
								</Text>
								<br />
								<Text strong>Few pointers to remember on call:</Text>
								<CustomUl>
									<li>Ask for room images</li>
									<li>Please be patient and answer cordially</li>
								</CustomUl>
							</CustomDiv>
						</CustomDiv>
					</Card>
				</CustomDiv>
				<Row type="flex" align="stretch" justify="start">
					<Col span={2}>
						<CustomDiv px="12px">
							<Avatar>{getValueSafely(() => authVerification.name[0], "")}</Avatar>
						</CustomDiv>
					</Col>
					<Col sm={22} md={22} lg={18} xl={14}>
						<Input.TextArea value={newNote} onChange={onNewNote} autosize={{ minRows: 2 }} />
					</Col>
				</Row>
				<CustomDiv py="10px">
					<Row type="flex">
						<Col span={2} />
						<EndCol md={22} lg={18} xl={14}>
							<Button type="primary" onClick={addNote}>
								Add Comment
							</Button>
						</EndCol>
					</Row>
				</CustomDiv>
				{designerNotes.map(note => (
					<CustomDiv py="12px">
						<Row type="flex" align="stretch" justify="start">
							<CustomDiv width="100%" inline type="flex" textOverflow="ellipsis" py="16px" align="center">
								<CustomDiv textOverflow="ellipsis" inline type="flex" px="12px">
									<Avatar>{getValueSafely(() => authVerification.name[0], "")}</Avatar>{" "}
								</CustomDiv>
								<Text strong ellipsis>
									{getValueSafely(() => authVerification.name, "")}
								</Text>
								<CustomDiv px="8px">
									<FitIcon onClick={() => deleteNote(note._id)} theme="twoTone" type="delete" />
								</CustomDiv>
							</CustomDiv>
						</Row>
						<Row>
							<Col span={2} />
							<Col md={22} lg={18} xl={14}>
								<BorderedParagraph
									editable={{
										onChange: (value: string) => {
											editNote(note._id, value);
										}
									}}
								>
									{note.text}
								</BorderedParagraph>
							</Col>
						</Row>
					</CustomDiv>
				))}
			</CustomDiv>
		)
	);
};

export default NotesTab;
