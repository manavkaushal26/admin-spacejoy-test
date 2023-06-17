import {
	DetailedProject,
	DetailedProjectTeamMember,
	PaymentStatus,
	ProjectSelectionTypeLabel,
} from "@customTypes/dashboardTypes";
import { ProjectRoles, Role } from "@customTypes/userType";
import { getValueSafely } from "@utils/commonUtils";
import { Col, Collapse, Row, Tooltip, Typography } from "antd";
import moment from "moment-timezone";
import React, { useMemo } from "react";
import { ModifiedText, SilentDivider } from "../styled";

const { Text } = Typography;

interface BasicDetailsProps {
	projectData?: Partial<DetailedProject>;
}

const TeamTooltip: React.FC<{
	team: DetailedProjectTeamMember[];
	revisionTeam: DetailedProjectTeamMember[];
}> = ({ team, revisionTeam }) => {
	const groupedTeam = useMemo(
		() =>
			team.reduce((acc, currentMember) => {
				if (acc[currentMember?.member?.role]) {
					return {
						...acc,
						[currentMember?.member?.role]: [
							...acc[currentMember?.member?.role],
							getValueSafely(() => currentMember.member.profile.name, currentMember.memberName),
						],
					};
				}
				return {
					...acc,
					[currentMember?.member?.role]: [
						getValueSafely(() => currentMember.member.profile.name, currentMember.memberName),
					],
				};
			}, {}),
		[team]
	);

	const groupedRevisionTeam = useMemo(
		() =>
			revisionTeam.reduce((acc, currentMember) => {
				if (acc[currentMember?.member?.role]) {
					return {
						...acc,
						[currentMember?.member?.role]: [
							...acc[currentMember?.member?.role],
							getValueSafely(() => currentMember.member.profile.name, currentMember.memberName),
						],
					};
				}
				return {
					...acc,
					[currentMember?.member?.role]: [
						getValueSafely(() => currentMember.member.profile.name, currentMember.memberName),
					],
				};
			}, {}),
		[revisionTeam]
	);

	const designerTeam = useMemo(() => getValueSafely(() => groupedTeam[ProjectRoles.Designer].join(", "), ""), [
		groupedTeam,
	]);
	const accountManagers = useMemo(
		() => getValueSafely(() => groupedTeam[ProjectRoles["Account Manager"]].join(", "), ""),
		[groupedTeam]
	);

	const seniorArtistsTeam = useMemo(
		() => getValueSafely(() => groupedTeam[ProjectRoles["Senior 3D Artist"]].join(", "), ""),
		[groupedTeam]
	);
	const assistantDesigners = useMemo(
		() => getValueSafely(() => groupedTeam[ProjectRoles["Assistant Designer"]].join(", "), ""),
		[groupedTeam]
	);

	const artistTeam = useMemo(() => getValueSafely(() => groupedTeam[ProjectRoles["3D Artist"]].join(", "), ""), [
		groupedTeam,
	]);

	const revisionDesignerTeam = useMemo(
		() => getValueSafely(() => groupedRevisionTeam[ProjectRoles.Designer].join(", "), ""),
		[groupedRevisionTeam]
	);

	const revisionArtistTeam = useMemo(
		() => getValueSafely(() => groupedRevisionTeam[ProjectRoles["3D Artist"]].join(", "), ""),
		[groupedRevisionTeam]
	);

	const revisionSeniorArtistTeam = useMemo(
		() => getValueSafely(() => groupedRevisionTeam[ProjectRoles["Senior 3D Artist"]].join(", "), ""),
		[groupedRevisionTeam]
	);

	const revisionAssistantDesigners = useMemo(
		() => getValueSafely(() => groupedRevisionTeam[ProjectRoles["Assistant Designer"]].join(", "), ""),
		[groupedRevisionTeam]
	);

	const revisionAccountManagers = useMemo(
		() => getValueSafely(() => groupedRevisionTeam[ProjectRoles["Account Manager"]].join(", "), ""),
		[groupedRevisionTeam]
	);

	return (
		<Row gutter={[8, 8]}>
			<Col span={24}>
				<Row>
					<Col span={24}>
						<Text strong style={{ color: "white" }}>
							Base Team
						</Text>
					</Col>
					<Col span={24}>
						<Row gutter={[4, 4]}>
							<Col span={24}>
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
					<Col span={24}>
						<Row gutter={[4, 4]}>
							<Col span={24}>
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
					<Col span={24}>
						<Row gutter={[4, 4]}>
							<Col span={24}>
								<Text style={{ textTransform: "capitalize", color: "white" }} strong>
									Assistant designers:
								</Text>
							</Col>
							<Col>
								<Text style={{ textTransform: "capitalize", color: "white" }}>
									{assistantDesigners.length ? assistantDesigners : "Not Assigned"}
								</Text>
							</Col>
						</Row>
					</Col>
					<Col span={24}>
						<Row gutter={[4, 4]}>
							<Col span={24}>
								<Text style={{ textTransform: "capitalize", color: "white" }} strong>
									Senior 3D Artists:
								</Text>
							</Col>
							<Col>
								<Text style={{ textTransform: "capitalize", color: "white" }}>
									{seniorArtistsTeam.length ? seniorArtistsTeam : "Not Assigned"}
								</Text>
							</Col>
						</Row>
					</Col>
					<Col span={12}>
						<Row gutter={[4, 4]}>
							<Col span={24}>
								<Text style={{ textTransform: "capitalize", color: "white" }} strong>
									3D Artists:
								</Text>
							</Col>
							<Col>
								<Text style={{ textTransform: "capitalize", color: "white" }}>
									{artistTeam.length ? artistTeam : "Not Assigned"}
								</Text>
							</Col>
						</Row>
					</Col>
				</Row>
			</Col>
			<Col span={24}>
				<SilentDivider />
			</Col>
			<Col span={24}>
				<Row>
					<Col span={24}>
						<Text strong style={{ color: "white" }}>
							Revision Team
						</Text>
					</Col>
					<Col span={24}>
						<Row gutter={[4, 4]}>
							<Col span={24}>
								<Text style={{ textTransform: "capitalize", color: "white" }} strong>
									Account Managers:
								</Text>
							</Col>
							<Col>
								<Text style={{ textTransform: "capitalize", color: "white" }}>
									{revisionAccountManagers.length ? revisionAccountManagers : "Not Assigned"}
								</Text>
							</Col>
						</Row>
					</Col>
					<Col span={24}>
						<Row gutter={[4, 4]}>
							<Col span={24}>
								<Text style={{ textTransform: "capitalize", color: "white" }} strong>
									Designers:
								</Text>
							</Col>
							<Col>
								<Text style={{ textTransform: "capitalize", color: "white" }}>
									{revisionDesignerTeam.length ? revisionDesignerTeam : "Not Assigned"}
								</Text>
							</Col>
						</Row>
					</Col>
					<Col span={24}>
						<Row gutter={[4, 4]}>
							<Col span={24}>
								<Text style={{ textTransform: "capitalize", color: "white" }} strong>
									Assistant designers:
								</Text>
							</Col>
							<Col>
								<Text style={{ textTransform: "capitalize", color: "white" }}>
									{revisionAssistantDesigners.length ? revisionAssistantDesigners : "Not Assigned"}
								</Text>
							</Col>
						</Row>
					</Col>
					<Col span={24}>
						<Row gutter={[4, 4]}>
							<Col span={24}>
								<Text style={{ textTransform: "capitalize", color: "white" }} strong>
									Senior 3D Artists:
								</Text>
							</Col>
							<Col>
								<Text style={{ textTransform: "capitalize", color: "white" }}>
									{revisionSeniorArtistTeam.length ? revisionSeniorArtistTeam : "Not Assigned"}
								</Text>
							</Col>
						</Row>
					</Col>
					<Col span={24}>
						<Row gutter={[4, 4]}>
							<Col span={24}>
								<Text style={{ textTransform: "capitalize", color: "white" }} strong>
									3D Artists:
								</Text>
							</Col>
							<Col>
								<Text style={{ textTransform: "capitalize", color: "white" }}>
									{revisionArtistTeam.length ? revisionArtistTeam : "Not Assigned"}
								</Text>
							</Col>
						</Row>
					</Col>
				</Row>
			</Col>
		</Row>
	);
};

