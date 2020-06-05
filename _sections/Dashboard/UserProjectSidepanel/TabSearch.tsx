import { HumanizePhaseInternalNames, RoomNameSearch } from "@customTypes/dashboardTypes";
import { Status } from "@customTypes/userType";
import { Button, Col, DatePicker, Icon, Input, InputNumber, Row, Select, Typography } from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { SilentButton, SilentDivider } from "../styled";
import {
	phaseDefaultValues,
	SortOptions,
	UserProjectSidePanelInitialState,
	UserProjectSidePanelState,
} from "./reducer";

const { RangePicker } = DatePicker;

const { Text } = Typography;
const { Option } = Select;

const dateFormat = "MM-DD-YYYY";

const TabSearch = ({ setState: updateState, state: initialState }): JSX.Element => {
	const [state, setState] = useState<UserProjectSidePanelState>(UserProjectSidePanelInitialState);
	const [selectedSort, setSelectedSort] = useState(SortOptions["Created At - Newest First"]);
	const [minMax, setMinMax] = useState<number[]>([]);

	useEffect(() => {
		setState(initialState);
	}, []);

	const handleSearch = (value: string | number, type: string): void => {
		if (type === "min") {
			let copyValue = value as number;
			if (minMax[1]) {
				if (copyValue > minMax[1]) {
					copyValue = minMax[1] - 1;
				}
			}
			const currentTime = moment({ hour: 0, minute: 0, seconds: 0, milliseconds: 0 });
			setState({
				...state,
				endedAt: [copyValue || copyValue === 0 ? currentTime.add(copyValue, "days") : null, state.endedAt[1]],
			});
			setMinMax(prevState => {
				const newState = [...prevState];
				newState[0] = copyValue;
				return newState;
			});
			return;
		}
		if (type === "max") {
			let copyValue = value as number;

			if (minMax[0]) {
				if (copyValue < minMax[0]) {
					copyValue = minMax[0] + 1;
				}
			}

			const currentTime = moment({ hour: 0, minute: 0, seconds: 0, milliseconds: 0 });
			setState({
				...state,
				endedAt: [state.endedAt[0], copyValue || copyValue === 0 ? currentTime.add(copyValue, "days") : null],
			});

			setMinMax(prevState => {
				const newState = [...prevState];
				newState[1] = copyValue;
				return newState;
			});
			return;
		}

		if (type === "customer") {
			setState({
				...state,
				nameSearchText: value as string,
			});
		} else if (type === "designer") {
			setState({
				...state,
				designerSearchText: value as string,
			});
		}
	};

	const downloadCSV = (): void => {
		const jsonBlob = new Blob([JSON.stringify({ ...state, minMax }, null, 1)], { type: "text/plain;charset=utf-8" });

		const url = window.URL || window.webkitURL;
		const link = url.createObjectURL(jsonBlob);
		const a = document.createElement("a");
		a.download = `preset-data.jsode`;
		a.href = link;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
	};

	const handleSelectFilter = (value, type: "phase" | "name" | "sort" | "status"): void => {
		if (type === "sort") {
			setSelectedSort(JSON.parse(value));
			setState({
				...state,
				...JSON.parse(value),
			});
			return;
		}
		setState({ ...state, [type]: value });
	};

	const onDateChange = (field, value): void => {
		if (field === "endedAt") {
			const currentTime = moment({ hour: 0, minute: 0, seconds: 0, milliseconds: 0 });
			const minDuration = value[0] ? moment.duration(value[0].diff(currentTime)).days() : null;
			const maxDuration = value[1] ? moment.duration(value[1].diff(currentTime)).days() : null;
			setMinMax([minDuration, maxDuration]);
		}
		setState({
			...state,
			[field]: value,
		});
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
						<Button size="small" type="primary" onClick={downloadCSV}>
							<small>Download as JSON</small>
						</Button>
					</Col>
					<Col>
						<SilentButton
							onClick={(): void => {
								setState({ ...UserProjectSidePanelInitialState });
								setMinMax([]);
								setSelectedSort(SortOptions["Created At - Newest First"]);
							}}
							type="link"
						>
							<small>Reset Filters</small>
						</SilentButton>
					</Col>
				</Row>
			</Col>
			<Col>
				<Row gutter={[4, 16]}>
					<Col span={24}>
						<Row gutter={[0, 4]}>
							<Col>
								<Text strong>Customer Name</Text>
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
								<Text strong>Designer Name</Text>
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
								<Text strong>Phases</Text>
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
						<Row gutter={[8, 0]}>
							<Col span={24}>
								<Text strong>Start Date</Text>
							</Col>
							<Col span={24}>
								<RangePicker
									format={dateFormat}
									value={state.startedAt}
									mode="date"
									onChange={(value): void => onDateChange("startedAt", value)}
									placeholder={["From", "To"]}
								/>
							</Col>
						</Row>
					</Col>

					<Col span={24}>
						<Row gutter={[8, 0]}>
							<Col span={24}>
								<Text strong>
									Remaining Days for Delivery <small>(Can be negative)</small>
								</Text>
							</Col>
							<Col span={24}>
								<Row type="flex">
									<InputNumber
										style={{
											width: "45%",
											textAlign: "center",
											borderRadius: "0px",
											borderRight: 0,
										}}
										onChange={(value): void => {
											handleSearch(value, "min");
										}}
										value={minMax[0]}
										placeholder="Min(Optional)"
									/>
									<Input
										style={{
											width: "10%",
											borderLeft: 0,
											borderRight: 0,
											borderRadius: "0px",

											pointerEvents: "none",
											backgroundColor: "#fff",
										}}
										placeholder="~"
										disabled
									/>
									<InputNumber
										style={{
											width: "45%",
											textAlign: "center",
											borderLeft: 0,

											borderRadius: "0px",
										}}
										value={minMax[1]}
										onChange={(value): void => {
											handleSearch(value, "max");
										}}
										placeholder="Max(Optional)"
									/>
								</Row>
							</Col>
						</Row>
					</Col>
					<Col span={24}>
						<Row gutter={[8, 0]}>
							<Col span={24}>
								<Text strong>
									Delivery Date <small>(Delay not included)</small>
								</Text>
							</Col>
							<Col span={24}>
								<RangePicker
									format={dateFormat}
									value={state.endedAt}
									mode="date"
									onChange={(value): void => onDateChange("endedAt", value)}
									placeholder={["From", "To"]}
								/>
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
						<div style={{ padding: "1rem 0" }}>
							<SilentDivider />
						</div>
					</Col>
					<Col span={24}>
						<Row gutter={[0, 4]}>
							<Col>
								<Text strong>Sort Option</Text>
							</Col>
							<Col>
								<Select
									value={JSON.stringify(selectedSort)}
									style={{ width: "100%" }}
									onChange={(value): void => handleSelectFilter(value, "sort")}
								>
									{Object.keys(SortOptions).map(key => {
										return (
											<Option key={key} value={JSON.stringify(SortOptions[key])}>
												{key}
											</Option>
										);
									})}
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
