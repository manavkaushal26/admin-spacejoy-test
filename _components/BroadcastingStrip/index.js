// import PulseDot from "@components/PulseDot";
import CountdownWatch from "@components/CountdownWatch";
import PulseDot from "@components/PulseDot";
import React from "react";
import styled from "styled-components";

const BroadcastingStrip = styled.div`
	z-index: 100;
	background: ${({ theme }) => theme.colors.fc.dark1};
	color: ${({ theme }) => theme.colors.white};
	display: flex;
	align-items: center;
	height: 45px;
	@media (min-width: 575px) {
		p.is-mobile {
			display: none;
			position: relative;
		}
		p.is-desktop {
			display: block;
			position: relative;
		}
	}
	@media (max-width: 575px) {
		p.is-mobile {
			padding: 4px;
			position: relative;
			display: block;
		}
		p.is-desktop {
			position: relative;
			font-size: 0.85em;
		}
	}
	p {
		color: white;
		margin: 0 0.5rem;
		span.hide-xs {
			@media (max-width: 575px) {
				display: none;
			}
		}
	}
	@media (max-width: 360px) {
		.timer {
			display: none;
		}
	}
`;
const CountDownStyled = styled.div`
	z-index: 1;
	display: inline-block;
	@media (max-width: 1200px) {
		.time-unit {
			margin-right: 0;
		}
	}
	.time-unit {
		color: #fff;
	}
`;
function index({ broadcastingStripData }) {
	return (
		<BroadcastingStrip className='text-center'>
			{/* <Link href="/offers/happiness-sale" as="/offers/happiness-sale">
				<a href="/offers/happiness-sale"> */}
			<p className='is-desktop'>
				{broadcastingStripData?.beforePulseDot}
				{broadcastingStripData?.pulseDot && <PulseDot />}
				{broadcastingStripData?.afterPulseDot}
				<span className=''>
					{broadcastingStripData?.isHighlightCoupon ? " Use code:" : ""}
					<strong className='text-red'> {broadcastingStripData?.highlightText}</strong>
				</span>
				<span> {broadcastingStripData?.afterCoupon}</span>
				&nbsp;
				{broadcastingStripData?.timerVisible && (
					<span className='timer'>
						Sale ends in:{" "}
						<CountDownStyled>
							<CountdownWatch days={broadcastingStripData?.time?.valueOf()} />
						</CountDownStyled>
					</span>
				)}
			</p>
			{/* </a>
			</Link> */}
		</BroadcastingStrip>
	);
}

export default React.memo(index);
