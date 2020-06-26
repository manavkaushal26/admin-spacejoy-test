import PropTypes from "prop-types";
import React, { PureComponent } from "react";
import styled from "styled-components";

const Dialog = styled.div`
	position: fixed;
	z-index: 10;
	left: 0;
	top: 0;
	bottom: 0;
	right: 0;
	background: rgba(0, 0, 0, 0.6);
`;

const DialogContent = styled.div`
	width: ${({ size }) => `${size}%`};
	background: #ffffff;
	padding: 2rem;
	margin: 10% auto;
	position: relative;
	box-shadow: 0 0 10px 0 ${({ theme }) => theme.colors.mild.black};
`;

const CloseBtn = styled.span`
	position: absolute;
	top: -1rem;
	right: 1rem;
	font-size: 3rem;
	color: ${({ theme }) => theme.colors.fc.dark3};
	z-index: 2;
	&:hover,
	&:focus {
		color: ${({ theme }) => theme.colors.fc.dark1};
		cursor: pointer;
		text-decoration: none;
	}
`;

class Modal extends PureComponent {
	componentDidMount() {
		document.addEventListener("keydown", this.escFunction, false);
	}

	componentWillUnmount() {
		document.removeEventListener("keydown", this.escFunction, false);
	}

	modalClose = arg => {
		const { close } = this.props;
		close(arg);
	};

	escFunction = event => {
		if (event.keyCode === 27) {
			const { close } = this.props;
			close();
		}
	};

	render() {
		const { isModalOpen, children, size } = this.props;
		return (
			<Dialog role='dialog' style={{ display: isModalOpen ? "block" : "none" }}>
				<DialogContent size={size}>
					<CloseBtn onClick={this.modalClose}>&times;</CloseBtn>
					<div>{children}</div>
				</DialogContent>
			</Dialog>
		);
	}
}

Modal.defaultProps = {
	close: undefined,
	size: "50",
};

Modal.propTypes = {
	isModalOpen: PropTypes.bool.isRequired,
	close: PropTypes.func,
	children: PropTypes.node.isRequired,
	size: PropTypes.string,
};

export default Modal;
