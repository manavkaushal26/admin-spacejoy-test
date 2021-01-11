import SectionHeader from "@sections/SectionHeader";
import fetcher from "@utils/fetcher";
import { updateResource } from "@utils/styleQuizHelper";
import { Button, Col, Modal, notification, Row, Select, Table } from "antd";
import PropTypes from "prop-types";
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
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
		await updateResource("/v1/quizImages/scores", "DELETE", { scoreId: id });
		getLatestScores();
	};

	useEffect(() => {
		if (selectedProductId) {
			getLatestScores();
		}
	}, [selectedProductId]);

	const handleKeyDown = e => {
		if (e.which === 13) {
			handleEditModalOk();
			setEditModal(false);
		}
	};

	useEffect(() => {
		if (inputEl?.current) {
			setTimeout(() => {
				inputEl.current.focus();
			});
		}
	}, [isEditModal]);

	useEffect(() => {
		setScores([]);
	}, [isModalVisible]);

	const getLatestScores = () => {
		const endPoint = `/v1/quizImages/${selectedProductId}/scores`;
		fetchResources(endPoint)
			.then(res => {
				filterScoresData(res.scores);
			})
			.catch(err => {
				throw new Error();
			});
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
			notification.error({ message: "Score cannot be empty" });
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
	};

	const handleEdit = async (row, type) => {
		if (type.toLowerCase() === "edit") {
			const scoresCopy = scores.map(item => {
				if (item?.id === row?.id) {
					return {
						...item,
						isActive: true,
					};
				}
				return { ...item };
			});
			setScores(scoresCopy);
		} else if (type.toLowerCase() === "save") {
			try {
				await updateResource("/v1/quizImages/scores", "PUT", {
					imageId: selectedProductId,
					styleId: row?.styleId,
					score: row?.score,
				});
				const scoresCopy = scores.map(item => {
					if (item?.id === row?.id) {
						return {
							...item,
							isActive: false,
							score: row?.score,
						};
					}
					return { ...item, isActive: false };
				});
				notification.success({ message: "Score updated." });
				setScores(scoresCopy);
			} catch {
				notification.error({ message: "Failed to updated score. Total score has to be less than 100." });
			}
		}
	};

	const addNewScore = async () => {
		await updateResource("/v1/quizImages/scores", "POST", {
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
			.catch(err => {
				notification.error({ message: "Score cannot be added. Total score has to be less than 100." });
			});
		if (inputEl?.current) inputEl.current.value = "";
	};

	const onScoreChange = (id, e) => {
		const updatedScores = scores.map(score => {
			if (score.id === id) {
				return {
					...score,
					score: parseInt(e.target.value),
				};
			}
			return { ...score };
		});
		setScores(updatedScores);
	};

	return (
		<Modal
			title='Scores'
			visible={isModalVisible}
			onOk={handleModalOk}
			onCancel={handleModalCancel}
			width={1000}
			footer={null}
		>
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
					onSelect={record => handleChange(record)}
				>
					{styles.map((style, index) => {
						return (
							<Select.Option key={style?.id} value={style?.id}>
								{style?.name}
							</Select.Option>
						);
					})}
				</Select>
				<Modal visible={isEditModal} onOk={handleEditModalOk} onCancel={handleEditModalCancel}>
					<ScoreInput>
						<SectionHeader size={0} hgroup={3} mini title={currentSelectedRecord[0]?.name || ""} />
						<br></br>
						<span>Add Score</span>
						&nbsp;&nbsp;
						<input onKeyDown={handleKeyDown} className='score-input' type='number' ref={inputEl} />
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
	handleModalOk: () => {
		/**/
	},
	handleModalCancel: () => {
		/**/
	},
};

ScoreModal.propTypes = {
	styles: PropTypes.arrayOf(PropTypes.shape({})),
	isModalVisible: PropTypes.bool,
	selectedProductId: PropTypes.string,
	handleModalOk: PropTypes.func,
	handleModalCancel: PropTypes.func,
};
