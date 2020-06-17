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
	return `/admin/projects/search`;
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
