import React, { useState } from "react";
import { Modal, Input, Typography, Row, Col, notification } from "antd";
import { addRetailerApi } from "@api/assetApi";
import fetcher from "@utils/fetcher";
import { MetaDataType } from "@customTypes/moodboardTypes";
import { AssetAction, ASSET_ACTION_TYPES } from "../reducer";

const { Text } = Typography;

interface AddRetailerModal {
	addRetailerModalVisible: boolean;
	dispatch: React.Dispatch<AssetAction>;
	metadata: MetaDataType;
	toggleAddRetailerModal: () => void;
}

enum InputFields {
	Name = "NAME",
	Url = "URL",
}

const AddRetailerModal: React.FC<AddRetailerModal> = ({
	addRetailerModalVisible,
	dispatch,
	metadata,
	toggleAddRetailerModal,
}) => {
	const [name, setName] = useState("");
	const [url, setUrl] = useState("");
	const [urlError, setUrlError] = useState<boolean>(true);

	const [loading, setLoading] = useState<boolean>(false);

	const onChange = (e): void => {
		e.persist();
		const {
			target: {
				id,
				value,
				validity: { typeMismatch },
			},
		} = e;
		switch (id) {
			case InputFields.Name:
				setName(value);
				break;
			case InputFields.Url:
				if (typeMismatch || value === "") {
					setUrlError(true);
				} else {
					setUrlError(false);
				}
				setUrl(value);
				break;
			default:
		}
	};

	const addRetailer = async (): Promise<void> => {
		setLoading(true);
		const endPoint = addRetailerApi();
		const response = await fetcher({
			endPoint,
			method: "POST",
			body: {
				data: {
					name,
					url,
					serviceType: "furniture",
					country: "us",
				},
			},
		});
		if (response.status === "success") {
			const retailers = { ...metadata.retailers };
			retailers.list.push(response.data);
			retailers.count += 1;
			dispatch({ type: ASSET_ACTION_TYPES.METADATA, value: { ...metadata, retailers } });
			notification.success({ message: "Retailer Added" });
			toggleAddRetailerModal();
		} else {
			notification.error({ message: "Failed to add Retailer" });
		}
		setLoading(false);
	};

	return (
		<Modal
			okText="Add"
			okButtonProps={{ disabled: urlError || !name.length, loading }}
			visible={addRetailerModalVisible}
			title="Add Retailer"
			onOk={addRetailer}
			onCancel={toggleAddRetailerModal}
		>
			<Row gutter={[0, 8]}>
				<Col>
					<Row gutter={[0, 4]}>
						<Col span={24}>
							<Text>Name</Text>
						</Col>
						<Col span={24}>
							<Input value={name} id={InputFields.Name} onChange={onChange} type="text" minLength={1} />
						</Col>
						{!name.length && (
							<Col span={24}>
								<small>
									<Text>Please Enter the Retailer Name</Text>
								</small>
							</Col>
						)}
					</Row>
				</Col>
				<Col>
					<Row gutter={[0, 4]}>
						<Col span={24}>
							<Text>URL</Text>
						</Col>
						<Col span={24}>
							<Input value={url} id={InputFields.Url} onChange={onChange} type="url" />
						</Col>
						{urlError && (
							<Col span={24}>
								<small>
									<Text>Enter URL in the following format. http(s)://example.com/</Text>
								</small>
							</Col>
						)}
					</Row>
				</Col>
			</Row>
		</Modal>
	);
};

export default AddRetailerModal;
