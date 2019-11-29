interface UserApiProps {
	role?: string;
	name?: string;
}
export const userApi: (UserApiProps) => string = ({ role, name }) => {
	return `/admin/users?keyword=role${role ? `:${role}` : ""},profile.name${name ? `:${name}` : ""}`;
};

export const addTeamMemberApi: (projectId: string) => string = projectId => {
	return `/admin/project/${projectId}/team`;
};
