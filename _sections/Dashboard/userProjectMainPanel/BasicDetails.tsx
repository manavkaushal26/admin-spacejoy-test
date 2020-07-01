import { DetailedProject, PaymentStatus } from "@customTypes/dashboardTypes";
import { ProjectRoles } from "@customTypes/userType";
import { getValueSafely } from "@utils/commonUtils";
import { Col, Row, Typography, Collapse, Tooltip } from "antd";
import moment from "moment";
import React, { useMemo } from "react";
import { ModifiedText } from "../styled";

const { Text } = Typography;

interface BasicDetailsProps {
	projectData?: Partial<DetailedProject>;
}

const TeamTooltip: React.FC<{
	accountManagers: string;
	artists: string;
	designerTeam: string;
}> = ({ accountManagers, artists, designerTeam }) => {
	return (
		<Row gutter={[8, 8]}>
			<Col>
				<Row gutter={[4, 4]}>
					<Col>
						<Text style={{ textTransform: "capitalize", color: "white" }} strong>
							Account Managers:
						</Text>
					</Col>
					<Col>
						<Text style={{ textTransform: "capitalize", color: "white" }}>
							{accountManagers.length ? accountManagers : "Not Assigned"}
						</Text>
					</Col>
				</Row>
			</Col>
			<Col>
				<Row gutter={[4, 4]}>
					<Col>
						<Text style={{ textTransform: "capitalize", color: "white" }} strong>
							Designers:
						</Text>
					</Col>
					<Col>
						<Text style={{ textTransform: "capitalize", color: "white" }}>
							{designerTeam.length ? designerTeam : "Not Assigned"}
						</Text>
					</Col>
				</Row>
			</Col>
			<Col>
				<Row gutter={[4, 4]}>
					<Col>
						<Text style={{ textTransform: "capitalize", color: "white" }} strong>
							3D Artists:
						</Text>
					</Col>
					<Col>
						<Text style={{ textTransform: "capitalize", color: "white" }}>
							{artists.length ? artists : "Not Assigned"}
						</Text>
					</Col>
				</Row>
			</Col>
		</Row>
	);
};

