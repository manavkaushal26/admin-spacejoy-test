import Layout from "@sections/Layout";
import IndexPageMeta from "@utils/meta";
import Head from "next/head";
import React, { PureComponent } from "react";
import styled from "styled-components";

const SummaryWrapperStyled = styled.div`
	padding: 2rem;
	box-shadow: 0 0 3px 0px rgba(0, 0, 0, 0.15);
`;

const SummaryRowStyled = styled.div`
	padding: 0.5rem 0;
`;

class checkout extends PureComponent {
	state = {
		name: "",
		email: "",
		mobile: "",
		roomType: "",
		budget: "",
		currentRoomStatus: "",
		address: ""
	};

	componentDidMount() {
		const designRequest = JSON.parse(localStorage.getItem("designRequest"));
		this.setState({ ...designRequest });
	}

	render() {
		const { name, email, mobile, roomType, budget, currentRoomStatus, address } = this.state;
		return (
			<Layout header="solid">
				<Head>
					{IndexPageMeta}
					<title>FAQ</title>
				</Head>
				<div className="container">
					<div className="grid justify-space-around">
						<div className="col-xs-12 col-md-8">
							<h3>Payment</h3>
						</div>
						<div className="col-xs-12 col-md-4">
							<SummaryWrapperStyled>
								<h3>ORDER SUMMARY</h3>
								<SummaryRowStyled>
									<strong>Name: </strong>
									{name}
								</SummaryRowStyled>
								<SummaryRowStyled>
									<strong>Email: </strong>
									{email}
								</SummaryRowStyled>
								<SummaryRowStyled>
									<strong>Mobile: </strong>
									{mobile}
								</SummaryRowStyled>
								<SummaryRowStyled>
									<strong>Room Type: </strong>
									{roomType}
								</SummaryRowStyled>
								<SummaryRowStyled>
									<strong>Budget: </strong>
									{budget}
								</SummaryRowStyled>
								<SummaryRowStyled>
									<strong>Room Status: </strong>
									{currentRoomStatus}
								</SummaryRowStyled>
								<SummaryRowStyled>
									<strong>Address: </strong>
									{address}
								</SummaryRowStyled>
							</SummaryWrapperStyled>
						</div>
					</div>
				</div>
			</Layout>
		);
	}
}

export default checkout;
