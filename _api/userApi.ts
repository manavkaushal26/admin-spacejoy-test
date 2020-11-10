export const userApi: () => string = () => {
	return "/admin/users";
};

export const getSingleUserApi = (userId: string): string => {
	return `/user/${userId}`;
};

export const registerAnyUserApi = (): string => {
	return "/auth/register/all";
};

export const suspendUserApi = (id: string): string => {
	return `/auth/account/${id}/suspend`;
};

export const statusChangeApi = (id: string): string => {
	return `/auth/account/${id}/status`;
};

export const teamAssignApi: (id: string, type: "project" | "design", action: "add" | "remove") => string = (
	id,
	type,
	action
) => {
	if (type === "project") {
		return `/admin/project/${id}/team/${action}`;
	}
	return `/admin/design/${id}/team/${action}`;
};

export const newTeamAssignApi = (id: string): string => {
	return `/v2/projects/${id}/teams`;
};
export const fetchChatAssets = (project: string, design: string): string => {
	return `/v1/userProjectDiscussions?project=${project}&design=${design}`;
};