const BasicDetails: React.FC<BasicDetailsProps> = ({ projectData }) => {
	const { _id, name, createdAt, team, customer, startedAt } = projectData;

	const items = getValueSafely(
		() =>
			projectData.order.items.map(item => {
				return item.name;
			}),
		[]
	);

	const paymentStatus = getValueSafely(() => projectData.order.paymentStatus, PaymentStatus.pending);

	const designerTeam = useMemo(
		() =>
			team
				.filter(member => {
					return getValueSafely(() => member.member.role, ProjectRoles.Designer) === ProjectRoles.Designer;
				})
				.map(teamMember => {
					return getValueSafely(() => teamMember.member.profile.name, teamMember.memberName);
				})
				.join(", "),
		[projectData.team]
	);

	const artistTeam = useMemo(
		() =>
			team
				.filter(member => {
					getValueSafely(() => member.member.role, ProjectRoles["3D Artist"]) === ProjectRoles["3d Artist"];
				})
				.map(teamMember => {
					return getValueSafely(() => teamMember.member.profile.name, teamMember.memberName);
				})
				.join(", "),
		[projectData.team]
	);
	const accountManagers = useMemo(
		() =>
			team
				.filter(member => {
					return getValueSafely(() => member.member.role, ProjectRoles.Designer) === ProjectRoles["Account Manager"];
				})
				.map(manager => {
					return getValueSafely(() => manager.member.profile.name, manager.memberName);
				})
				.join(", "),
		[projectData.team]
	);
	return (
		<Collapse>
			<Collapse.Panel header='Project Details' key='projectDetails'>
				<Row justify='space-between' gutter={[16, 16]}>
					<Col sm={12} md={12} lg={8} xl={8}>
						<Row gutter={[4, 8]}>
							<Col>
								<Text strong>Project Id:</Text>
							</Col>
							<Col>
								<ModifiedText type='secondary'>{_id}</ModifiedText>
							</Col>
						</Row>
					</Col>
					<Col sm={12} md={12} lg={8} xl={8}>
						<Row gutter={[4, 8]}>
							<Col>
								<Text strong>Account Manager:</Text>
							</Col>
							<Col>
								<ModifiedText textTransform='capitalize' type='secondary'>
									{accountManagers || "Not Assigned"}
								</ModifiedText>
							</Col>
						</Row>
					</Col>
					<Col sm={12} md={12} lg={8} xl={8}>
						<Row gutter={[4, 8]}>
							<Col>
								<Text strong>Created on:</Text>
							</Col>
							<Col>
								<ModifiedText textTransform='capitalize' type='secondary'>
									{moment(createdAt).format("MM-DD-YYYY")}
								</ModifiedText>
							</Col>
						</Row>
					</Col>
					<Col sm={12} md={12} lg={8} xl={8}>
						<Row gutter={[4, 8]}>
							<Col>
								<Text strong>Payment Status:</Text>
							</Col>
							<Col>
								<ModifiedText textTransform='capitalize' type='secondary'>
									{paymentStatus}
								</ModifiedText>
							</Col>
						</Row>
					</Col>
					<Col sm={12} md={12} lg={8} xl={8}>
						<Row gutter={[4, 8]}>
							<Col>
								<Text strong>Assigned Team:</Text>
							</Col>
							<Col>
								<Tooltip
									color='geekblue'
									title={
										<TeamTooltip artists={artistTeam} designerTeam={designerTeam} accountManagers={accountManagers} />
									}
								>
									<ModifiedText textTransform='capitalize' type='secondary'>
										{designerTeam || "Not assigned"}
									</ModifiedText>
								</Tooltip>
							</Col>
						</Row>
					</Col>
					<Col sm={12} md={12} lg={8} xl={8}>
						<Row gutter={[4, 8]}>
							<Col>
								<Text strong>Started on:</Text>
							</Col>
							<Col>
								<ModifiedText textTransform='capitalize' type='secondary'>
									{startedAt ? moment(startedAt).format("MM-DD-YYYY") : "Not yet started"}
								</ModifiedText>
							</Col>
						</Row>
					</Col>

					<Col sm={12} md={12} lg={8} xl={8}>
						<Row gutter={[4, 8]}>
							<Col>
								<Text strong>Phone:</Text>
							</Col>
							<Col>
								<ModifiedText textTransform='capitalize' type='secondary'>
									<a
										href={`tel:${getValueSafely(
											() => customer.contact.phone.find(phone => phone.primary).phone,
											"N/A"
										)}`}
									>
										{getValueSafely(() => customer.contact.phone.find(phone => phone.primary).phone, "N/A")}
									</a>
								</ModifiedText>
							</Col>
						</Row>
					</Col>
					<Col sm={12} md={12} lg={8} xl={8}>
						<Row gutter={[4, 8]}>
							<Col>
								<Text strong>Email:</Text>
							</Col>
							<Col>
								<ModifiedText textTransform='lowercase' type='secondary'>
									<a
										href={`mailto:${getValueSafely(
											() => customer.email,
											"N/A"
										)}?subject=Regarding%20your%20${name}%20Project&body=Hi%20${customer.profile.firstName},`}
									>
										{getValueSafely(() => customer.email, "N/A")}
									</a>
								</ModifiedText>
							</Col>
						</Row>
					</Col>
					<Col sm={12} md={12} lg={8} xl={8}>
						<Row gutter={[4, 8]}>
							<Col>
								<Text strong>Package:</Text>
							</Col>
							<Col>
								<ModifiedText textTransform='capitalize' type='secondary'>
									{getValueSafely(() => items.join(", "), "N/A")}
								</ModifiedText>
							</Col>
						</Row>
					</Col>
				</Row>
			</Collapse.Panel>
		</Collapse>
	);
};

export default BasicDetails;
