import InputField from "@components/Inputs/InputField";
import { Feature } from "@customTypes/pricesTypes";
import { SilentDivider } from "@sections/Dashboard/styled";
import { Button, Card, Col, List, Popconfirm, Row, Typography } from "antd";
import React, { useEffect, useState } from "react";

const { Text } = Typography;

const ShowFeatureList = ({ list, remove }: { list: Feature[]; remove: (index: number) => void }): JSX.Element => {
	return (
		<List
			itemLayout="horizontal"
			dataSource={list}
			renderItem={(item: Feature, index): JSX.Element => (
				<List.Item
					key={item.label}
					actions={[
						<Popconfirm title="Are you sure?" key="delete" onConfirm={(): void => remove(index)}>
							<Button danger type="primary" size="small">
								Delete
							</Button>
						</Popconfirm>,
					]}
				>
					<List.Item.Meta
						title={
							<Text>
								{index + 1}. {item.label}
							</Text>
						}
						description={item.helpText}
					/>
				</List.Item>
			)}
		/>
	);
};

const MultiInputField: React.FC<{ list: Feature[]; onChange: (name, value) => void; name: string }> = ({
	list,
	onChange: saveFeatures,
	name: nameOfFeature,
}) => {
	const [copyList, setCopyList] = useState<Feature[]>([...list]);
	const [newInput, setNewInput] = useState({
		label: "",
		helpText: "",
		position: null,
	});

	const onChange = (name, changedvalue): void => {
		if (name === "position") {
			if (Number.isNaN(parseInt(changedvalue, 10))) {
				setNewInput({
					...newInput,
					position: null,
				});
				return;
			}
			setNewInput({
				...newInput,
				position: parseInt(changedvalue, 10),
			});
			return;
		}
		setNewInput({
			...newInput,
			[name]: changedvalue,
		});
	};

	const addToList = (): void => {
		if (newInput.label) {
			if (!Number.isNaN(newInput.position) && newInput.position) {
				const firstHalf = [...copyList].splice(0, newInput.position - 1);
				const secondHalf = [...copyList].splice(newInput.position - 1, copyList.length);
				setCopyList([
					...firstHalf,
					{
						label: newInput.label,
						helpText: newInput.helpText,
					},
					...secondHalf,
				]);
			} else {
				setCopyList([
					...copyList,
					{
						label: newInput.label,
						helpText: newInput.helpText,
					},
				]);
			}
			setNewInput({
				label: "",
				helpText: "",
				position: null,
			});
		}
	};

	useEffect(() => {
		saveFeatures(nameOfFeature, copyList);
	}, [copyList]);

	const onDelete = (index): void => {
		const newArray = [...copyList];
		newArray.splice(index, 1);
		setCopyList([...newArray]);
	};

	return (
		<Row gutter={[8, 4]}>
			<Col span={24}>
				<ShowFeatureList list={copyList} remove={onDelete} />
			</Col>
			<Col span={24}>
				<SilentDivider />
			</Col>
			<Col span={24}>
				<Row gutter={[4, 4]}>
					<Col span={24}>
						<Text strong>Add New Feature</Text>
					</Col>
					<Col span={24}>
						<Card size="small">
							<Col span={24}>
								<InputField onChange={onChange} label="Label" name="label" value={newInput.label} />
							</Col>
							<Col span={24}>
								<InputField onChange={onChange} label="Help Text" name="helpText" value={newInput.helpText} />
							</Col>
							<Col span={24}>
								<InputField onChange={onChange} label="Position" name="position" value={newInput.position} />
							</Col>
							<Col span={24}>
								<Row justify="end">
									<Button onClick={addToList} type="primary">
										Add
									</Button>
								</Row>
							</Col>
						</Card>
					</Col>
				</Row>
			</Col>
		</Row>
	);
};

export default MultiInputField;
