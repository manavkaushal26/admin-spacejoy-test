import { DetailedProject } from "@customTypes/dashboardTypes";
import { Role } from "@customTypes/userType";
import { getValueSafely } from "@utils/commonUtils";
import { Col, Icon, Row, Typography } from "antd";
import moment from "moment";
import React from "react";
import { CustomDiv, ModifiedText } from "../styled";


const { Text } = Typography;

interface BasicDetailsProps {
	projectData?: Partial<DetailedProject>;
}

const BasicDetails: React.FC<BasicDetailsProps> = ({ projectData }) => {
	const {
		id,
		createdAt,
		order: { paymentStatus, items },
		team,
		customer
	} = projectData;
	const designers = team
		.filter(member => {
			return member.role === Role.designer;
		})
		.map(designer => {
			return designer.profile.name;
		});
	return (
		<CustomDiv py="10px" px="10px">
			<Row>
				<Col xs={24} sm={12} lg={9}>
					<Row type='flex'>
						<Text strong>{"Concept Id:"}</Text> <ModifiedText textTransform='uppercase' ellipsis type="secondary">{id}</ModifiedText>
					</Row>
					<Row>
						<Text strong>Account Manager:</Text> <ModifiedText textTransform='capitalize' type="secondary">Laurel</ModifiedText>
					</Row>
					<Row>
						<Text strong>Created on:</Text> <ModifiedText textTransform='capitalize' type="secondary">{moment(createdAt).format("YYYY-MM-DD")}</ModifiedText>
					</Row>
				</Col>
				<Col xs={24} sm={12} lg={9}>
					<Row>
						<Text strong>Payment Status:</Text> <ModifiedText textTransform='capitalize' type="secondary">{paymentStatus}</ModifiedText>
					</Row>
					<Row>
						<Text strong>Assigned Designers:</Text>
						<ModifiedText textTransform='capitalize' type="secondary">{designers.length ? designers.join(", ") : "Not assigned"}</ModifiedText>
					</Row>
					<Row>
						<Text strong>Package:</Text>{" "}
							<ModifiedText textTransform='capitalize' type="secondary">{getValueSafely(()=>items.join(", "),"N/A")}</ModifiedText>
					</Row>
				</Col>
				<Col xs={24} sm={12} lg={6}>
					<Row>
						<CustomDiv type="flex" inline>
							<Icon type="phone" rotate={90} />
						</CustomDiv>
						<ModifiedText textTransform='capitalize' type="secondary">
							{getValueSafely(() => customer.contact.phone.find(phone => phone.primary).phone, "N/A")}
						</ModifiedText>
					</Row>
					<Row>
						<CustomDiv type="flex" inline>
							<Icon type="mail" />
						</CustomDiv>{" "}
						<ModifiedText textTransform='lowercase' type="secondary">{getValueSafely(() => customer.email, "N/A")}</ModifiedText>
					</Row>
				</Col>
			</Row>
		</CustomDiv>
	);
};

export default BasicDetails;
