import FormBox from "@components/Form";
import Field from "@components/Form/Field";
import React from "react";

function DesignMySpaceForm() {
	return (
		<FormBox destination="/forms" description="Enter your details to signup" name="designmyspace">
			<Field
				name="userName"
				type="text"
				label="Username"
				placeholder="Username"
				error="Please enter a valid username"
				hint="should contain valid text"
			/>
			<Field
				name="userEmail"
				type="email"
				label="Email"
				placeholder="Email"
				error="Please enter a valid email"
				hint="should contain valid email"
				required
			/>
			<Field
				name="userMobile"
				type="tel"
				label="mobile"
				placeholder="Mobile"
				error="Please enter a valid Mobile"
				hint="should contain valid Mobile"
				required
			/>
			<Field
				name="whichRoomAreYouDesigning"
				type="radio"
				label="Which room are you designing?"
				options={[
					{ value: "Living Room" },
					{ value: "Bedroom" },
					{ value: "Entryway" },
					{ value: "Kid's Bedroom" },
					{ value: "Studio" },
					{ value: "Nursery" }
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
					{ value: "$2000 or less" },
					{ value: "$2000 - $5000" },
					{ value: "$5000 - $7000" },
					{ value: "$10,000 or More" }
				]}
				placeholder="Username"
				error="Please enter a valid username"
				hint="should contain valid text"
			/>
			<Field
				name="howDoesYourRoomLookToday"
				type="radio"
				label="How does your room look today?"
				options={[
					{ value: "Looking to design from scratch" },
					{ value: "I am looking for key items only" },
					{ value: "Its almost furnished but need help finishing it" },
					{ value: "Need help with a new layout" }
				]}
				placeholder="Username"
				error="Please enter a valid username"
				hint="should contain valid text"
			/>
			<Field name="userSubmit" type="submit" label="Submit" />
		</FormBox>
	);
}

export default DesignMySpaceForm;
