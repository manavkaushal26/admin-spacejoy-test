import { updateNotesApi } from "@api/designApi";
import { CapitalizedText } from "@components/CommonStyledComponents";
import { DesignerNotes, DetailedDesign } from "@customTypes/dashboardTypes";
import User from "@customTypes/userType";
import { dateFromObjectId, getValueSafely, stringToUrl } from "@utils/commonUtils";
import fetcher from "@utils/fetcher";
import { getLocalStorageValue } from "@utils/storageUtils";
import { Avatar, Button, Card, Comment, Form, List, message, Row } from "antd";
import TextArea from "antd/lib/input/TextArea";
import parse from "html-react-parser";
import moment from "moment-timezone";
import React, { useEffect, useState } from "react";
import { CustomDiv } from "../styled";

interface NotesTab {
	designData: DetailedDesign;
}

const NotesImageURL =
	process.env.NODE_ENV === "production"
		? "q_80,h_125/v1576131412/call_customer_b1xjqf.svg"
		: "q_80,h_125/v1574849424/shared/call_customer_b1xjqf.svg";

const NotesTab = ({ designData }: NotesTab): JSX.Element => {
	const [designerNotes, setDesignerNotes] = useState<DesignerNotes[]>(designData.designerNotes);
	const [authVerification, setAuthVerification] = useState<User>(null);
	const [newNote, setNewNote] = useState<string>("");

	useEffect(() => {
		setAuthVerification(getLocalStorageValue<User>("authVerification"));
	}, []);

	const saveNotes: (notes: DesignerNotes[]) => Promise<void> = async (notes = []) => {
		const endpoint = updateNotesApi(designData._id);
		const body = notes.map(note => {
			return {
				_id: note._id,
				author: note.author.id,
				text: note.text,
			};
		});
		const response = await fetcher({ endPoint: endpoint, body: { data: { designerNotes: body } }, method: "PUT" });
		if (response.statusCode <= 300) {
			setDesignerNotes(response.data.designerNotes);
		}
	};

	const onNewNote = e => {
		const {
			target: { value },
		} = e;
		setNewNote(value);
	};

	const addNote = async () => {
		const body = [
			...designerNotes.map(note => {
				return note;
			}),
		];
		const data: DesignerNotes[] = [
			{
				author: {
					profile: {
						name: authVerification.name,
					},
					id: authVerification.id,
				},
				text: newNote,
			},
			...body,
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
			const copyNote = { ...note };
			if (copyNote._id === id) {
				copyNote.text = value;
			}
			return {
				...copyNote,
			};
		});
		try {
			await saveNotes(modifiedDesignerNotes);
			message.success("Note edited");
		} catch (e) {
			message.error("Failed to add Note");
		}
	};

	const deleteNote = async (id: string): Promise<void> => {
		const modifiedDesignerNotes = designerNotes.filter(note => {
			return note._id !== id;
		});
		message.success("Note deleted");
		await saveNotes(modifiedDesignerNotes);
	};

	return (
		designData && (
			<CustomDiv px='10px' py='10px'>
				<Comment
					avatar={
						<Avatar>
							<CapitalizedText>{getValueSafely(() => authVerification.name[0], "")}</CapitalizedText>
						</Avatar>
					}
					content={
						<>
							<Form.Item>
								<TextArea rows={4} onChange={onNewNote} value={newNote} />
							</Form.Item>
							<Form.Item>
								<Row justify='end'>
									<Button type='primary' onClick={addNote}>
										Add Comment
									</Button>
								</Row>
							</Form.Item>
						</>
					}
				/>
				<List
					dataSource={designerNotes}
					renderItem={(note: DesignerNotes): JSX.Element => (
						<>
							<Comment
								avatar={<Avatar>{getValueSafely(() => note.author.profile.name[0], "")}</Avatar>}
								datetime={moment(dateFromObjectId(note._id)).fromNow()}
								author={getValueSafely(() => note.author.profile.name, "")}
								content={<Card size='small'>{parse(stringToUrl(note.text))}</Card>}
								actions={[
									<Button
										style={{ padding: 0 }}
										key='delete'
										type='link'
										danger
										onClick={(): Promise<void> => deleteNote(note._id)}
									>
										<small>Delete</small>
									</Button>,
								]}
							/>
						</>
					)}
				/>
			</CustomDiv>
		)
	);
};

export default NotesTab;
