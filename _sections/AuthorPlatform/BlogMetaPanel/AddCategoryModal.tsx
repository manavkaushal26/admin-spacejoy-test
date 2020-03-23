import React, { useReducer } from "react";
import { Modal, Row, Input, Col } from "antd";

export interface AddCategoryModalState {
	title: string;
	description: string;
}

const initialState: AddCategoryModalState = {
	title: "",
	description: "",
};

enum AddCategoryActions {
	SET_DATA,
}

interface AddCategoryActionType {
	type: AddCategoryActions;
	value: Partial<AddCategoryModalState>;
}

export interface AddCategoryModalReducer {
	(state: AddCategoryModalState, action: AddCategoryActionType): AddCategoryModalState;
}

const addCategoryModalReducer = (
	state: AddCategoryModalState,
	action: AddCategoryActionType
): AddCategoryModalState => {
	switch (action.type) {
		case AddCategoryActions.SET_DATA:
			return {
				...state,
				...action.value,
			};
		default:
			return state;
	}
};

interface AddCategoryModal {
	loading: boolean;
	onOk: (data: AddCategoryModalState) => void;
	visible: boolean;
	onCancel: () => void;
}

const AddCategoryModal: React.FC<AddCategoryModal> = ({ onOk, visible, onCancel }) => {
	const [state, dispatch] = useReducer<AddCategoryModalReducer>(addCategoryModalReducer, initialState);

	const onChange = (e): void => {
		const {
			target: { name, value },
		} = e;
		dispatch({
			type: AddCategoryActions.SET_DATA,
			value: {
				[name]: value,
			},
		});
	};

	return (
		<Modal
			title="Add new Category"
			onOk={(): void => onOk(state)}
			okButtonProps={{
				disabled: state.title.length === 0,
			}}
			onCancel={onCancel}
			visible={visible}
		>
			<Row gutter={[8, 8]}>
				<Col>
					<Row gutter={[4, 4]}>
						<Col>Title</Col>
						<Col>
							<Input value={state.title} onChange={onChange} name="title" />
						</Col>
					</Row>
				</Col>
				<Col>
					<Row gutter={[4, 4]}>
						<Col>Description</Col>
						<Col>
							<Input.TextArea value={state.description} onChange={onChange} name="description" />
						</Col>
					</Row>
				</Col>
			</Row>
		</Modal>
	);
};

export default React.memo(AddCategoryModal);
