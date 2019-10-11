import Button from "@components/Button";
import RadioCard from "@sections/Cards/radio";
import React, { useState } from "react";
import QuizHeader from "./QuizHeader";
import goToQuiz from "./QuizHelper";

function Question1() {
	const [roomType, setRoomType] = useState("");

	const handleClick = e => setRoomType(e.target.value);

	const handlePrev = () => {
		goToQuiz({ pathname: "/designMySpace", query: { quiz: "start", plan: "free" } }, "/designMySpace?quiz=start");
	};

	const handleNext = () => {
		goToQuiz({ pathname: "/designMySpace", query: { quiz: "2", plan: "free" } }, "/designMySpace?quiz=2");
	};

	return (
		<div className="container">
			<div className="grid text-center">
				<div className="col-xs-10">
					<QuizHeader
						title="Which room are you designing?"
						description="Let's start by helping your designers understand which rooms you prefer."
					/>
					<div className="grid">
						<div className="col-12 col-sm-6 col-md-4">
							<RadioCard
								value="Living Room"
								onClick={handleClick}
								checked={roomType === "Living Room"}
								bg="rgba(0, 188, 212, 0.05)"
								image="https://res.cloudinary.com/spacejoy/image/upload/c_scale,q_100,w_325/v1570170156/web/living-room-tile_xtghwr.png"
							/>
						</div>
						<div className="col-12 col-sm-6 col-md-4">
							<RadioCard
								value="Bedroom"
								onClick={handleClick}
								checked={roomType === "Bedroom"}
								bg="rgba(121, 85, 72, 0.15)"
								image="https://res.cloudinary.com/spacejoy/image/upload/c_scale,q_100,w_325/v1570170156/web/bedroom-tile_kisjld.png"
							/>
						</div>
						<div className="col-12 col-sm-6 col-md-4">
							<RadioCard
								value="Entryway"
								onClick={handleClick}
								checked={roomType === "Entryway"}
								bg="rgba(103, 58, 183, 0.06)"
								image="https://res.cloudinary.com/spacejoy/image/upload/c_scale,q_100,w_325/v1570602461/web/entryway.png"
							/>
						</div>
						<div className="col-12 col-sm-6 col-md-4">
							<RadioCard
								value="Kid's Bedroom"
								onClick={handleClick}
								checked={roomType === "Kid's Bedroom"}
								bg="rgba(255, 252, 222, 0.2)"
								image="https://res.cloudinary.com/spacejoy/image/upload/v1570448686/web/kids_bedroom_fknoyk.png"
							/>
						</div>
						<div className="col-12 col-sm-6 col-md-4">
							<RadioCard
								value="Studio"
								onClick={handleClick}
								checked={roomType === "Studio"}
								bg="rgba(158, 158, 158, 0.15)"
								image="https://res.cloudinary.com/spacejoy/image/upload/v1570451259/web/Studio_Apartment_nu1av3.png"
							/>
						</div>
						<div className="col-12 col-sm-6 col-md-4">
							<RadioCard
								value="Nursery"
								onClick={handleClick}
								checked={roomType === "Nursery"}
								bg="rgba(255, 193, 7, 0.01)"
								image="https://res.cloudinary.com/spacejoy/image/upload/v1570181061/web/nursery_suenxy.png"
							/>
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

export default Question1;
