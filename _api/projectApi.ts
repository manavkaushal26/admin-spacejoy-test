import { PhaseInternalNames } from "@customTypes/dashboardTypes";

export const updateProjectPhase = (projectId: string, phase?: PhaseInternalNames): string => {
	return `/admin/project/${projectId}/phase${phase ? `?phase=${phase}` : ""}`;
};
