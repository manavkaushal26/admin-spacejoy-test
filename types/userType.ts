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
	Guest = "guest",
	"3D Artist" = "3d artist",
	BlogAuthor = "blogAuthor",
	BlogAdmin = "blogAdmin",
	"Senior 3D Artist" = "senior3dArtist",
	"Assistant Designer" = "assistantDesigner",
}

export enum ProjectRoles {
	Designer = "designer",
	"Account Manager" = "account manager",
	Administrator = "admin",
	"3D Artist" = "3d artist",
	"Senior 3D Artist" = "senior3dArtist",
	"Assistant Designer" = "assistantDesigner",
}

export enum Status {
	active = "active",
	pending = "pending",
	suspended = "suspended",
	closed = "closed",
	inactive = "inactive",
	completed = "completed",
}

export enum AssetStatus {
	Active = "active",
	Pending = "pending",
	Suspended = "suspended",
	Inactive = "inactive",
	Discontinued = "discontinued",
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
