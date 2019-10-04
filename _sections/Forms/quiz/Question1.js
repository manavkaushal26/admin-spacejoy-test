import Button from "@components/Button";
import SVGIcon from "@components/SVGIcon";
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
				<div className="col-10">
					<QuizHeader
						title="Which room are you designing?"
						description="Let's start by helping your designers understand which rooms you prefer."
					/>
					<div className="grid">
						<div className="col-6 col-md-4">
							<RadioCard
								value="Living Room"
								onClick={handleClick}
								checked={roomType === "Living Room"}
								image="https://res.cloudinary.com/spacejoy/image/upload/c_scale,q_100,w_325/v1570170156/web/living-room-tile_xtghwr.png"
							/>
						</div>
						<div className="col-6 col-md-4">
							<RadioCard
								value="Bedroom"
								onClick={handleClick}
								checked={roomType === "Bedroom"}
								image="https://res.cloudinary.com/spacejoy/image/upload/c_scale,q_100,w_325/v1570170156/web/bedroom-tile_kisjld.png"
							/>
						</div>
						<div className="col-6 col-md-4">
							<RadioCard value="Entryway" onClick={handleClick} checked={roomType === "Entryway"} />
						</div>
						<div className="col-6 col-md-4">
							<RadioCard
								value="Kid's Bedroom"
								onClick={handleClick}
								checked={roomType === "Kid's Bedroom"}
								image="https://res.cloudinary.com/spacejoy/image/upload/c_scale,q_100,w_325/v1570182657/web/kids_hamqxr.png"
							/>
						</div>
						<div className="col-6 col-md-4">
							<RadioCard
								value="Studio"
								onClick={handleClick}
								checked={roomType === "Studio"}
								image="https://res.cloudinary.com/spacejoy/image/upload/c_scale,q_100,w_325/v1570182983/web/studio_jpakds.png"
							/>
						</div>
						<div className="col-6 col-md-4">
							<RadioCard
								value="Nursery"
								onClick={handleClick}
								checked={roomType === "Nursery"}
								image="https://res.cloudinary.com/spacejoy/image/upload/c_scale,q_100,w_325/v1570181061/web/nursery_suenxy.png"
							/>
						</div>
						<div className="col-4">
							<Button variant="secondary" shape="flat" fill="ghost" full onClick={handlePrev}>
								<SVGIcon name="left" height={15} width={10} /> Prev
							</Button>
						</div>
						<div className="col-4" />
						<div className="col-4">
							<Button variant="secondary" shape="flat" fill="ghost" full onClick={handleNext}>
								Next <SVGIcon name="right" height={15} width={10} />
							</Button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Question1;
