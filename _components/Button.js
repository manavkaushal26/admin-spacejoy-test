import { PushEvent } from "@utils/analyticsLogger";
import PropTypes from "prop-types";
import React from "react";

function Button({ children, onClick, shape, variant, size, type }) {
	const onClickWithGA = () => {
		onClick();
		PushEvent("category", "action", "label", 10, { data: type });
	};

	return (
		<button type="button" shape={shape} variant={variant} size={size} onClick={onClickWithGA}>
			{children}
		</button>
	);
}

Button.defaultProps = {
	children: null,
	onClick: () => {},
	shape: "",
	variant: "",
	size: "",
	type: "button"
};

Button.propTypes = {
	children: PropTypes.node,
	onClick: PropTypes.func,
	shape: PropTypes.string,
	variant: PropTypes.string,
	size: PropTypes.string,
	type: PropTypes.string
};

export default Button;
