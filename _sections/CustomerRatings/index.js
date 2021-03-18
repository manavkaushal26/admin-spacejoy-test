import React from "react";
import styled from "styled-components";
export default function index({ data }) {
	const Rating = styled.div`
		padding: 15px 10px;
		background: #c6d1d8;
	`;
	return data?.responses.length ? (
		<div>
			<Rating>
				<span>
					{data?.responses.length
						? data.responses.map(item => {
								return item?.answer.length && typeof item?.answer === "object" ? (
									<div>
										<b>{item?.question?.label || ""}</b>
										<br></br>
										{item?.answer?.map(ans => (
											<span key={ans}>&nbsp;{ans}&nbsp;</span>
										))}
									</div>
								) : (
									<span>
										<br></br>
										<b>{`${item?.question?.label}?` || ""}</b>
										<br></br>
										{item?.answer || ""}
									</span>
								);
						  })
						: null}
				</span>
			</Rating>
		</div>
	) : null;
}
