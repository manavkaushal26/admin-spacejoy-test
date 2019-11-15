import { Status } from "./userType";

export enum ProjectScope {
	customer = "customer",
	designer = "designer"
}

export interface UserProjectType {
	_id: string;
	avatar: string;
	projectScope: ProjectScope;
	status: Status | "";
	order: string;
	name: string;
	customer: string;
	currentPhase: {
		name: {
			internalName: string;
			customerName?: string;
		};
		id: string | null;
	};
}
