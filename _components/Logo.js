import { company } from "@utils/config";
import React from "react";
import Image from "./Image";

function Logo(props) {
	if ("md" in props) {
		return <Image height='30px' width='90px' src={`h_30,w_90,c_lpad,q_100/${company.logo}`} alt='Spacejoy Logo' />;
	}
}

export default Logo;
