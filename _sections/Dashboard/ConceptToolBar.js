import Button from "@components/Button";
import Modal from "@components/Modal";
import SVGIcon from "@components/SVGIcon";
import React, { useState } from "react";
import styled from "styled-components";

const ConceptToolBarStyled = styled.div`
	text-align: center;
	svg {
		&:hover {
			path {
				fill: ${({ theme }) => theme.colors.accent};
			}
		}
		path {
			fill: ${({ theme }) => theme.colors.fc.dark2};
		}
	}
`;

export default function ConceptToolBar() {
	const [modalVisibility, setModalVisibility] = useState(false);

	const toggleModal = () => setModalVisibility(!modalVisibility);

	return (
		<ConceptToolBarStyled>
			<Button fill="clean" onClick={toggleModal}>
				<SVGIcon name="heart" height={15} width={15} />
			</Button>
			<Button fill="clean">
				<SVGIcon name="download" height={15} width={15} />
			</Button>
			<Button fill="clean">
				<SVGIcon name="note" height={15} width={15} />
			</Button>
			<Modal isModalOpen={modalVisibility} close={toggleModal}>
				<h3>We&apos;re happy to know that you are ready to finalise your design.</h3>
				<p>Once you click on Proceed, we&apos;ll let your designer know that you have successfully checked out.</p>
				<p>Happy shopping to you!</p>
			</Modal>
		</ConceptToolBarStyled>
	);
}
