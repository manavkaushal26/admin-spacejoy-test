import Button from "@components/Button";
import { Budget, CurrentRoomStatus, RoomType } from "@utils/optionsMock";
import Router from "next/router";
import PropTypes from "prop-types";
import React, { PureComponent } from "react";
import PlacesAutocomplete from "reactjs-places-autocomplete";
import styled from "styled-components";

const AutoCompleteStyled = styled.div`
	background: white;
	&.loading {
		background: ${({ theme }) => theme.colors.bg.dark2};
	}
`;

const SuggestionStyled = styled.div`
	cursor: pointer;
	padding: 0.5rem 1rem;
	border-top: 1px solid ${({ theme }) => theme.colors.bg.dark2};
	border-left: 1px solid ${({ theme }) => theme.colors.bg.dark2};
	border-right: 1px solid ${({ theme }) => theme.colors.bg.dark2};
	/* background: ${({ active, theme }) => (active ? theme.colors.bg.dark2 : theme.colors.bg.light1)}; */
	&:last-child {
		border-bottom: 1px solid ${({ theme }) => theme.colors.bg.dark2};
	}
`;

const FormWrapperStyled = styled.div`
	position: relative;
	&:after {
		content: "";
		position: absolute;
		background: rgba(255, 255, 255, 0.8);
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
			submitting: false,
			plan: props.plan
		};

		this.handleInputChange = this.handleInputChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleSelect = address => {
		this.setState({ address });
	};

	handleAddressChange = address => {
		this.setState({ address });
	};

	handleInputChange({ target }) {
		const { value, name } = target;
		this.setState({
			[name]: value
		});
	}

	handleSubmit(event) {
		event.preventDefault();
		const { name, email, mobile, roomType, budget, currentRoomStatus, address } = this.state;
		const stringifiedData = JSON.stringify({ name, email, mobile, roomType, budget, currentRoomStatus, address });
		this.setState({ submitting: true });
		fetch("https://jsonplaceholder.typicode.com/posts", {
			method: "POST",
			body: stringifiedData,
			headers: {
				"Content-type": "application/json; charset=UTF-8"
			}
		})
			.then(response => response.json())
			.then(() => {
				localStorage.setItem("designRequest", stringifiedData);
				this.setState({ submitting: false }, () => Router.push("/checkout"));
			});
	}

	render() {
		const { name, email, mobile, roomType, budget, currentRoomStatus, address, submitting, plan } = this.state;
		return (
			<FormWrapperStyled className={submitting ? "loading" : null}>
				<form onSubmit={this.handleSubmit}>
					<legend>
						{plan && (
							<InputWrapperStyled>
								<label htmlFor="name">
									<span className="label-text">Plan Type</span>
									<input
										type="text"
										name="plan"
										className="input-field"
										id="plan"
										value={plan}
										onChange={this.handleInputChange}
									/>
								</label>
							</InputWrapperStyled>
						)}
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
							<InputWrapperStyled key={type.name}>
								<label htmlFor={type.name}>
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
							<InputWrapperStyled key={item.name}>
								<label htmlFor={item.name}>
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
							<InputWrapperStyled key={roomStatus.name}>
								<label htmlFor={roomStatus.name}>
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
						<PlacesAutocomplete
							value={address}
							name="address"
							id="address"
							onChange={this.handleAddressChange}
							onSelect={this.handleSelect}
						>
							{({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
								<>
									<InputWrapperStyled>
										<label htmlFor="address">
											<span className="label-text">Address</span>
											<input
												{...getInputProps({
													name: "address",
													id: "address",
													placeholder: "Search Places ...",
													className: "input-field"
												})}
											/>
										</label>
										<AutoCompleteStyled className={loading ? "loading" : ""}>
											{suggestions.map(suggestion => (
												<SuggestionStyled {...getSuggestionItemProps(suggestion)} active={suggestion.active}>
													{suggestion.description}
												</SuggestionStyled>
											))}
										</AutoCompleteStyled>
									</InputWrapperStyled>
								</>
							)}
						</PlacesAutocomplete>
						<InputWrapperStyled>
							<Button size="lg" full type="primary">
								Next
							</Button>
						</InputWrapperStyled>
					</legend>
				</form>
			</FormWrapperStyled>
		);
	}
}

DesignMySpaceForm.propTypes = {
	plan: PropTypes.string
};

DesignMySpaceForm.defaultProps = {
	plan: ""
};

export default DesignMySpaceForm;
