import Button from "@components/Button";
import Image from "@components/Image";
import React, { useState } from "react";
import QuizHeader from "./QuizHeader";
import goToQuiz from "./QuizHelper";

function Question3() {
	const [budget, setBudget] = useState("");

	const handleClick = e => setBudget(e.target.value);

	const handlePrev = () => {
		goToQuiz({ pathname: "/designMySpace", query: { quiz: "2", plan: "free" } }, "/designMySpace?quiz=1");
	};

	const handleNext = () => {
		goToQuiz({ pathname: "/designMySpace", query: { quiz: "4", plan: "free" } }, "/designMySpace?quiz=3");
	};

	return (
		<div className="container">
			<div className="grid text-center">
				<div className="col-12 col-md-10">
					<QuizHeader
						title="How does your room look today?"
						description="Let's start by helping your designers understand which rooms you prefer."
					/>
					<div className="grid align-center">
						<div className="col-12">
							<div>
								<Image
									src="https://res.cloudinary.com/spacejoy/image/upload/v1570781611/web/temp_ogqsaw.jpg"
									size="450px"
								/>
							</div>
							<Button fill="ghost" size="sm" onClick={handleClick} value="success">
								Test Q3{budget}
							</Button>
						</div>
						<div className="col-4 col-sm-2">
							<Button variant="secondary" fill="ghost" size="sm" full onClick={handlePrev}>
								Prev
							</Button>
						</div>
						<div className="col-4 col-sm-8" />
						<div className="col-4 col-sm-2">
							<Button variant="primary" full size="sm" onClick={handleNext}>
								Next
							</Button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Question3;
