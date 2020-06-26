import { company } from "@utils/config";
import React from "react";
import Image from "./Image";

function Logo(props) {
	if ("md" in props) {
		return <Image src={company.logo} nolazy alt='Spacejoy Logo' width='auto' height='60px' />;
	}
}

export default Logo;
