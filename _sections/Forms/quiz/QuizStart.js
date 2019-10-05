import Button from "@components/Button";
import Image from "@components/Image";
import React from "react";
import QuizHeader from "./QuizHeader";
import goToQuiz from "./QuizHelper";

function QuizStart() {
	const handleClick = () => {
		goToQuiz({ pathname: "/designMySpace", query: { quiz: "1", plan: "free" } }, "/designMySpace?quiz=1");
	};

	return (
		<div className="container">
			<div className="grid text-center">
				<div className="col-12 col-md-6">
					<Image
						size="300px"
						src="https://res.cloudinary.com/spacejoy/image/upload/v1568649903/shared/Illustration_ajvkhk.svg"
						alt="quiz begin"
						style={{ marginTop: "100px" }}
					/>
					<QuizHeader
						title="We're Excited"
						description="Hello there! Let us understand your requirements so that we can kick start designing your dream home"
					/>
					<Button variant="primary" size="sm" shape="rounded" onClick={handleClick}>
						Let&apos;s Begin
					</Button>
				</div>
			</div>
		</div>
	);
}

export default QuizStart;
