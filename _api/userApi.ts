export const userApi: () => string = () => {
	return `/admin/users`;
};

export const teamAssignApi: (projectId: string, action: "add" | "remove") => string = (projectId, action) => {
	return `/admin/project/${projectId}/team/${action}`;
};
