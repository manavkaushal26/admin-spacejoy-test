import { HumanizePhaseInternalNames, RoomNameSearch } from "@customTypes/dashboardTypes";
import { Status } from "@customTypes/userType";
import { Button, Col, Icon, Input, Row, Select, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { SilentButton } from "../styled";
import { phaseDefaultValues, SortFields, UserProjectSidePanelInitialState, UserProjectSidePanelState } from "./reducer";

const { Text } = Typography;
const { Option } = Select;

const TabSearch = ({ setState: updateState, state: initialState }): JSX.Element => {
	const [state, setState] = useState<UserProjectSidePanelState>(UserProjectSidePanelInitialState);

	useEffect(() => {
		setState(initialState);
	}, []);

	const handleSearch = (value: string, type: string): void => {
		if (type === "customer") {
			setState({
				...state,
				nameSearchText: value,
			});
		} else if (type === "designer") {
			setState({
				...state,
				designerSearchText: value,
			});
		} else if (type.split("-").length === 2) {
			const name = type.split("-")[0];
			const position = type.split("-")[1];
			const modifiedValue = state[name];
			modifiedValue[position] = value;

			setState({
				...state,
				[name]: [...modifiedValue],
			});
		}
	};

	const handleSelectFilter = (value, type: "phase" | "name" | "sortOrder" | "sortBy" | "status"): void => {
		setState({ ...state, [type]: value });
	};

	useEffect(() => {
		updateState(state);
	}, [
		state.nameSearchText,
		state.designerSearchText,
		state.phase,
		state.sortBy,
		state.sortOrder,
		state.status,
		state.name,
		state.endedAt,
		state.startedAt,
	]);

	return (
		<Row gutter={[8, 8]}>
			<Col>
				<Row type="flex" justify="space-between">
					<Col>
						<Button disabled size="small" type="primary">
							<small>Presets</small>
						</Button>
					</Col>
					<Col>
						<SilentButton
							onClick={(): void => {
								setState({ ...UserProjectSidePanelInitialState });
							}}
							type="link"
						>
							<small>Reset Filters</small>
						</SilentButton>
					</Col>
				</Row>
			</Col>
			<Col>
				<Row gutter={[4, 8]}>
					<Col span={24}>
						<Row gutter={[0, 4]}>
							<Col>
								<Text strong>Customer</Text>
							</Col>
							<Col>
								<Input
									value={state.nameSearchText}
									style={{ width: "100%" }}
									onChange={(e): void => {
										const {
											target: { value },
										} = e;
										handleSearch(value, "customer");
									}}
									placeholder="Customer Name"
									allowClear
									prefix={<Icon type="search" />}
								/>
							</Col>
						</Row>
					</Col>
					<Col span={12}>
						<Row gutter={[0, 4]}>
							<Col>
								<Text strong>Designer</Text>
							</Col>
							<Col>
								<Input
									value={state.designerSearchText}
									style={{ width: "100%" }}
									onChange={(e): void => {
										e.persist();
										const {
											target: { value },
										} = e;
										handleSearch(value, "designer");
									}}
									placeholder="Designer Name"
									allowClear
									prefix={<Icon type="search" />}
								/>
							</Col>
						</Row>
					</Col>
					<Col span={12}>
						<Row gutter={[0, 4]}>
							<Col>
								<Text strong>Room Name</Text>
							</Col>
							<Col>
								<Select
									value={state.name}
									style={{ width: "100%" }}
									defaultValue={null}
									onChange={(value): void => handleSelectFilter(value, "name")}
								>
									<Option value="">Filter by Room Name</Option>
									{RoomNameSearch.map(roomName => {
										return (
											<Option key={roomName} value={roomName}>
												{roomName}
											</Option>
										);
									})}
								</Select>
							</Col>
						</Row>
					</Col>
					<Col span={24}>
						<Row gutter={[0, 4]}>
							<Col>
								<Text strong>Phase</Text>
							</Col>
							<Col>
								<Select
									value={state.phase}
									style={{ width: "100%" }}
									defaultValue={phaseDefaultValues}
									mode="multiple"
									maxTagCount={2}
									placeholder="All Phases Shown"
									onChange={(value): void => handleSelectFilter(value, "phase")}
								>
									{Object.keys(HumanizePhaseInternalNames).map(key => {
										return (
											<Option key={key} value={key}>
												{HumanizePhaseInternalNames[key]}
											</Option>
										);
									})}
								</Select>
							</Col>
						</Row>
					</Col>

					<Col span={24}>
						<Row gutter={[0, 4]}>
							<Col>
								<Text strong>Status</Text>
							</Col>
							<Col>
								<Select
									value={state.status}
									style={{ width: "100%" }}
									defaultValue={Status.active}
									maxTagCount={2}
									placeholder="All Status Shown"
									onChange={(value): void => handleSelectFilter(value, "status")}
								>
									{Object.keys(Status).map(key => {
										return (
											<Option key={key} value={Status[key]}>
												{key}
											</Option>
										);
									})}
								</Select>
							</Col>
						</Row>
					</Col>

					<Col span={24}>
						<Row gutter={[8, 0]}>
							<Col span={24}>
								<Text strong>Started</Text>
							</Col>
							<Col span={12}>
								<Row>
									<Col>
										<Text>
											<small>From</small>
										</Text>
									</Col>
									<Col>
										<Input
											value={state.startedAt[0]}
											name="startedAt-0"
											onChange={(e): void => {
												const {
													target: { value },
												} = e;
												handleSearch(value, "startedAt-0");
											}}
											type="date"
										/>
									</Col>
								</Row>
							</Col>
							<Col span={12}>
								<Row>
									<Col>
										<Text>
											<small>To</small>
										</Text>
									</Col>
									<Col>
										<Input
											value={state.startedAt[1]}
											name="startedAt-1"
											onChange={(e): void => {
												const {
													target: { value },
												} = e;
												handleSearch(value, "startedAt-1");
											}}
											type="date"
										/>
									</Col>
								</Row>
							</Col>
						</Row>
					</Col>
					<Col span={24}>
						<Row gutter={[8, 0]}>
							<Col span={24}>
								<Text strong>Ends</Text>
							</Col>
							<Col span={12}>
								<Row>
									<Col>
										<Text>
											<small>From</small>
										</Text>
									</Col>
									<Col>
										<Input
											name="endedAt-0"
											value={state.endedAt[0]}
											onChange={(e): void => {
												const {
													target: { value },
												} = e;
												handleSearch(value, "endedAt-0");
											}}
											type="date"
										/>
									</Col>
								</Row>
							</Col>
							<Col span={12}>
								<Row>
									<Col>
										<Text>
											<small>To</small>
										</Text>
									</Col>
									<Col>
										<Input
											name="endedAt-1"
											value={state.startedAt[1]}
											onChange={(e): void => {
												const {
													target: { value },
												} = e;
												handleSearch(value, "endedAt-1");
											}}
											type="date"
										/>
									</Col>
								</Row>
							</Col>
						</Row>
					</Col>

					<Col span={24}>
						<Row gutter={[0, 4]}>
							<Col>
								<Text strong>Status</Text>
							</Col>
							<Col>
								<Select
									value={state.status}
									style={{ width: "100%" }}
									defaultValue={Status.active}
									maxTagCount={2}
									placeholder="All Status Shown"
									onChange={(value): void => handleSelectFilter(value, "status")}
								>
									{Object.keys(Status).map(key => {
										return (
											<Option key={key} value={Status[key]}>
												{key}
											</Option>
										);
									})}
								</Select>
							</Col>
						</Row>
					</Col>

					<Col span={12}>
						<Row gutter={[0, 4]}>
							<Col>
								<Text strong>Sort by</Text>
							</Col>
							<Col>
								<Select
									value={state.sortBy}
									style={{ width: "100%" }}
									defaultValue={SortFields["End Date"]}
									onChange={(value): void => handleSelectFilter(value, "sortBy")}
								>
									{Object.keys(SortFields).map(key => {
										return (
											<Option key={key} value={SortFields[key]}>
												{key}
											</Option>
										);
									})}
								</Select>
							</Col>
						</Row>
					</Col>
					<Col span={12}>
						<Row gutter={[0, 4]}>
							<Col>
								<Text strong>Sort order</Text>
							</Col>
							<Col>
								<Select
									value={state.sortOrder}
									style={{ width: "100%" }}
									onChange={(value): void => handleSelectFilter(value, "sortOrder")}
									defaultValue={1}
								>
									<Option value={-1}>Descending</Option>
									<Option value={1}>Ascending</Option>
								</Select>
							</Col>
						</Row>
					</Col>
				</Row>
			</Col>
		</Row>
	);
};

export default TabSearch;
