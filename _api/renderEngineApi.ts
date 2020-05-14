export const getAllSources = (): string => {
	return `https://krmasternode.spacejoy.com/api/v1/sources?status=active`;
};

export const getSingleSource = (sourceId: string): string => {
	return `https://krmasternode.spacejoy.com/api/v1/source/${sourceId}`;
};

export const getAllJobs = (sourceId): string => {
	return `https://krmasternode.spacejoy.com/api/v1/source/${sourceId}/jobs?status=all`;
};

export const getSingleJobs = (sourceId: string, jobId: string): string => {
	return `https://krmasternode.spacejoy.com/api/v1/source/${sourceId}/job/${jobId}`;
};

export const createSourceApi = (): string => {
	return `https://krmasternode.spacejoy.com/api/v1/source`;
};

export const createJobApi = (sourceId: string): string => {
	return `https://krmasternode.spacejoy.com/api/v1/source/${sourceId}/job`;
};

export const sourceUploadFileApi = (sourceId: string): string => {
	return `https://krmasternode.spacejoy.com/api/v1/source/${sourceId}/file`;
};

export const startRenderJob = (sourceId: string, jobId: string): string => {
	return `https://krmasternode.spacejoy.com/api/v1/source/${sourceId}/job/${jobId}/process`;
};
