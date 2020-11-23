import fetcher from "@utils/fetcher";
import { Button, Col, Modal, Row, Select, Table } from "antd";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { handleScores } from "./helper";
const ScoreBox = styled.input`
	padding: 5px;
	border: 1px solid #efefef;
	/* width: 40px; */
	max-width: 40px;
	margin: 0 auto;
`;

export default function ScoreModal({ isModalVisible, selectedProductId, handleModalOk, handleModalCancel, styles }) {
	const [scores, setScores] = useState([]);
	const fetchResources = async endPoint => {
		try {
			const resData = await fetcher({ endPoint: endPoint, method: "GET" });
			const { data, statusCode } = resData;
			if (statusCode && statusCode <= 201) {
				return data;
			} else {
				throw new Error();
			}
		} catch {
			throw new Error();
		}
	};

	const handleDelete = async id => {
		await handleScores("DELETE", { imageId: id });
		getLatestScores();
	};

	useEffect(() => {
		getLatestScores();
	}, [selectedProductId]);

	const getLatestScores = () => {
		// const endPoint = `/quiz/admin/v1/image/scores/${selectedProductId}`;
		const endPoint = `/quiz/admin/v1/image/scores/1`;
		fetchResources(endPoint)
			.then(res => {
				filterScoresData(res.scores);
			})
			.catch(err => console.log(err))
			.finally(() => {});
	};

	const getStyleName = id => {
		const style = styles.filter(item => item.id === id)[0];
		if (style) {
			return style.name;
		}
		return "";
	};

	const filterScoresData = scores => {
		const data = scores.map(item => {
			return {
				name: getStyleName(item.style_id),
				score: item.score,
				id: item.id,
				styleId: item.style_id,
				isActive: false,
			};
		});
		setScores(data);
	};

	const handleChange = value => {
		const style = styles.filter(item => item?.id === value);
		const updatedScores = [...scores, ...style];
		setScores(updatedScores);
	};

	const handleEdit = async (row, type) => {
		console.log("row", row, type);
		if (type.toLowerCase() === "edit") {
			scores.forEach(score => {
				if (score?.id === row?.id) {
					score["isActive"] = true;
				} else {
					score["isActive"] = false;
				}
			});
		} else if (type.toLowerCase() === "save") {
			scores.forEach(score => {
				if (score?.id === row?.id) {
					score["isActive"] = false;
				}
			});
			// await handleScores("PUT", {
			// 	imageId: selectedProductId,
			// 	styleId: row?.styleId,
			// 	score: 10,
			// });
		}
		setScores(scores);
	};
	return (
		<Modal title='Basic Modal' visible={isModalVisible} onOk={handleModalOk} onCancel={handleModalCancel} width={1000}>
			<Table rowKey='_id' scroll={{ x: 768 }} dataSource={scores}>
				<Table.Column
					key='_id'
					title='Style Name'
					render={scores => {
						return (
							<Row>
								<Col span={24}>{scores.name}</Col>
							</Row>
						);
					}}
				/>
				<Table.Column
					key='id'
					title='Score'
					dataIndex='id'
					render={(text, record) => (
						<ScoreBox
							className={record?.isActive ? "active" : ""}
							disabled={record?.isActive ? false : true}
							value={record.score}
							// onChange={e => handleChange}
						></ScoreBox>
					)}
				/>
				<Table.Column
					key='id'
					title=''
					dataIndex='id'
					render={(text, record) => {
						const isEditing = record?.isActive;
						console.log("isEditing", isEditing);
						const type = isEditing ? "Save" : "Edit";
						return <Button onClick={() => handleEdit(record, type)}>{type}</Button>;
					}}
				/>
				<Table.Column
					key='id'
					title=''
					dataIndex='id'
					render={(text, record) => <Button onClick={() => handleDelete(record.id)}>Delete</Button>}
				/>
			</Table>
			<Select
				showSearch
				filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
				style={{ width: "100%" }}
				onChange={record => handleChange(record)}
				defaultValue='--'
			>
				{styles.map((style, index) => {
					return <Select.Option value={style?.id}>{style?.name}</Select.Option>;
				})}
			</Select>
		</Modal>
	);
}
