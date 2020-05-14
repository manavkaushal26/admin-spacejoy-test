import React, { useState } from "react";
import { Modal, Row, Col, Input } from "antd";

interface CreateNewSource {
	onCreate: (state: Record<string, string>) => void;
	isOpen: boolean;
	toggleModal: () => void;
	loading: boolean;
}

const CreateNewSource: React.FC<CreateNewSource> = ({ onCreate, isOpen, toggleModal, loading }) => {
	const [state, setState] = useState({
		name: "",
		description: "",
	});

	const onChange = (e): void => {
		const {
			target: { name, value },
		} = e;
		setState({
			...state,
			[name]: value,
		});
	};

	return (
		<Modal
			title="Create New Source"
			okText="Create"
			okButtonProps={{
				loading,
			}}
			onOk={(): void => onCreate(state)}
			visible={isOpen}
			onCancel={toggleModal}
		>
			<Row>
				<Col>
					<Row>
						<Col>Name</Col>
						<Col>
							<Input name="name" onChange={onChange} />
						</Col>
					</Row>
				</Col>
				<Col>
					<Row>
						<Col>Description</Col>
						<Col>
							<Input.TextArea name="description" onChange={onChange} />
						</Col>
					</Row>
				</Col>
			</Row>
		</Modal>
	);
};

export default CreateNewSource;
