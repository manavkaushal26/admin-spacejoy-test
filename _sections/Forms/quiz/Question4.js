import Button from "@components/Button";
import React, { useState } from "react";
import QuizHeader from "./QuizHeader";
import goToQuiz from "./QuizHelper";

function Question4() {
	const [budget, setBudget] = useState("");

	const handleClick = e => setBudget(e.target.value);

	const handlePrev = () => {
		goToQuiz({ pathname: "/designMySpace", query: { quiz: "3", plan: "free" } }, "/designMySpace?quiz=1");
	};

	const handleNext = () => {
		goToQuiz({ pathname: "/", query: {} }, "/");
	};

	return (
		<div className="container">
			<div className="grid text-center">
				<div className="col-12 col-md-10">
					<QuizHeader title="Question 4?" description="Final Details?" />
					<div className="grid align-center">
						<div className="col-12">
							<p>
								Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quo, atque? Deleniti, dolore consectetur sint
								reprehenderit corrupti ipsa natus blanditiis assumenda quod nostrum perferendis, eos asperiores totam
								dignissimos ad, non atque.
							</p>
							<Button fill="ghost" size="sm" onClick={handleClick} value="success">
								Test Q3{budget}
							</Button>
						</div>
						<div className="col-4 col-sm-2">
							<Button variant="secondary" shape="rounded" size="sm" fill="ghost" full onClick={handlePrev}>
								Prev
							</Button>
						</div>
						<div className="col-4 col-sm-8" />
						<div className="col-4 col-sm-2">
							<Button variant="primary" shape="rounded" size="sm" full onClick={handleNext}>
								Next
							</Button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Question4;
