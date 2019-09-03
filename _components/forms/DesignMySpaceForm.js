import React, { PureComponent } from "react";
import styled from "styled-components";

const InputWrapperStyled = styled.div`
	position: relative;
	margin-bottom: 1rem;
	& {
		label,
		span,
		input:not([type="checkbox"]),
		input:not([type="radio"]) {
			display: block;
			margin: 0.25rem 0;
			width: 100%;
			box-sizing: border-box;
			color: ${({ error, theme }) => (error ? theme.colors.primary : "inherit")};
		}
		input:not([type="checkbox"]),
		input:not([type="radio"]) {
			background: ${({ error }) => (error ? "rgba(240, 90, 70, 0.1)" : "white")};
			color: ${({ error, theme }) => (error ? theme.colors.primary : "inherit")};
			border: 1px solid ${({ error, theme }) => (error ? theme.colors.primary : theme.colors.bg.dark1)};
			padding: 0.75rem 1rem;
			outline: none;
		}
		label > span:first-child {
			font-weight: bold;
		}
	}
`;

const error = true;

class DesignMySpaceForm extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			name: "",
			email: ""
		};

		this.handleInputChange = this.handleInputChange.bind(this);
	}

	handleInputChange({ target }) {
		const value = target.type === "checkbox" ? target.checked : target.value;
		const { name } = target;
		this.setState({
			[name]: value
		});
	}

	render() {
		const { name, email } = this.state;
		return (
			<form action="">
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
							<span className="error">Enter a valid Name</span>
							<span className="hint">It will be use as unique ID.</span>
						</label>
					</InputWrapperStyled>
					<InputWrapperStyled error={error}>
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
							<span className="error">Enter a valid email</span>
							<span className="hint">It will be use as communication address.</span>
						</label>
					</InputWrapperStyled>
				</legend>
			</form>
		);
	}
}

export default DesignMySpaceForm;
