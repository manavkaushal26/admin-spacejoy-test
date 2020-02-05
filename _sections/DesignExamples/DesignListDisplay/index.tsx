import React, { useReducer, useEffect } from "react";
import { Row } from "antd";
import fetcher from "@utils/fetcher";
import { getDesignList } from "@api/designApi";
import DesignCard from "@components/DesignCard";
import { getValueSafely, getHumanizedActivePhase } from "@utils/commonUtils";
import { DesignImgTypes } from "@customTypes/dashboardTypes";
import { DesignListDisplayInitialState, DesignListDisplayReducer, DesignListAction } from "./reducer";

const DesignListDisplay = () => {
	const [state, dispatch] = useReducer(DesignListDisplayReducer, DesignListDisplayInitialState);

	const fetchDesign = async () => {
		let endPoint = getDesignList();
		endPoint += "?sort=-1&keyword=designScope:portfolio";
		const response = await fetcher({ endPoint, method: "GET" });
		dispatch({
			type: DesignListAction.UPDATE_DESIGN_STATE,
			value: { designs: response.data.data, count: response.data.count },
		});
	};

	useEffect(() => {
		fetchDesign();
	}, []);

	return (
		<Row gutter={[8, 8]} type="flex" style={{ padding: "0 10px" }}>
			{state.designs.map(design => {
				return (
					<DesignCard
						key={design._id}
						uniqueId={design._id}
						onSelectCard={id => {}}
						coverImage={`q_80/${getValueSafely(
							() => design.designImages.filter(image => image.imgType === DesignImgTypes.Render)[0].cdn,
							process.env.NODE_ENV === "production"
								? "v1574869657/shared/Illustration_mffq52.svg"
								: "v1578482972/shared/Illustration_mffq52.svg"
						)}`}
						designName={design.name}
						phase={getHumanizedActivePhase(design.phases)}
					/>
				);
			})}
		</Row>
	);
};

export default DesignListDisplay;
