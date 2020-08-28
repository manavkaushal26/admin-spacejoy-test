import { company } from "@utils/config";
import React from "react";
import Image from "./Image";

function Logo(props) {
	if ("md" in props) {
		return <Image src={`h_30,w_90,c_lpad,q_100/${company.logo}`} alt='Spacejoy Logo' height='100%' />;
	}
}

export default Logo;