const BasicDetails: React.FC<BasicDetailsProps> = ({ projectData }) => {
	const { _id, name, createdAt, team, customer, startedAt, revisionTeam, projectSelectionType } = projectData;

	const items = getValueSafely(
		() =>
			projectData.order.items.map(item => {
				return item.name;
			}),
		[]
	);


	const designerTeam = useMemo(
		() =>
			team
				.filter(member => {
					return getValueSafely(() => member.member.role, Role.Designer) === Role.Designer;
				})
				.map(teamMember => {
					return getValueSafely(() => teamMember.member.profile.name, teamMember.memberName);
				})
				.join(", "),
		[team]
	);

	const accountManagers = useMemo(
		() =>
			team
				.filter(member => {
					return getValueSafely(() => member.member.role, Role.Designer) === Role["Account Manager"];
				})
				.map(manager => {
					return getValueSafely(() => manager.member.profile.name, manager.memberName);
				})
				.join(", "),
		[team]
	);

	const paymentStatus = getValueSafely(() => projectData.order.paymentStatus, PaymentStatus.pending);
	const couponCode = getValueSafely(() => projectData.order.coupon, '');
	const discount = getValueSafely(() => projectData.order.discount, 0);
	const payableamount = getValueSafely(() => projectData.order.payableamount, 0);
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
									{projectSelectionType === "" ? paymentStatus : "Free"}
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
								<Tooltip color='#006d75' title={<TeamTooltip team={team} revisionTeam={revisionTeam} />}>
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
										)}?subject=Regarding%20your%20${name}%20Project&body=Hi%20${customer?.profile?.firstName},`}
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
								{ProjectSelectionTypeLabel[projectSelectionType] || (
									<ModifiedText textTransform='capitalize' type='secondary'>
										{getValueSafely(() => items.join(", "), "N/A")}
									</ModifiedText>
								)}
							</Col>
						</Row>
					</Col>
					<Col sm={12} md={12} lg={8} xl={8}>
						<Row gutter={[4, 8]}>
							<Col>
								<Text strong>Coupon Code:</Text>
							</Col>
							<Col>
								{ProjectSelectionTypeLabel[projectSelectionType] || (
									<ModifiedText textTransform='capitalize' type='secondary'>
										{getValueSafely(() => couponCode, "N/A")}
									</ModifiedText>
								)}
							</Col>
						</Row>
					</Col>
					<Col sm={12} md={12} lg={8} xl={8}>
						<Row gutter={[4, 8]}>
							<Col>
								<Text strong>Discount Amount:</Text>
							</Col>
							<Col>
								{ProjectSelectionTypeLabel[projectSelectionType] || (
									<ModifiedText textTransform='capitalize' type='secondary'>
										{getValueSafely(() => discount, 0)}
									</ModifiedText>
								)}
							</Col>
						</Row>
					</Col>
					<Col sm={12} md={12} lg={8} xl={8}>
						<Row gutter={[4, 8]}>
							<Col>
								<Text strong>Final Amount:</Text>
							</Col>
							<Col>
								{ProjectSelectionTypeLabel[projectSelectionType] || (
									<ModifiedText textTransform='capitalize' type='secondary'>
										{getValueSafely(() => payableamount, 0)}
									</ModifiedText>
								)}
							</Col>
						</Row>
					</Col>
				</Row>
			</Collapse.Panel>
		</Collapse>
	);
};

export default BasicDetails;
