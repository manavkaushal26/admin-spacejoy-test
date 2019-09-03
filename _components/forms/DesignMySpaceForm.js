import Button from "@components/Button";
import { Budget, CurrentRoomStatus, RoomType } from "@utils/optionsMock";
import React, { PureComponent } from "react";
import styled from "styled-components";

const FormWrapperStyled = styled.div`
	position: relative;
	&:after {
		content: "";
		position: absolute;
		background: rgba(255, 255, 255, 0.83);
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		display: none;
	}
	&.loading:after {
		display: block;
	}
`;

const InputWrapperStyled = styled.div`
	position: relative;
	margin-bottom: 1rem;
	label,
	input[type="text"] {
		display: block;
		margin: 0.25rem 0;
		width: 100%;
		box-sizing: border-box;
		color: ${({ error, theme }) => (error ? theme.colors.primary : "inherit")};
	}
	input[type="text"] {
		background: ${({ error }) => (error ? "rgba(240, 90, 70, 0.1)" : "white")};
		color: ${({ error, theme }) => (error ? theme.colors.primary : "inherit")};
		border: 1px solid ${({ error, theme }) => (error ? theme.colors.primary : theme.colors.bg.dark1)};
		padding: 0.75rem 1rem;
		outline: none;
	}
	input[type="radio"] {
		margin-right: 1rem;
	}
	label > span:first-child {
		font-weight: bold;
	}
`;

class DesignMySpaceForm extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			name: "",
			email: "",
			mobile: "",
			roomType: "",
			budget: "",
			currentRoomStatus: "",
			address: "",
			loading: false
		};

		this.handleInputChange = this.handleInputChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleSubmit(event) {
		event.preventDefault();
		const { name, email, mobile, roomType, budget, currentRoomStatus, address } = this.state;
		this.setState({ loading: true });
		fetch("https://jsonplaceholder.typicode.com/posts", {
			method: "POST",
			body: JSON.stringify({ name, email, mobile, roomType, budget, currentRoomStatus, address }),
			headers: {
				"Content-type": "application/json; charset=UTF-8"
			}
		})
			.then(response => response.json())
			.then(json => {
				this.setState({
					loading: false,
					name: "",
					email: "",
					mobile: "",
					roomType: "",
					budget: "",
					currentRoomStatus: "",
					address: ""
				});
				console.log(json);
			});
	}

	handleInputChange({ target }) {
		const { value, name } = target;
		this.setState({
			[name]: value
		});
	}

	render() {
		const { name, email, mobile, roomType, budget, currentRoomStatus, address, loading } = this.state;
		return (
			<FormWrapperStyled className={loading ? "loading" : null}>
				<form onSubmit={this.handleSubmit}>
					<legend>
						<InputWrapperStyled>
							<label htmlFor="name">
								<span className="label-text">Name</span>
								<input
									type="text"
									name="name"
									className="input-field"
									id="name"
									value={name}
									onChange={this.handleInputChange}
								/>
							</label>
						</InputWrapperStyled>
						<InputWrapperStyled>
							<label htmlFor="email">
								<span className="label-text">Email</span>
								<input
									type="text"
									name="email"
									className="input-field"
									id="email"
									value={email}
									onChange={this.handleInputChange}
								/>
							</label>
						</InputWrapperStyled>
						<InputWrapperStyled>
							<label htmlFor="mobile">
								<span className="label-text">Mobile</span>
								<input
									type="text"
									name="mobile"
									className="input-field"
									id="mobile"
									value={mobile}
									onChange={this.handleInputChange}
								/>
							</label>
						</InputWrapperStyled>
						<InputWrapperStyled>
							<strong className="label-text">Which room are you designing?</strong>
						</InputWrapperStyled>
						{RoomType.map(type => (
							<InputWrapperStyled>
								<label htmlFor={type.name} key={type.name}>
									<input
										type="radio"
										name="roomType"
										className="input-field"
										id={type.name}
										value={type.name}
										checked={roomType === type.name}
										onChange={this.handleInputChange}
									/>
									<span className="label-text">{type.displayName}</span>
								</label>
							</InputWrapperStyled>
						))}
						<InputWrapperStyled>
							<strong className="label-text">Have a budget in mind?</strong>
						</InputWrapperStyled>
						{Budget.map(item => (
							<InputWrapperStyled>
								<label htmlFor={item.name} key={item.name}>
									<input
										type="radio"
										name="budget"
										className="input-field"
										id={item.name}
										value={item.name}
										checked={budget === item.name}
										onChange={this.handleInputChange}
									/>
									<span className="label-text">{item.displayName}</span>
								</label>
							</InputWrapperStyled>
						))}
						<InputWrapperStyled>
							<strong className="label-text">How does your room look today?</strong>
						</InputWrapperStyled>
						{CurrentRoomStatus.map(roomStatus => (
							<InputWrapperStyled>
								<label htmlFor={roomStatus.name} key={roomStatus.name}>
									<input
										type="radio"
										name="currentRoomStatus"
										className="input-field"
										id={roomStatus.name}
										value={roomStatus.name}
										checked={currentRoomStatus === roomStatus.name}
										onChange={this.handleInputChange}
									/>
									<span className="label-text">{roomStatus.displayName}</span>
								</label>
							</InputWrapperStyled>
						))}

						<InputWrapperStyled>
							<label htmlFor="address">
								<span className="label-text">Address</span>
								<input
									type="text"
									name="address"
									className="input-field"
									id="address"
									value={address}
									onChange={this.handleInputChange}
								/>
							</label>
						</InputWrapperStyled>
						<InputWrapperStyled>
							<Button lg>Submit</Button>
						</InputWrapperStyled>
					</legend>
				</form>
			</FormWrapperStyled>
		);
	}
}

export default DesignMySpaceForm;
