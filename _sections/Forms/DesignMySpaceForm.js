import FormBox from "@components/Form";
import Field from "@components/Form/Field";
import PropTypes from "prop-types";
import React from "react";

function DesignMySpaceForm({ plan, name, email }) {
	return (
		<FormBox redirectUrl="/checkout" destination="/form" description="Submit your details" name="designmyspace">
			<Field
				name="userName"
				type="text"
				label="Name"
				value={name}
				readonly={!!name}
				placeholder="Name"
				error="Please enter a valid Name"
				hint="should contain valid text"
			/>
			<Field
				name="userEmail"
				type="email"
				label="Email"
				value={email}
				readonly={!!email}
				placeholder="Email"
				error="Please enter a valid email"
				hint="should contain valid email"
				required
			/>
			<Field
				name="userMobile"
				type="tel"
				label="Mobile"
				placeholder="Mobile"
				error="Please enter a valid Mobile"
				hint="should contain valid Mobile"
				required
			/>
			<Field
				name="selectedPlan"
				type="radio"
				label="Selected Plan"
				placeholder="Selected Plan"
				error="Please enter a Selected Plan"
				hint="Selected Plan"
				options={[
					{ value: "Delight", label: "Delight - Free Trial" },
					{ value: "Bliss", label: "Bliss - $49" },
					{ value: "Euphoria", label: "Euphoria - $99" }
				]}
				value={plan}
				required
			/>
			<Field
				name="whichRoomAreYouDesigning"
				type="radio"
				label="Which room are you designing?"
				options={[
					{ value: "Living Room", label: "Living Room" },
					{ value: "Bedroom", label: "Bedroom" },
					{ value: "Entryway", label: "Entryway" },
					{ value: "Kid's Bedroom", label: "Kid's Bedroom" },
					{ value: "Studio", label: "Studio" },
					{ value: "Nursery", label: "Nursery" }
				]}
				placeholder="Username"
				error="Please enter a valid username"
				hint="should contain valid text"
			/>
			<Field
				name="haveABudgetInMind"
				type="radio"
				label="Have a budget in mind?"
				options={[
					{ value: "$2000 or less", label: "$2000 or less" },
					{ value: "$2000 - $5000", label: "$2000 - $5000" },
					{ value: "$5000 - $7000", label: "$5000 - $7000" },
					{ value: "$10,000 or More", label: "$10,000 or More" }
				]}
				placeholder="Have a budget in mind"
				error="Please enter a valid budget"
				hint="should contain valid text"
			/>
			<Field
				name="howDoesYourRoomLookToday"
				type="radio"
				label="How does your room look today?"
				options={[
					{ value: "Looking to design from scratch", label: "Looking to design from scratch" },
					{ value: "I am looking for key items only", label: "I am looking for key items only" },
					{
						value: "Its almost furnished but need help finishing it",
						label: "Its almost furnished but need help finishing it"
					},
					{ value: "Need help with a new layout", label: "Need help with a new layout" }
				]}
				placeholder="Username"
				error="Please enter a valid username"
				hint="should contain valid text"
			/>
			<Field
				name="address"
				type="addressAutoSuggest"
				label="Tell us where you're located?"
				placeholder="Address"
				error="Please enter a valid Address"
				hint="should contain valid text"
			/>
			<Field name="userSubmit" type="submit" label="Submit" />
		</FormBox>
	);
}

DesignMySpaceForm.defaultProps = {
	plan: "",
	name: "",
	email: ""
};

DesignMySpaceForm.propTypes = {
	plan: PropTypes.string,
	name: PropTypes.string,
	email: PropTypes.string
};

export default DesignMySpaceForm;
