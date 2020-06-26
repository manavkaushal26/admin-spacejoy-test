import React, { useEffect, useState } from "react";
import { Row, Col, Pagination, Spin, notification } from "antd";
import fetcher from "@utils/fetcher";
import { getDesignSearchApi } from "@api/designApi";
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

	const [loading, setLoading] = useState<boolean>(false);

	const fetchDesign = async (): Promise<void> => {
		setLoading(true);
		let endPoint = getDesignSearchApi();
		endPoint += `?sort=-1&skip=${(state.pageNo - 1) * 24}&limit=24`;
		const response = await fetcher({
			endPoint,
			method: "POST",
			body: {
				data: {
					name: { search: "single", value: state.searchText },
					roomType: { search: "array", value: state.roomTypeFilter },
					phases: { search: "array", value: state.phaseFilter },
					status: { search: "single", value: state.statusFilter },
					designScope: { search: "single", value: "portfolio" },
				},
			},
		});
		if (response.statusCode <= 300) {
			dispatch({
				type: DesignListAction.UPDATE_DESIGN_STATE,
				value: { designs: response.data.data, count: response.data.count },
			});
		} else {
			notification.error({ message: "Error Fetching Data" });
		}

		setLoading(false);
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
	}, [state.pageNo, state.searchText, state.statusFilter, state.roomTypeFilter, state.phaseFilter]);

	return (
		<Spin spinning={loading}>
			<Row gutter={[0, 8]}>
				<Col span={24}>
					<Row gutter={[8, 8]}>
						{state.designs.map(design => {
							return (
								<DesignCard
									key={design._id}
									uniqueId={design._id}
									onSelectCard={onCardSelect}
									coverImage={getValueSafely(
										() => {
											const renderImages = design.designImages.filter(image => image.imgType === DesignImgTypes.Render);
											if (renderImages.length) {
												return renderImages;
											}
											throw Error;
										},
										process.env.NODE_ENV === "production"
											? [
													{
														cdn: "/v1581057410/admin/designImagePlaceholder.jpg",
														_id: "1",
														imgType: DesignImgTypes.Render,
													},
											  ]
											: [
													{
														cdn: "/v1581057545/admin/designImagePlaceholder.jpg",
														_id: "1",
														imgType: DesignImgTypes.Render,
													},
											  ]
									)}
									designName={design.name}
									phase={getHumanizedActivePhase(design.phases)}
								/>
							);
						})}
					</Row>
				</Col>
				<Col span={24}>
					<Row justify="center">
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
		</Spin>
	);
};

export default DesignListDisplay;
