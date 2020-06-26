import { LockOutlined, UnlockOutlined } from "@ant-design/icons";
import { editRevisionFormAPI } from "@api/projectApi";
import InputField from "@components/Inputs/InputField";
import SelectField from "@components/Inputs/SelectField";
import { RevisionForm } from "@customTypes/dashboardTypes";
import { SilentDivider } from "@sections/Dashboard/styled";
import fetcher from "@utils/fetcher";
import { Button, Col, Drawer, notification, Row, Switch, Typography } from "antd";
import React, { useEffect, useState } from "react";

const { Text } = Typography;

interface EditRevisionDataDrawer {
	open: boolean;
	toggleDrawer: () => void;
	revisionData: RevisionForm;
	updateRevisonData: (data: RevisionForm) => void;
}

interface StateType extends RevisionForm {
	revisionType: string;
}
const EditRevisionDataDrawer: React.FC<EditRevisionDataDrawer> = ({
	open,
	toggleDrawer,
	revisionData,
	updateRevisonData,
}) => {
	const [state, setState] = useState<Partial<StateType>>({
		meta: {
			...revisionData.meta,
		},
		isLocked: revisionData.isLocked,
		revisionType: revisionData.diy.isActive ? "diy" : "dar",
	});
	const [prevState, setPrevState] = useState<Partial<StateType>>(null);

	useEffect(() => {
		setState({
			meta: {
				...revisionData.meta,
			},
			isLocked: revisionData.isLocked,
			revisionType: revisionData.diy.isActive ? "diy" : "dar",
		});
	}, [revisionData, open]);

	useEffect(() => {
		setPrevState(revisionData);
		return (): void => {
			setState({ ...revisionData });
		};
	}, [open]);

	const handleChange = (name, value): void => {
		if (name.split(".").length === 2) {
			const [level, subLevel] = name.split(".");

			setState({
				...state,
				[level]: {
					...state[level],
					[subLevel]: value,
				},
			});

			return;
		}
		setState({
			...state,
			[name]: value,
		});
	};

	const onSave = async (revert?: Partial<StateType>): Promise<void> => {
		const endPoint = editRevisionFormAPI(revisionData.project);
		if (state.meta.maxRevisionsAllowed === revisionData.revisionVersion && !state.isLocked) {
			notification.error({
				message: "Cannot unlock revision form",
				description: "Please increase the maximum Revisions allowed for project to proceed",
			});
			return;
		}
		const body = {
			meta: {
				...(revert ? revert.meta : state.meta),
			},
			isLocked: revert ? revert.isLocked : state.isLocked,
			revisionType: revert ? revert.revisionType : state.revisionType,
		};
		try {
			const response = await fetcher({ endPoint, body, method: "PUT" });
			if (response.statusCode < 300) {
				setPrevState({
					...state,
				});
				setState({
					meta: {
						...response.data.meta,
					},
					isLocked: response.data.isLocked,
					revisionType: response.data.diy.isActive ? "diy" : "dar",
				});
				updateRevisonData({
					...revisionData,
					...response.data,
				});
				notification.success({
					key: "success",
					message: "Updated Revision Form",
					description: revert ? "Changes have been reverted" : "Click on this notification to undo changes",
					duration: 10,
					onClick: revert
						? undefined
						: (): void => {
								notification.close("success");
								onSave(prevState);
						  },
					onClose: () => setPrevState(state),
				});
			} else {
				notification.error({ message: "Failed to Update revision form" });
			}
		} catch (e) {
			notification.error({ message: "Failed to Update revision form" });
		}
	};

	return (
		<Drawer visible={open} width={360} onClose={toggleDrawer} title="Edit Revision Details">
			<Row gutter={[16, 16]}>
				{false && (
					<Col>
						<SelectField
							name="revisionType"
							label="Revision Type"
							value={state.revisionType}
							options={[
								{
									_id: "dar",
									name: "Designer Assisted Revision(D.A.R)",
								},
								{
									_id: "diy",
									name: "Do It Yourself(D.I.Y)",
								},
							]}
							onChange={handleChange}
						/>
					</Col>
				)}
				{revisionData.isLocked && (
					<Col>
						<Row gutter={[8, 8]}>
							<Col span={24}>
								<Text strong type="secondary">
									Unlock Revision form for customer?
								</Text>
								<Text strong>
									<small />
								</Text>
								<SilentDivider />
							</Col>
							<Col span={24}>
								<Switch
									checkedChildren={<LockOutlined />}
									unCheckedChildren={<UnlockOutlined />}
									checked={state.isLocked}
									onChange={(value): void => handleChange("isLocked", value)}
								/>
							</Col>
							<Col span={24}>
								<Text>
									<small>
										<sup>*</sup>
										Please Note: The current revision changes are incomplete. Unlocking will allow the customer to
										submit a new revision request.
									</small>
								</Text>
							</Col>
						</Row>
					</Col>
				)}
				<Col span={24}>
					<Row gutter={[8, 8]}>
						<Col span={24}>
							<Text strong type="secondary">
								Meta
							</Text>
							<SilentDivider />
						</Col>
						<Col span={24}>
							<InputField
								name="meta.maxRevisionsAllowed"
								label="Maximum Revision's Allowed"
								value={state.meta.maxRevisionsAllowed}
								onChange={handleChange}
							/>
						</Col>
						<Col span={24}>
							<InputField
								name="meta.maxProductRequestsAllowed"
								label="Maximum Product Requests Allowed"
								value={state.meta.maxProductRequestsAllowed}
								onChange={handleChange}
							/>
						</Col>

						<Col span={24}>
							<InputField
								name="meta.minRevisionTat"
								label="Minimum Revision TAT"
								value={state.meta.minRevisionTat}
								onChange={handleChange}
							/>
						</Col>
						<Col span={24}>
							<InputField
								name="meta.maxRevisionTat"
								label="Minimum Revision TAT"
								value={state.meta.maxRevisionTat}
								onChange={handleChange}
							/>
						</Col>
					</Row>
				</Col>
				<Col span={24}>
					<Row justify="end" gutter={[4, 4]}>
						<Col>
							<Button onClick={toggleDrawer}>Cancel</Button>
						</Col>
						<Col>
							<Button
								type="primary"
								onClick={(): void => {
									onSave();
								}}
							>
								Save
							</Button>
						</Col>
					</Row>
				</Col>
			</Row>
		</Drawer>
	);
};

export default EditRevisionDataDrawer;
