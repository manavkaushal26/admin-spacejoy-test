import Button from "@components/Button";
import SVGIcon from "@components/SVGIcon";
import Link from "next/link";
import React from "react";

function CTA(props) {
	return (
		<Link
			href={{ pathname: "/designMySpace", query: { quiz: "start", plan: "delight" } }}
			as="/designMySpace?quiz=start"
		>
			<a href="/designMySpace/delight?quiz=start">
				<Button {...props}>
					Start Your Free Trial <SVGIcon name="right" width={20} fill="white" />
				</Button>
			</a>
		</Link>
	);
}

export default CTA;
