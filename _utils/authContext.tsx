import User from "@customTypes/userType";
import { ServerResponse } from "http";
import cookie from "js-cookie";
import { NextPage } from "next";
import Router, { useRouter } from "next/router";
import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { cookieNames } from "./config";
import { allowedRoles } from "./constants";
import fetcher from "./fetcher";
import getCookie from "./getCookie";
import { setLocalStorageValue } from "./storageUtils";

interface AuthContext {
	isAuthenticated: boolean;
	user: Partial<User>;
	isAuthenticating: boolean;
	login: (loginParams: { email: string; password: string; redirectUrl: string }) => Promise<string>;
	logout: () => Promise<void>;
}

export const redirectToLocation = ({
	pathname,
	query = {},
	url,
	res,
	options = {},
}: {
	pathname: string;
	query?: Record<string, string>;
	url?: string;
	res?: ServerResponse;
	options?: { shallow?: boolean };
}): void => {
	if (typeof window !== "undefined") {
		Router.push({ pathname, query }, url, options);
	} else {
		res.writeHead(302, {
			Location: url,
		});
		res.end();
	}
};

export const AuthContext = createContext<Partial<AuthContext>>({});

const endPointAuthCheck = "/auth/check";

interface AuthProvider {
	children: ReactNode | string;
}

export function clearAllStorage(): void {
	cookie.remove(cookieNames.userRole);
	cookie.remove(cookieNames.authToken);
	window.localStorage.clear();
}

export const AuthProvider: NextPage<AuthProvider> = ({ children }) => {
	const [user, setUser] = useState<Partial<User>>({});
	const [authenticating, setAuthenticating] = useState(true);

	useEffect(() => {
		const authVerification = JSON.parse(window.localStorage.getItem("authVerification"));
		setUser(authVerification || {});
	}, []);

	useEffect(() => {
		async function loadUserFromCookies() {
			const token = getCookie(cookieNames.authToken);
			if (token) {
				const { data: user } = await fetcher({ endPoint: endPointAuthCheck, method: "GET" });
				if (user) setUser(user);
			}
			setAuthenticating(false);
		}
		loadUserFromCookies();
	}, []);

	const login = async ({ email, password, redirectUrl }: { email: string; password: string; redirectUrl: string }) => {
		const response = await fetcher({
			endPoint: "/auth/login",
			method: "POST",
			body: {
				email,
				password,
			},
		});

		if (response.statusCode <= 300) {
			const { token, user } = response.data;
			clearAllStorage();
			if (allowedRoles.includes(user.role)) {
				cookie.set(cookieNames.authToken, token, { expires: 365 });
				cookie.set(cookieNames.userRole, user.role, { expires: 365 });
				setLocalStorageValue("authVerification", user);
				setUser(user);
				const url = redirectUrl || "/launchpad";
				redirectToLocation({ pathname: url, url });
				return "success";
			} else {
				return "role not allowed";
			}
		} else {
			return "error";
		}
	};

	async function logout(): Promise<void> {
		await fetcher({ endPoint: "/auth/logout", method: "POST", body: {} });
		clearAllStorage();
		window.localStorage.setItem("logout", Date.now().toString());
		redirectToLocation({
			pathname: "/auth",
			query: { flow: "login", redirectUrl: "/launchpad" },
			url: "/auth/login?redirectUrl=/launchpad",
		});
	}

	return (
		<AuthContext.Provider value={{ isAuthenticated: !!user.id, user, isAuthenticating: authenticating, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
};

export default function useAuth(): Partial<AuthContext> {
	const context = useContext(AuthContext);
	return context;
}

export function ProtectRoute<T>(Component: React.ComponentType<T>): React.ComponentType<T> {
	const ProtectedRoute = (props: T) => {
		const { isAuthenticated, isAuthenticating } = useAuth();
		const router = useRouter();

		useEffect(() => {
			if (!isAuthenticated && !isAuthenticating) router.push("/login");
		}, [isAuthenticating, isAuthenticated]);

		return <Component {...props} />;
	};
	return ProtectedRoute;
}
