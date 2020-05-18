export enum RenderEngineStatus {
	pending = "pending",
	waiting = "waiting",
	active = "active",
	cancelled = "cancelled",
	completed = "completed",
	failed = "failed",
	suspended = "suspended",
}

export interface AllSources {
	status: RenderEngineStatus;
	_id: string;
	name: string;
	description: string;
	createdAt: string;
	renders: string[];
}

export interface DetailedSource extends AllSources {
	jobs: DetailedJob[];
	storage: {
		url: string;
		key: string;
		bucket: string;
	};
}

export interface AllJobs {
	status: RenderEngineStatus;
	_id: string;
	name: string;
	description: string;
	createdAt: string;
	qid?: number;
}

export interface JobRenders {
	_id: string;
	url: string;
	key: string;
	bucket: string;
	meta: {
		time: string;
		jobQ: string;
		createdAt: number;
	};
}

export interface DetailedJob extends AllJobs {
	options: {
		cameraType: string;
		samples: number;
	};
	process: {
		cloud: string;
		cpu: number;
		gpu: string;
		dateAdded: string;
	};
	renders: JobRenders[];
	source: string;
	updatedAt: string;
}