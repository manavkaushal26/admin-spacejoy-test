import Button from "@components/Button";
import SVGIcon from "@components/SVGIcon";
import React, { useState } from "react";
import styled from "styled-components";

const QuizHeaderStyled = styled.div`
	margin: 4rem 0;
	h2 {
		margin: 0;
	}
`;
const RadioCard = styled(Button)`
	height: 190px;
	border-radius: 2px;
	background: ${({ theme, image }) => `${theme.colors.bg.light2} url(${image}) no-repeat`};
	background-size: cover;
	background-position: bottom;
	border: 1px solid ${({ theme, isActive }) => (isActive ? theme.colors.primary1 : "transparent")};
	width: 100%;
	color: ${({ theme }) => theme.colors.fc.dark2};
	&:hover {
		border: 1px solid ${({ theme }) => theme.colors.fc.dark3};
		color: ${({ theme }) => theme.colors.fc.dark1};
	}
	&.active {
		font-weight: bold;
		box-shadow: 0 0 10px 0px rgba(0, 0, 0, 0.15);
		border: 1px solid ${({ theme }) => theme.colors.primary1};
		color: ${({ theme }) => theme.colors.primary1};
		svg {
			path {
				fill: ${({ theme }) => theme.colors.primary1};
			}
		}
	}
	span {
		position: absolute;
		top: 2rem;
		left: 2rem;
		svg {
			path {
				fill: ${({ theme }) => theme.colors.fc.dark3};
			}
		}
	}
`;

function q1() {
	const [roomType, setRoomType] = useState("");

	const handleClick = e => {
		setRoomType(e.target.value);
		console.log("e", e.target.value);
	};

	return (
		<div className="container">
			<div className="grid justify-center">
				<div className="col-10 ">
					<div className="text-center">
						<QuizHeaderStyled>
							<h2>Which room are you designing?</h2>
							<small>Let&apos;s start by helping your designers understand which rooms you prefer.</small>
						</QuizHeaderStyled>
						<div className="grid">
							<div className="col-6 col-md-4">
								<RadioCard
									type="button"
									value="Living Room"
									raw
									onClick={handleClick}
									className={roomType === "Living Room" ? "active" : ""}
									image="https://res.cloudinary.com/spacejoy/image/upload/v1570108165/web/living-room-tile_jzgyzi.png"
								>
									<span>
										<SVGIcon name="tick" height={13} width={20} /> Living Room
									</span>
								</RadioCard>
							</div>
							<div className="col-6 col-md-4">
								<RadioCard
									type="button"
									value="Bedroom"
									raw
									onClick={handleClick}
									className={roomType === "Bedroom" ? "active" : ""}
									image="https://res.cloudinary.com/spacejoy/image/upload/v1570108165/web/bedroom-tile_serfct.png"
								>
									<span>
										<SVGIcon name="tick" height={13} width={20} /> Bedroom
									</span>
								</RadioCard>
							</div>
							<div className="col-6 col-md-4">
								<RadioCard
									type="button"
									value="Entryway"
									raw
									onClick={handleClick}
									className={roomType === "Entryway" ? "active" : ""}
								>
									<span>
										<SVGIcon name="tick" height={13} width={20} /> Entryway
									</span>
								</RadioCard>
							</div>
							<div className="col-6 col-md-4">
								<RadioCard
									type="button"
									value="Kid's Bedroom"
									raw
									onClick={handleClick}
									className={roomType === "Kid's Bedroom" ? "active" : ""}
								>
									<span>
										<SVGIcon name="tick" height={13} width={20} /> Kid&apos;s Bedroom
									</span>
								</RadioCard>
							</div>
							<div className="col-6 col-md-4">
								<RadioCard
									type="button"
									value="Studio"
									raw
									onClick={handleClick}
									className={roomType === "Studio" ? "active" : ""}
								>
									<span>
										<SVGIcon name="tick" height={13} width={20} /> Studio
									</span>
								</RadioCard>
							</div>
							<div className="col-6 col-md-4">
								<RadioCard
									type="button"
									value="Nursery"
									raw
									onClick={handleClick}
									className={roomType === "Nursery" ? "active" : ""}
								>
									<span>
										<SVGIcon name="tick" height={13} width={20} /> Nursery
									</span>
								</RadioCard>
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
		</div>
	);
}

export default q1;
