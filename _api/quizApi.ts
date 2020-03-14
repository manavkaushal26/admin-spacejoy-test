export const setQuizReviewApi = (projectId: string): string => {
	return `/project/${projectId}/add-remarks`;
};

export const getQuizSectionsApi = (projectId: string, sort = 1): string => {
	return `/admin/quizsections?sort=${sort}&projectId=${projectId}`;
};
