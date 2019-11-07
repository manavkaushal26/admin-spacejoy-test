/* eslint-disable */
import Button from "@components/Button";
import Divider from "@components/Divider";
import Modal from "@components/Modal";
import SVGIcon from "@components/SVGIcon";
import fetcher from "@utils/fetcher";
import Router from "next/router";
import PropTypes from "prop-types";
import React, { useState } from "react";
import styled from "styled-components";

const TextareaStyled = styled.textarea`
	width: 100%;
	outline: none;
	border: 1px solid ${({ theme }) => theme.colors.bg.dark2};
`;

const ConceptToolBarStyled = styled.div`
	padding: 2rem 0;
	margin: 2rem 0;
	border-top: 1px solid ${({ theme }) => theme.colors.bg.dark2};
	border-bottom: 1px solid ${({ theme }) => theme.colors.bg.dark2};
	button {
		& + {
			button {
				margin-top: 1rem;
			}
		}
	}
	svg {
		margin-right: 0.25rem;
		&:hover {
			path {
				fill: ${({ theme }) => theme.colors.accent};
			}
		}
	}
`;

function ConceptToolBar({ did, pid }) {
	const [submitInProgress, setSubmitInProgress] = useState(false);
	const [modalVisibility, setModalVisibility] = useState(false);
	const [feedback, setFeedback] = useState("");
	const [modalName, setModalName] = useState("");

	const closeModal = () => setModalVisibility(false);

	const openModal = modalName => {
		setModalName(modalName);
		setModalVisibility(true);
	};

	const handleChange = e => setFeedback(e.currentTarget.value);

	const renderFinalize = () => {
		return (
			<>
				<h3>We&apos;re happy to know that you are ready to finalize your design.</h3>
				<p>Once you click on Proceed, we&apos;ll let your designer know that you have successfully checked out.</p>
				<p>Happy shopping to you!</p>
				<Divider />
				<Button variant="primary" fill="ghost" shape="flat" size="sm" onClick={closeModal}>
					Cancel
				</Button>
				<Button variant="primary" shape="flat" size="sm" onClick={changePhase} submitInProgress={submitInProgress}>
					Proceed
				</Button>
			</>
		);
	};

	const renderRevise = () => {
		return (
			<>
				<div className="col-xs-12 col-bleed-x">
					<h3>What do you want us to change in your design? Give us your feedback in detail here.</h3>
				</div>
				<div className="col-xs-12 col-bleed-x">
					<TextareaStyled rows="4" value={feedback} onChange={handleChange} />
				</div>
				<Divider />
				<Button variant="primary" fill="ghost" shape="flat" size="sm" onClick={closeModal}>
					Cancel
				</Button>
				<Button variant="primary" shape="flat" size="sm" onClick={sendFeedBack} submitInProgress={submitInProgress}>
					Submit
				</Button>
			</>
		);
	};

	const sendFeedBack = () => {
		setSubmitInProgress(true);
		const body = {
			data: {
				image: "https://url",
				author: "Customer Name",
				comment: feedback,
				scope: "Design",
				reference: did,
				rating: 5
			}
		};
		fetcher({ endPoint: `/project/${pid}/feedback`, method: "POST", body }).then(() => {
			setSubmitInProgress(false);
			closeModal();
		});
	};

	const changePhase = () => {
		setSubmitInProgress(true);
		let body = {
			data: {
				finalizeDesign: true,
				reviseDesign: false
			}
		};
		fetcher({
			endPoint: `/user/dashboard/project/${pid}/design/${did}`,
			method: "PUT",
			body
		}).then(() => {
			setSubmitInProgress(false);
			closeModal();
			Router.push(
				{
					pathname: "/dashboard/designView",
					query: { pid, did }
				},
				`/dashboard/designView/pid/${pid}/did/${did}`
			);
		});
	};

	return (
		<ConceptToolBarStyled>
			<Button variant="primary" full shape="rounded" onClick={() => openModal("finalize")}>
				<SVGIcon name="heart" height={12} width={12} fill="#ffffff" /> Finalize
			</Button>
			<Button fill="ghost" full shape="rounded" onClick={() => openModal("revise")}>
				<SVGIcon name="revise" height={12} width={12} /> Revise
			</Button>
			<Modal isModalOpen={modalVisibility} close={closeModal}>
				{modalName === "finalize" && renderFinalize()}
				{modalName === "revise" && renderRevise()}
			</Modal>
		</ConceptToolBarStyled>
	);
}

ConceptToolBar.propTypes = {
	did: PropTypes.string.isRequired,
	pid: PropTypes.string.isRequired
};

export default ConceptToolBar;
