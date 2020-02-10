import { DetailedProject, PaymentStatus } from "@customTypes/dashboardTypes";
import { ProjectRoles } from "@customTypes/userType";
import { getValueSafely } from "@utils/commonUtils";
import { Col, Row, Typography } from "antd";
import moment from "moment";
import React, { useMemo } from "react";
import { CustomDiv, FontCorrectedPre, ModifiedText } from "../styled";

const { Text } = Typography;

interface BasicDetailsProps {
	projectData?: Partial<DetailedProject>;
}

const BasicDetails: React.FC<BasicDetailsProps> = ({ projectData }) => {
	const { _id, name, createdAt, team, customer } = projectData;

	const items = getValueSafely(() => projectData.order.items, []);

	const paymentStatus = getValueSafely(() => projectData.order.paymentStatus, PaymentStatus.pending);

	const assignedTeam = useMemo(
		() =>
			team
				.filter(member => {
					return (
						getValueSafely(() => member.member.role, ProjectRoles.Designer) === ProjectRoles.Designer ||
						getValueSafely(() => member.member.role, ProjectRoles["3d Artist Role"]) === ProjectRoles["3d Artist Role"]
					);
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
		<CustomDiv py="10px" px="10px">
			<Row>
				<Col xs={24} sm={12} lg={9}>
					<CustomDiv type="flex">
						<Text strong>
							<FontCorrectedPre>Concept Id: </FontCorrectedPre>
						</Text>
						<ModifiedText textTransform="uppercase" ellipsis type="secondary">
							{_id}
						</ModifiedText>
					</CustomDiv>
					<CustomDiv type="flex">
						<Text strong>
							<FontCorrectedPre>Account Manager: </FontCorrectedPre>
						</Text>
						<ModifiedText textTransform="capitalize" type="secondary">
							{accountManagers || "Not Assigned"}
						</ModifiedText>
					</CustomDiv>
					<CustomDiv type="flex">
						<Text strong>
							<FontCorrectedPre>Created on: </FontCorrectedPre>
						</Text>
						<ModifiedText textTransform="capitalize" type="secondary">
							{moment(createdAt).format("YYYY-MM-DD")}
						</ModifiedText>
					</CustomDiv>
				</Col>
				<Col xs={24} sm={12} lg={9}>
					<CustomDiv type="flex">
						<Text strong>
							<FontCorrectedPre>Payment Status: </FontCorrectedPre>
						</Text>
						<ModifiedText textTransform="capitalize" type="secondary">
							{paymentStatus}
						</ModifiedText>
					</CustomDiv>
					<CustomDiv type="flex">
						<Text strong>
							<FontCorrectedPre>Assigned Team: </FontCorrectedPre>
						</Text>
						<ModifiedText textTransform="capitalize" type="secondary">
							{assignedTeam || "Not assigned"}
						</ModifiedText>
					</CustomDiv>
					<CustomDiv type="flex">
						<Text strong>
							<FontCorrectedPre>Package: </FontCorrectedPre>
						</Text>
						<ModifiedText textTransform="capitalize" type="secondary">
							{getValueSafely(() => items.join(", "), "N/A")}
						</ModifiedText>
					</CustomDiv>
				</Col>
				<Col xs={24} sm={12} lg={6}>
					<CustomDiv type="flex">
						<CustomDiv type="flex" inline>
							<Text strong>
								<FontCorrectedPre>Phone: </FontCorrectedPre>
							</Text>
						</CustomDiv>
						<ModifiedText textTransform="capitalize" type="secondary">
							<a href={`tel:${getValueSafely(() => customer.contact.phone.find(phone => phone.primary).phone, "N/A")}`}>
								{getValueSafely(() => customer.contact.phone.find(phone => phone.primary).phone, "N/A")}
							</a>
						</ModifiedText>
					</CustomDiv>
					<CustomDiv type="flex">
						<CustomDiv type="flex" inline>
							<Text strong>
								<FontCorrectedPre>Email: </FontCorrectedPre>
							</Text>
						</CustomDiv>
						<ModifiedText textTransform="lowercase" type="secondary">
							<a
								href={`mailto:${getValueSafely(
									() => customer.email,
									"N/A"
								)}?subject=Regarding%20your%20${name}%20Project&body=Hi%20${customer.profile.firstName},`}
							>
								{getValueSafely(() => customer.email, "N/A")}
							</a>
						</ModifiedText>
					</CustomDiv>
				</Col>
			</Row>
		</CustomDiv>
	);
};

export default BasicDetails;
