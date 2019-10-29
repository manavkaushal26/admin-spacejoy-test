/* eslint-disable */
import Button from "@components/Button";
import Divider from "@components/Divider";
import Modal from "@components/Modal";
import SVGIcon from "@components/SVGIcon";
import fetcher from "@utils/fetcher";
import PropTypes from "prop-types";
import React, { useState } from "react";
import styled from "styled-components";

const ConceptToolBarStyled = styled.div`
	padding: 1rem 0;
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
	const [modalName, setModalName] = useState("");

	const closeModal = () => setModalVisibility(false);

	const openModal = modalName => {
		setModalName(modalName);
		setModalVisibility(true);
	};

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
					Finalize
				</Button>
			</>
		);
	};

	const renderRevise = () => {
		return <div>revise</div>;
	};

	const feedback = e => setFeedback(e.target.value);

	const sendFeedBack = () => {
		const formBody = {
			project: pid,
			formData: [
				{
					entry: "",
					question: "",
					answer: ""
				}
			],
			text: feedback,
			rating: 5
		};
		fetcher({ endPoint: `/feedback`, method: "POST", body: { formBody } }).then(() => {});
	};

	const changePhase = () => {
		setSubmitInProgress(true);
		let formBody = {};
		if (modalName === "finalize") {
			formBody = {
				finalizeDesign: true,
				reviseDesign: false
			};
		} else {
			formBody = {
				finalizeDesign: false,
				reviseDesign: true
			};
		}
		fetcher({
			endPoint: `/user/dashboard/project/${pid}/design/${did}`,
			method: "PUT",
			body: { formBody }
		}).then(() => {
			setSubmitInProgress(false);
		});
	};

	return (
		<ConceptToolBarStyled>
			<Button variant="primary" size="sm" onClick={() => openModal("finalize")}>
				<SVGIcon name="heart" height={12} width={12} fill="#ffffff" /> Finalize
			</Button>
			<Button fill="ghost" size="sm" onClick={() => openModal("revise")}>
				<SVGIcon name="download" height={12} width={12} /> Revise
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
