import SectionHeader from "@sections/SectionHeader/v2";
import PropTypes from "prop-types";
import React from "react";
import Countdown from "react-countdown";
import styled from "styled-components";

const CountdownStyled = styled.div`
	display: flex;
	align-items: center;
	.temp-text {
		float: left;
		margin-right: 8px;
		font-size: 16px;
		font-weight: 600;
	}
	.time-unit {
		float: left;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		margin-right: 0.2rem;
		color: "white";
		.number {
			font-size: 1.2rem;
			line-height: 0rem;
			margin: 1rem 0;
			@media (max-width: 768px) {
				font-size: 1rem;
				margin: 1rem 0;
			}
			@media (max-width: 576px) {
				font-size: 0.9rem;
			}
		}
		.text {
			font-size: 0.75rem;
			white-space: nowrap;
			text-overflow: ellipsis;
			@media (max-width: 768px) {
				font-size: 0.5rem;
			}
			@media (max-width: 576px) {
				font-size: 0.6rem;
			}
		}
	}
`;

const CompletionList = () => (
	<SectionHeader size={1}>
		<SectionHeader.Title>
			<p>Offer Extended by Popular Demand</p>
		</SectionHeader.Title>
	</SectionHeader>
);

const renderer = ({ hours, minutes, seconds, completed }) =>
	completed ? (
		<CompletionList />
	) : (
		<CountdownStyled>
			{/* <SectionHeader size={1}>
        <SectionHeader.Title>
          <h2>Our designer has started working on your designs</h2>
          <p>
            We will send you an email<sup>*</sup> as soon as they are ready.
            <br />
            <small>
              <sup>*</sup>Don&apos;t forget to check your spam folder
            </small>
          </p>
        </SectionHeader.Title>
        <SectionHeader.Description>
          <p className="text-primary1">Your designs will be ready in -</p>
        </SectionHeader.Description>
      </SectionHeader> */}
			{/* <div className="time-unit">
        <h2 className="number">{days}</h2>
        <span className="text">Days</span>
      </div> */}
			{/* <div className="time-unit">
        <h2 className="number">:</h2>
      </div> */}
			{/* <span className="temp-text">Ends in</span> */}
			<span className='time-unit'>
				<h2 className='number'>{hours.toString().padStart(2, "0")}</h2>
				{/* <span className="text">Hours</span> */}
			</span>
			<span className='time-unit'>
				<h2 className='number'>:</h2>
			</span>
			<span className='time-unit'>
				<h2 className='number'>{minutes.toString().padStart(2, "0")}</h2>
				{/* <span className="text">Minutes</span> */}
			</span>
			<span className='time-unit'>
				<h2 className='number'>:</h2>
			</span>
			<span className='time-unit'>
				<h2 className='number'>{seconds.toString().padStart(2, "0")}</h2>
				{/* <span className="text">Seconds</span> */}
			</span>
		</CountdownStyled>
	);

function CountdownWatch({ days }) {
	return <Countdown date={days} renderer={renderer} />;
}

CountdownWatch.propTypes = {
	days: PropTypes.number.isRequired,
};

export default React.memo(CountdownWatch);
