import React, { useState, useEffect } from "react";
import { Row, Col, Select, Input, Typography, Collapse, Icon } from "antd";
import { RoomNameSearch, HumanizePhaseInternalNames } from "@customTypes/dashboardTypes";
import { Status } from "@customTypes/userType";
import { UserProjectSidePanelState, phaseDefaultValues, SortFields, UserProjectSidePanelInitialState } from "./reducer";
import { SilentButton } from "../styled";

const { Text } = Typography;
const { Option } = Select;

const TabSearch = ({ activePanel, setActivePanel, count, setState: updateState, state: initialState }): JSX.Element => {
	const [state, setState] = useState<UserProjectSidePanelState>(UserProjectSidePanelInitialState);

	useEffect(() => {
		setState(initialState);
	}, []);

	const handleSearch = (value: string, type: "customer" | "designer"): void => {
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
	]);

	return (
		<div style={{ zIndex: 1, width: "100%" }}>
			<Row type="flex" justify="end">
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
			<Row gutter={[4, 8]}>
				<Col span={24}>
					<Row gutter={[0, 4]}>
						<Col>
							<Text>Customer</Text>
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
							<Text>Designer</Text>
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
							<Text>Room Name</Text>
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
							<Text>Phase</Text>
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
							<Text>Status</Text>
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
							<Text>Sort by</Text>
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
							<Text>Sort order</Text>
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
		</div>
	);
};

export default TabSearch;
