/* eslint-disable */
import Button from "@components/Button";
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

function ConceptToolBar({ designId, project }) {
	const [modalVisibility, setModalVisibility] = useState(false);

	const closeModal = () => setModalVisibility(false);

	const openModal = () => setModalVisibility(true);

	const feedback = e => setFeedback(e.target.value);

	const sendFeedBack = () => {
		const formBody = {
			project: project.id,
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

	const reviseDesign = () => {
		setSubmitInProgress(true);
		let formBody = {};
		if (modalName === "Finalize") {
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
			endPoint: `/user/dashboard/project/${project.id}/design/${designId}`,
			method: "PUT",
			body: { formBody }
		}).then(() => {
			setSubmitInProgress(false);
		});
	};

	return (
		<ConceptToolBarStyled>
			<Button variant="primary" size="sm" onClick={openModal}>
				<SVGIcon name="heart" height={12} width={12} fill="#ffffff" /> Finalize
			</Button>
			<Button fill="ghost" size="sm" onClick={openModal}>
				<SVGIcon name="download" height={12} width={12} /> Revise
			</Button>
			<Button fill="clean">
				<SVGIcon name="note" height={12} width={12} />
			</Button>
			<Modal isModalOpen={modalVisibility} close={closeModal}>
				<h3>We&apos;re happy to know that you are ready to finalize your design.</h3>
				<p>Once you click on Proceed, we&apos;ll let your designer know that you have successfully checked out.</p>
				<p>Happy shopping to you!</p>
			</Modal>
		</ConceptToolBarStyled>
	);
}

ConceptToolBar.propTypes = {
	did: PropTypes.string.isRequired,
	pid: PropTypes.string.isRequired
};

export default ConceptToolBar;
