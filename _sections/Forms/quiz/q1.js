import Button from "@components/Button";
import SVGIcon from "@components/SVGIcon";
import RadioCard from "@sections/Cards/radio";
import React, { useState } from "react";
import QuizHeader from "./QuizHeader";

function Q1() {
	const [roomType, setRoomType] = useState("");

	const handleClick = e => setRoomType(e.target.value);

	return (
		<div className="container">
			<div className="grid justify-center">
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
								image="https://res.cloudinary.com/spacejoy/image/upload/v1570108165/web/living-room-tile_jzgyzi.png"
							/>
						</div>
						<div className="col-6 col-md-4">
							<RadioCard
								value="Bedroom"
								onClick={handleClick}
								checked={roomType === "Bedroom"}
								image="https://res.cloudinary.com/spacejoy/image/upload/v1570108165/web/bedroom-tile_serfct.png"
							/>
						</div>
						<div className="col-6 col-md-4">
							<RadioCard value="Entryway" onClick={handleClick} checked={roomType === "Entryway"} />
						</div>
						<div className="col-6 col-md-4">
							<RadioCard value="Kid's Bedroom" onClick={handleClick} checked={roomType === "Kid's Bedroom"} />
						</div>
						<div className="col-6 col-md-4">
							<RadioCard value="Studio" onClick={handleClick} checked={roomType === "Studio"} />
						</div>
						<div className="col-6 col-md-4">
							<RadioCard value="Nursery" onClick={handleClick} checked={roomType === "Nursery"} />
						</div>
						<div className="col-4">
							<Button variant="secondary" shape="flat" fill="ghost" full>
								<SVGIcon name="left" height={15} width={10} /> Prev
							</Button>
						</div>
						<div className="col-4" />
						<div className="col-4">
							<Button variant="secondary" shape="flat" fill="ghost" full>
								Next <SVGIcon name="right" height={15} width={10} />
							</Button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Q1;
