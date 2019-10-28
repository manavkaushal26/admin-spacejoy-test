import Button from "@components/Button";
import Divider from "@components/Divider";
import Image from "@components/Image";
import Modal from "@components/Modal";
import PropTypes from "prop-types";
import React, { useState } from "react";
import styled from "styled-components";
import ConceptToolBar from "./ConceptToolBar";

const OrderConceptStyled = styled.div`
	height: 100%;
	h3 {
		margin-bottom: 0;
		& + {
			h5 {
				color: ${({ theme }) => theme.colors.fc.dark2};
				font-weight: normal;
				text-transform: uppercase;
			}
		}
	}
`;

function OrderConcept({ project }) {
	const [modalVisibility, setModalVisibility] = useState(false);

	const toggleModal = () => setModalVisibility(!modalVisibility);

	return (
		<OrderConceptStyled>
			<div className="grid">
				{project.designs.map(design => (
					<div className="col-xs-6" key={design.designId}>
						<h3>Concept #{design.designConcept}</h3>
						<h5>
							<strong>CONCEPT Name : </strong> {design.designName} <br />
							<strong>CONCEPT ID : </strong> {design.designId}
						</h5>
						<Image
							width="100%"
							src="https://api.homefuly.com/projects/5d5116716ec2df1947e6280c/rooms/5d7b3a0e0eefdd279a564f1a/versions/5da02283f791b977e0336c7d/designimages/final%201_c.png"
						/>
						<ConceptToolBar id={design.designId} />
						<p>
							{"Lorem ipsum dolor sit amet consectetur adipisicing elit. Corrupti optio, repellat maiores voluptatum expedita hic reiciendis laborum tenetur veritatis aut error illo consequuntur odio quidem doloribus eius ipsum eveniet adipisci" ||
								design.description}
						</p>
						<Divider />
						<div className="grid">
							<div className="col-12 text-center">
								<Button variant="primary" shape="rounded" onClick={toggleModal}>
									Finalize Design
								</Button>
							</div>
						</div>
					</div>
				))}
			</div>
			<Modal isModalOpen={modalVisibility} close={toggleModal}>
				hi
			</Modal>
		</OrderConceptStyled>
	);
}

OrderConcept.defaultProps = {
	project: {},
	authVerification: {
		name: "",
		email: ""
	}
};

OrderConcept.propTypes = {
	authVerification: PropTypes.shape({
		name: PropTypes.string,
		email: PropTypes.string
	}),
	project: PropTypes.shape({
		designs: PropTypes.arrayOf(
			PropTypes.shape({
				designId: PropTypes.string,
				designConcept: PropTypes.number,
				designName: PropTypes.string,
				designDescription: PropTypes.string,
				designBanner: PropTypes.string
			})
		)
	})
};

export default OrderConcept;
