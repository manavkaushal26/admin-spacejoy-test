import Button from "@components/Button";
import RadioCard from "@sections/Cards/radio";
import SectionHeader from "@sections/SectionHeader";
import roomLookOptions from "@utils/roomLookQuizMock";
import React, { useState } from "react";
import { goToQuiz } from "./QuizHelper";

function Question3() {
	const [roomLook, setRoomLook] = useState("");

	const handleClick = e => setRoomLook(e.currentTarget.value);

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
					<SectionHeader
						title="How does your room look today?"
						description="Let's start by helping your designers understand which rooms you prefer."
					/>
					<div className="grid align-center">
						<div className="col-12">
							<div className="grid">
								{roomLookOptions.map(room => (
									<div className="col-12 col-sm-6 col-md-3">
										<RadioCard
											version={2}
											value={room.title}
											onClick={handleClick}
											checked={roomLook === room.title}
											bg={room.bg}
											image={`https://res.cloudinary.com/spacejoy/image/upload/v1571132514/web/designPurpose/${room.icon}`}
										/>
									</div>
								))}
							</div>
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
