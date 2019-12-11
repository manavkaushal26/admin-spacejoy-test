export enum Role {
	Owner = "owner",
	Admin = "admin",
	Team = "team",
	Designer = "designer",
	"Account Manager" = "account manager",
	Vendor = "vendor",
	Analyst = "analyst",
	Customer = "customer",
	ServiceAcc = "service",
	Guest = "guest"
}

export enum ProjectRoles {
	Designer = "designer",
	"Account Manager" = "account manager",
	Administrator = "admin"
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
