import React, { useState, useEffect, ReactNode } from "react";
import { Modal, Row, Typography, Col, Input, Select } from "antd";

const { Text } = Typography;

interface CreateNewJob {
	isOpen: boolean;
	closeModal: () => void;
	createJob: (state: Record<string, string | number>) => void;
	loading: boolean;
}

const CreateNewJob: React.FC<CreateNewJob> = ({ isOpen, closeModal, createJob, loading }) => {
	const [state, setState] = useState({
		name: "",
		description: "",
		samples: 500,
		cameraType: "all",
		cameraSpecific: "",
	});

	useEffect(() => {
		setState({
			name: "",
			description: "",
			samples: 500,
			cameraType: "all",
			cameraSpecific: "",
		});
	}, [isOpen]);

	const onChange = (e): void => {
		const {
			target: { name, value },
		} = e;

		let valueToStore = value;

		if (name === "samples") {
			valueToStore = parseInt(value || "0", 10);
		}
		if (name === "cameraType") {
			if (value === "quick") {
				setState(prevState => ({
					...prevState,
					samples: 5,
				}));
			}
		}

		setState(prevState => ({
			...prevState,
			[name]: valueToStore,
		}));
	};

	const createButtonDisabled =
		state.name.length === 0 ||
		state.description.length === 0 ||
		state.samples === 0 ||
		(state.cameraType === "specific" && state.cameraSpecific.length === 0);

	return (
		<Modal
			visible={isOpen}
			onCancel={closeModal}
			title="Create New Job"
			okText="Create"
			okButtonProps={{
				disabled: createButtonDisabled,
				loading,
			}}
			onOk={(): void => createJob(state)}
		>
			<Row gutter={[8, 8]}>
				<Col span={24}>
					<Row gutter={[4, 4]}>
						<Col>
							<Text>Job name</Text>
						</Col>
						<Col>
							<Input name="name" value={state.name} onChange={onChange} placeholder="Name" />
						</Col>
					</Row>
				</Col>
				<Col span={24}>
					<Row gutter={[4, 4]}>
						<Col>
							<Text>Description</Text>
						</Col>
						<Col>
							<Input name="description" value={state.description} onChange={onChange} placeholder="Description" />
						</Col>
					</Row>
				</Col>
				<Col span={12}>
					<Row gutter={[4, 4]}>
						<Col>
							<Text>Sample Count</Text>
						</Col>
						<Col>
							<Input
								disabled={state.cameraType === "quick"}
								type="number"
								name="samples"
								value={state.samples}
								onChange={onChange}
								placeholder="Samples"
							/>
						</Col>
					</Row>
				</Col>
				<Col span={12}>
					<Row gutter={[4, 4]}>
						<Col>
							<Text>Camera Type</Text>
						</Col>
						<Col>
							<Select
								style={{ width: "100%" }}
								value={state.cameraType}
								onChange={(value): void => onChange({ target: { name: "cameraType", value } })}
							>
								<Select.Option value="quick">First Camera(Quick/Draft)</Select.Option>
								<Select.Option value="first">First Camera</Select.Option>
								<Select.Option value="specific">Specific Cameras</Select.Option>
								<Select.Option value="all">All Cameras</Select.Option>
							</Select>
						</Col>
					</Row>
				</Col>
				{state.cameraType === "specific" && (
					<Col span={24}>
						<Row gutter={[4, 4]}>
							<Col>
								<Text>Camera Name</Text>
							</Col>
							<Col>
								<Select
									dropdownRender={(): ReactNode => <></>}
									style={{ width: "100%" }}
									mode="tags"
									tokenSeparators={[","]}
									value={state.cameraSpecific === "" ? [] : state.cameraSpecific.split(",")}
									onChange={(value): void => onChange({ target: { name: "cameraSpecific", value: value.join(",") } })}
									placeholder="Camera Name"
								/>
							</Col>
						</Row>
					</Col>
				)}
			</Row>
		</Modal>
	);
};

export default CreateNewJob;
