import React, { useEffect } from "react";
import { Row, Col, Pagination } from "antd";
import fetcher from "@utils/fetcher";
import { getDesignListApi } from "@api/designApi";
import DesignCard from "@components/DesignCard";
import { getValueSafely, getHumanizedActivePhase } from "@utils/commonUtils";
import { DesignImgTypes } from "@customTypes/dashboardTypes";

import { useRouter } from "next/router";
import { DesignListDisplayState, DesignListAction, DesignListActionType } from "./reducer";

interface DesignListDisplay {
	state: DesignListDisplayState;
	dispatch: React.Dispatch<React.SetStateAction<DesignListActionType>>;
}

const DesignListDisplay: React.FC<DesignListDisplay> = ({ state, dispatch }) => {
	const Router = useRouter();
	const fetchDesign = async (): Promise<void> => {
		let endPoint = getDesignListApi();
		endPoint += `?sort=-1&skip=${(state.pageNo - 1) * 24}&limit=24&keyword=designScope:portfolio`;
		const response = await fetcher({ endPoint, method: "GET" });
		dispatch({
			type: DesignListAction.UPDATE_DESIGN_STATE,
			value: { designs: response.data.data, count: response.data.count },
		});
	};

	const onCardSelect = (designId): void => {
		Router.push(
			{
				pathname: `/designexamples/designExampleView`,
				query: { designId },
			},
			`/designexamples/${designId}`
		);
	};

	useEffect(() => {
		fetchDesign();
	}, [state.pageNo]);

	return (
		<Row gutter={[0, 8]} type="flex">
			<Col span={24}>
				<Row gutter={[8, 8]}>
					{state.designs.map(design => {
						return (
							<DesignCard
								key={design._id}
								uniqueId={design._id}
								onSelectCard={onCardSelect}
								coverImage={`q_60/${getValueSafely(
									() => design.designImages.filter(image => image.imgType === DesignImgTypes.Render)[0].cdn,
									process.env.NODE_ENV === "production"
										? "v1581057410/admin/designImagePlaceholder.jpg"
										: "v1581057545/admin/designImagePlaceholder.jpg"
								)}`}
								designName={design.name}
								phase={getHumanizedActivePhase(design.phases)}
							/>
						);
					})}
				</Row>
			</Col>
			<Col span={24}>
				<Row type="flex" justify="center">
					<Pagination
						hideOnSinglePage
						onChange={(pageNo): void => dispatch({ type: DesignListAction.UPDATE_PAGE_NUMBER, value: { pageNo } })}
						current={state.pageNo}
						pageSize={24}
						total={state.count}
					/>
				</Row>
			</Col>
		</Row>
	);
};

export default DesignListDisplay;
