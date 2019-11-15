export enum Role {
	admin = "admin",
	designer = "designer",
	customer = "customer",
	guest = "guest",
	service = "service",
	analyst = "analyst",
	vendor = "vendor",
	team = "team",
	owner = "owner"
}

export enum Status {
	active = "active",
	pending = "pending",
	suspended = "suspended",
	closed = "closed",
	inactive = "inactive",
	completed = "completed"
}

interface User {
	id: string;
	name: string;
	email: string;
	role: Role;
	credits: number;
	status: Status;
	tnc: boolean;
	phone: number | null;
}

export default User;
