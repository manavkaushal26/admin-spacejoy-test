import React, { useState, useEffect, ReactNode, useRef } from "react";
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

	const [renderTypeSelected, setRenderTypeSelected] = useState(true);

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
	const sampleRef = useRef();
	const renderTypeChange = (value: number): void => {
		setState(prevState => ({
			...prevState,
			samples: value,
		}));
		if (value === 0) {
			setRenderTypeSelected(false);
		} else {
			setRenderTypeSelected(true);
		}
	};

	const createButtonDisabled =
		state.name.length === 0 ||
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
							<Text>Render Type</Text>
						</Col>
						<Col>
							<Select style={{ width: "100%" }} onChange={renderTypeChange} defaultValue={500}>
								<Select.Option value={5}>Quick</Select.Option>
								<Select.Option value={500}>HD</Select.Option>
								<Select.Option value={1200}>Full HD</Select.Option>
								<Select.Option value={0}>Specify Sample Count</Select.Option>
							</Select>
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
								ref={sampleRef}
								type="number"
								name="samples"
								value={state.samples}
								onChange={onChange}
								disabled={renderTypeSelected}
								placeholder="Samples"
							/>
						</Col>
					</Row>
				</Col>
				<Col span={24}>
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
