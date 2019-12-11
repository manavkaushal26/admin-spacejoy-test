export const userApi: () => string = () => {
	return `/admin/users`;
};

export const addTeamMemberApi: (projectId: string) => string = projectId => {
	return `/admin/project/${projectId}/team`;
};
