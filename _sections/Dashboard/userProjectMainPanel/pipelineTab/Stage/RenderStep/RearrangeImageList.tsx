import Image from "@components/Image";
import DetailText from "@sections/RenderEngine/DetailText";
import { Col, Row } from "antd";
import Modal from "antd/lib/modal/Modal";
import { UploadFile } from "antd/lib/upload/interface";
import React, { useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import styled from "styled-components";

const Container = styled.div`
	padding: 8px;
	& > * + * {
		margin-bottom: 4px;
	}
`;

interface RearrangeImageList {
	uploadedFiles: UploadFile[];
	saveUploadedFileList: (files: UploadFile[]) => Promise<void>;
	open: boolean;
	close: () => void;
}
const RearrangeImageList: React.FC<RearrangeImageList> = ({
	uploadedFiles: originalUploadedFiles,
	saveUploadedFileList,
	open,
	close,
}) => {
	const [uploadedFiles, setUploadedFiles] = useState([]);

	useEffect(() => {
		setUploadedFiles(originalUploadedFiles);
	}, [originalUploadedFiles]);

	const saveOrder = () => {
		saveUploadedFileList(uploadedFiles);
	};

	return (
		<Modal visible={open} onCancel={close} onOk={saveOrder} okText='Save Order' cancelText='Close'>
			<DragDropContext
				onDragEnd={data => {
					const copyOfUploadedFiles = [...uploadedFiles];
					const dataToBeMoved = uploadedFiles.find((_uploadedFile, index) => {
						if (index === data.source.index) {
							return true;
						}
						return false;
					});
					copyOfUploadedFiles.splice(data.source.index, 1);
					copyOfUploadedFiles.splice(data.destination.index, 0, dataToBeMoved);
					setUploadedFiles(copyOfUploadedFiles);
				}}
			>
				<Droppable droppableId='droppableId'>
					{provider => (
						<Container ref={provider.innerRef} {...provider.droppableProps}>
							{uploadedFiles.map((file, index) => {
								return (
									<Draggable key={file.uid} draggableId={file.uid} index={index}>
										{provided => {
											return (
												<Container {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
													<Row>
														<Col span={24}>
															<DetailText name='Position' value={index + 1} />
														</Col>
														<Col span={24}>
															<Image alt={file.fileName} width='100%' src={file.url} />
														</Col>
													</Row>
												</Container>
											);
										}}
									</Draggable>
								);
							})}
							{provider.placeholder}
						</Container>
					)}
				</Droppable>
			</DragDropContext>
		</Modal>
	);
};

export default RearrangeImageList;
