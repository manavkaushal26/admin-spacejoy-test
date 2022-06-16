import { PhaseInternalNames } from "@customTypes/dashboardTypes";

export const updateProjectPhase = (projectId: string, phase?: PhaseInternalNames): string => {
	return `/admin/project/${projectId}/phase${phase ? `?phase=${phase}` : ""}`;
};

export const editProjectApi = (projectId: string): string => {
	return `/project/${projectId}`;
};

export const notifyCustomerApi = (projectId: string): string => {
	return `/admin/project/${projectId}/notify`;
};

export const startProjectApi = (projectId: string): string => {
	return `/admin/project/${projectId}/timeline`;
};

export const delayProjectApi = (projectId: string): string => {
	return `/project/${projectId}/delay`;
};

export const searchProjectsApi = (): string => {
	return "/v2/projects/search";
};

export const searchProjectsCountApi = (): string => {
	return "/v1/projects/count";
};

/**
 * Returns endpoint to retrieve revision form for a project
 * @param projectId Project Id for which form will be fetched
 */
export const getRevisionFormForProjectId = (projectId: string): string => {
	return `/v2/project/${projectId}/revision/form`;
};

export const editRevisionFormAPI = (projectId: string): string => {
	return `/v2/project/${projectId}/revision/form`;
};

export const changeToDARAPI = (projectId: string): string => {
	return `/v2/project/${projectId}/revision/dar`;
};

export const getProjectTimelineApi = (projectId: string) => {
	return `/v1/projects/${projectId}/timeline`;
};

// APIs for incentive feature
export const getLeaderBoardApiEndpoint = (): string => {
	return "/v1/admin/designer/leaderboards";
};

export const getCartInformationApiEndpoint = (): string => {
	return "/v1/admin/cart/information";
};

export const getShoppingDataApiEndpoint = (): string => {
	return "/v1/admin/shopping/information";
};

export const getIncentiveCalApiEndpoint = (): string => {
	return "/v1/admin/calculate/incentive";
};

export const getProjectsOverviewApiEndpoint = (): string => {
	return "/v1/admin/project/overview";
};

export const getOrderFromOrderIdApiEndpoint = (): string => {
	return "/v1/admin/order/cartitems";
};
