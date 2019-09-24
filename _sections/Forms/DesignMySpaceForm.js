import FormBox from "@components/Form";
import Field from "@components/Form/Field";
import { AuthContext } from "@context/AuthStorage";
import PropTypes from "prop-types";
import React from "react";

function DesignMySpaceForm({ plan }) {
	return (
		<FormBox redirectUrl="/checkout" destination="/forms" description="Submit your details" name="designmyspace">
			<AuthContext.Consumer>
				{value =>
					value.state.isAuthorized && (
						<>
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
								label="Mobile"
								placeholder="Mobile"
								error="Please enter a valid Mobile"
								hint="should contain valid Mobile"
								required
							/>
						</>
					)
				}
			</AuthContext.Consumer>
			<Field
				name="selectedPlan"
				type="text"
				label="Selected Plan"
				placeholder="Selected Plan"
				error="Please enter a Selected Plan"
				hint="Selected Plan"
				value={plan}
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
	plan: ""
};

DesignMySpaceForm.propTypes = {
	plan: PropTypes.string
};

export default DesignMySpaceForm;
