import PropTypes from "prop-types";
import React, { Component } from "react";

const AuthContext = React.createContext();

class AuthProvider extends Component {
	state = {
		isAuthorized: false
	};

	render() {
		const { children } = this.props;
		return (
			<AuthContext.Provider
				value={{
					state: this.state,
					updateState: () => this.setState(prevState => !prevState.isAuthorized)
				}}
			>
				{children}
			</AuthContext.Provider>
		);
	}
}

AuthProvider.propTypes = {
	children: PropTypes.node.isRequired
};

export { AuthProvider, AuthContext };
