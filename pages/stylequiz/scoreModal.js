import SectionHeader from "@sections/SectionHeader";
import fetcher from "@utils/fetcher";
import { Button, Col, Modal, notification, Row, Select, Table } from "antd";
import PropTypes from "prop-types";
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { handleScores } from "./helper";
const ScoreBox = styled.input`
	padding: 5px;
	border: 1px solid #efefef;
	/* width: 40px; */
	max-width: 40px;
	margin: 0 auto;
`;

const ScoreInput = styled.div`
	input {
		padding: 3px 10px;
		width: 60px;
	}
	input::-webkit-outer-spin-button,
	input::-webkit-inner-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}

	/* Firefox */
	input[type="number"] {
		-moz-appearance: textfield;
	}
`;

const Wrapper = styled.div`
	h3 {
		text-transform: capitalize;
	}
`;

export default function ScoreModal({ isModalVisible, selectedProductId, handleModalOk, handleModalCancel, styles }) {
	const [scores, setScores] = useState([]);
	const [isEditModal, setEditModal] = useState(false);
	const [currentSelectedRecord, setSelectedRecord] = useState([]);
	const [isLoading, setLoader] = useState(false);
	const inputEl = useRef(null);
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
		await handleScores("DELETE", { scoreId: id });
		getLatestScores();
	};

	useEffect(() => {
		document.addEventListener("keydown", onKeyDown);
		if (selectedProductId) {
			getLatestScores();
		}
		return () => {
			document.removeEventListener("keydown", onKeyDown);
		};
	}, [selectedProductId]);

	const onKeyDown = e => {
		if (e.which === 13 && isEditModal) {
			handleEditModalOk();
		}
		setEditModal(false);
	};

	const getLatestScores = () => {
		const endPoint = `/quiz/admin/v1/image/scores/${selectedProductId}`;
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

	const handleEditModalOk = () => {
		if (inputEl?.current && inputEl.current.value) {
			addNewScore();
			setEditModal(false);
		} else {
			notification.success({ message: "Score cannot be empty" });
		}
	};

	const handleEditModalCancel = () => {
		setEditModal(false);
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
		setEditModal(true);
		const style = styles.filter(item => item?.id === value);
		setSelectedRecord(style);
		if (inputEl?.current) {
			console.log("inputEl", inputEl);
			inputEl.current.focus();
		}
	};

	const handleEdit = (row, type) => {
		const updatedScores = scores.map(score => {
			if (score?.id === row?.id) {
				if (type.toLowerCase() === "edit") {
					score["isActive"] = true;
				} else if (type.toLowerCase() === "save") {
					handleScores("PUT", {
						imageId: selectedProductId,
						styleId: row?.styleId,
						score: row?.score,
					})
						.then(data => {
							notification.success({ message: data.message });
						})
						.catch(() =>
							notification.error({ message: "Score cannot be added. Total score has to be less than 100." })
						);
					score["isActive"] = false;
				}
			}
			return score;
		});
		setScores(updatedScores);
	};

	const addNewScore = async () => {
		await handleScores("POST", {
			imageId: selectedProductId,
			styleId: currentSelectedRecord[0]?.id,
			score: parseInt(inputEl.current.value),
		})
			.then(data => {
				const payload = [
					{
						name: currentSelectedRecord[0]?.name,
						id: data?.id,
						score: parseInt(inputEl.current.value),
						styleId: currentSelectedRecord[0]?.id,
						isActive: false,
					},
				];
				const updatedScores = [...scores, ...payload];
				setScores(updatedScores);
				setEditModal(false);
				notification.success({ message: data.message });
			})
			.catch(() => notification.error({ message: "Score cannot be added. Total score has to be less than 100." }));
		inputEl.current.value = "";
	};

	const onScoreChange = (id, e) => {
		const updatedScores = scores.map(score => {
			if (score.id === id) {
				score["score"] = parseInt(e.target.value);
			}
			return score;
		});
		setScores(updatedScores);
	};
	return (
		<Modal title='Scores' visible={isModalVisible} onOk={handleModalOk} onCancel={handleModalCancel} width={1000}>
			<Wrapper>
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
								value={record.score || 0}
								onChange={e => onScoreChange(record.id, e)}
							></ScoreBox>
						)}
					/>
					<Table.Column
						key='id'
						title=''
						dataIndex='id'
						align='right'
						render={(text, record) => {
							const isEditing = record?.isActive;
							const type = isEditing ? "Save" : "Edit";
							return (
								<>
									<Button type='link' onClick={() => handleEdit(record, type)}>
										{type}
									</Button>
									&nbsp;&nbsp;
									<Button type='link' onClick={() => handleDelete(record.id)}>
										Delete
									</Button>
								</>
							);
						}}
					/>
				</Table>
				<Col span={24}>
					<SectionHeader size={0} hgroup={3} mini title='Add a New Score' />
				</Col>
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
				<Modal visible={isEditModal} onOk={handleEditModalOk} onCancel={handleEditModalCancel}>
					<ScoreInput>
						<SectionHeader size={0} hgroup={3} mini title={currentSelectedRecord[0]?.name || ""} />
						<br></br>
						<span>Add Score</span>
						&nbsp;&nbsp;
						<input autoFocus={true} className='score-input' type='number' ref={inputEl} />
						<div>
							<br></br>
							<span>*Total score has to be less than 100.</span>
						</div>
					</ScoreInput>
				</Modal>
			</Wrapper>
		</Modal>
	);
}

ScoreModal.defaultProps = {
	styles: [],
	isModalVisible: false,
	selectedProductId: "",
	handleModalOk: () => {},
	handleModalCancel: () => {},
};

ScoreModal.propTypes = {
	styles: PropTypes.arrayOf(PropTypes.shape({})),
	isModalVisible: PropTypes.bool,
	selectedProductId: PropTypes.string,
	handleModalOk: PropTypes.func,
	handleModalCancel: PropTypes.func,
};
