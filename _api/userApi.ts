export const userApi: () => string = () => {
	return `/admin/users`;
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
